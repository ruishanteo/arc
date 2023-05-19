import { useEffect, useCallback, useState } from "react";

import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { Semester } from "./Semester";
import { db } from "../UserAuth/Firebase.js";

import { Autocomplete, Box, Button, Container, Grid, Typography, TextField } from "@mui/material";
//import { SaveAltOutlined } from "@mui/icons-material";

// temporarily hard-coded
const degrees = [
  { title: 'Computer Science', faculty: 'SOC', id : 1 },
  { title: 'Business Analytics', faculty: 'SOC', id: 2 },
  { title: 'Information Systems', faculty: 'SOC', id : 3},
  { title: 'Computer Engineering', faculty: 'SOC', id: 4},
  { title: 'Information Security', faculty: 'SOC', id: 5},
  { title: 'Others', faculty: 'others', id : 0} ]

const options = degrees.map((option) => {
  const firstLetter = option.faculty.toUpperCase();
  return {
  firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
  ...option,
  };
})

const MIN = 1;


export function ModuleChecker() {
  const [semesters, setSemesters] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [count, setCount] = useState(1);
  const [header, setHeader] = useState("Y1S1");
  const auth = getAuth();
  const user = auth.currentUser;

  const saveAll = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "semesters", user.email), {
        semesters: semesters
        .filter((semester) => !semester.isDeleted)
        .map((semester) => {
          return {
            ...semester,
            modules: semester.modules.filter(
              (modules) => !modules.isDeleted
            ),
          };
        }),
    });
    await setDoc(doc(db, "programme", user.email), {
      degrees: degrees
  });
  };

  const saveDegree = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "programme", user.email), {
      degrees: degrees
    });
  };

  const getAll = useCallback(async () => {
    const docRef = doc(db, "semesters", user.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setSemesters(docSnap.data().semesters);
    }
    const docRef2 = doc(db, "programme", user.email);
    const docSnap2 = await getDoc(docRef2);
    if (docSnap2.exists()) {
      /*
      const ind = docSnap2.data().degrees.degree.id;
      setDegrees(options[ind]);
      */
     setDegrees(docSnap2.data().degrees)
    }
  }, [user]);

  useEffect(() => {
    getAll();
  }, [user, getAll]);

  function getDegree(degreeInd) {
    const ind = degrees[degreeInd]?.['id'];
    return ind;
  }

  function updateDegree(degreeInd, value) {
    const updatedDegree = degrees;
    updatedDegree[degreeInd] = value;
    setDegrees(updatedDegree);
  }

  function increaseCount() {
    setCount(count + 1);
  }

  function decreaseCount() {
    count <= MIN ? setCount(1) :
    setCount(count + 1);
  }

  function updateHeader() {
    const c = count;
    const year = Math.floor(c / 2);
    const sem = c % 2 === 1 ? 1 : 2
    setHeader(`Y${year}S${sem}`);
  }

  function addSemester() {
    increaseCount();
    updateHeader();
    setSemesters([
      ...semesters,
      {
        title: header,
        isDeleted: false,
        modules: [],
      },
    ]);
  };

  function deleteSemester(index) {
    decreaseCount();
    updateHeader();
    const updatedSemesters = [...semesters];
    updatedSemesters[index].isDeleted = true;
    setSemesters(updatedSemesters);
  };

  const getHeader = () => {
    return header;
  };

  function getAllModules(semIndex) {
    return semesters[semIndex].modules;
  }

  function getModuleId(semIndex, moduleIndex) {
    const value =
    semesters[semIndex].modules[moduleIndex].modInfo?.["id"];
    return value;
  }

  function updateModule(semIndex, moduleIndex, value) {
    if (value != null) {
      semesters[semIndex].modules[moduleIndex].modInfo = value;
      setSemesters([...semesters]);
    }
  }

  function newModule(semIndex) {
    semesters[semIndex].modules.push({
      modInfo:{ title: '', code: '', id: 0 },
      isDeleted: false,
    });
    setSemesters([...semesters]);
  }

  function deleteModule(semIndex, moduleIndex) {
    semesters[semIndex].modules[moduleIndex].isDeleted = true;
    setSemesters([...semesters]);
  }

  /*
  const setModuleTitle = (index, moduleTitle) => {
    const updatedAssessments = [...assessments];
    updatedAssessments[index].title = moduleTitle;
    setAssessments(updatedAssessments);
  };
  

  const getModuleTitle = (index) => {
    return assessments[index].title;
  };
  */

  if (!user) {
    return;
  }
 
  return (
    <Container maxWidth="lg">
      <Box
        align="center"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: 100,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 450, minWidth: 250 }}>
          Module Planner
        </Typography>
        <Grid container sx={{ display: "flex", justifyContent: "right" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#fcf4d4",
              color: "black",
            }}
            onClick= {saveAll}
          >
            Save All
          </Button>
        </Grid>
      </Box>
            
     <Box sx={{ flexGrow: 1}}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <Autocomplete
            disablePortal
            id="degree-selector"           
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            sx={{ width: 300 }}   
            value={options[getDegree(0)] || null}         
            onChange={(_, value) => {
              updateDegree(0, value);
            }}
            renderInput={(params) => <TextField {...params} label="Select Degree"/>}
            />
          </Grid>

          <Grid item xs={4}>
            <Autocomplete
            disablePortal
            id="addon-selector"           
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            sx={{ width: 300 }}
            value={options[getDegree(1)] || null}         
            onChange={(_, value) => {
              updateDegree(1, value);
            }}
            renderInput={(params) => <TextField {...params} label="Select Add-On" />}
            />
          </Grid>
          
          <Grid item xs={3}>
            <Autocomplete
            disablePortal
            id="addon2-selector"           
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            sx={{ width: 200 }}
            value={options[getDegree(2)] || null}         
            onChange={(_, value) => {
              updateDegree(2, value);
            }}
            renderInput={(params) => <TextField {...params} label="Select Add-On" />}
            />
          </Grid>

          <Grid item xs={1}>
              <Button
                variant="contained"
                onClick= {saveDegree}
                sx={{ mt: 2, mb: 5 }}
                color="neutral"
              >
                Save
              </Button>
          </Grid>
        </Grid>
      </Box>

      {semesters.map((_, semIndex) => {
        return (
          <div key={semIndex}>
            {!semesters[semIndex].isDeleted && (
              <Semester
                key={semIndex}
                semIndex={semIndex}
                
                deleteModule={deleteModule}
                getModuleId={getModuleId}
                updateModule={updateModule}
                getAllModules={getAllModules}
              />
            )}
          </div>
        );
      })}
      
    </Container>
  );
}

/*
newModule={newModule}

                addSemester={addSemester}
                deleteSemester={deleteSemester}
                getHeader={getHeader}
      */