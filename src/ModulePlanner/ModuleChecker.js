import { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { getAuth } from "firebase/auth";
import { arrayUnion, arrayRemove, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

import { Semester } from "./Semester";
import { ProgRequirements } from "./ProgRequirements";
import { CommonRequirements } from "./CommonRequirements";
import { UnrestrictedRequirements } from "./UnrestrictedRequirements";
import { db, deleteContentPlanner } from "../UserAuth/Firebase.js";

import { store } from "../stores/store";
import { addNotification } from "../Notifications";

import { 
  Autocomplete, 
  Box, 
  Button, 
  Container, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableContainer, 
  Grid, 
  Typography, 
  TextField 
} from "@mui/material";

// temporarily hard-coded
const degrees = [
  { title: 'Computer Science', faculty: 'SOC', id : 2 },
  { title: 'Business Analytics', faculty: 'SOC', id: 3 },
  { title: 'Information Systems', faculty: 'SOC', id : 4},
  { title: 'Computer Engineering', faculty: 'SOC', id: 5},
  { title: 'Information Security', faculty: 'SOC', id: 6},
  { title: 'Others', faculty: 'others', id : 1},
  { title: '', faculty: '', id: 0 } ]

const options = degrees.map((option) => {
  const firstLetter = option.faculty.toUpperCase();
  return {
  firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
  ...option,
  };
})

const progs = [
  { title: '', id : 0 },
  { title: 'RC', id : 2 },
  { title: 'NUSC', id : 1 }
]


const MIN = 0;

export function ModuleChecker() {
  const [semesters, setSemesters] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [count, setCount] = useState(0);
  const [header, setHeader] = useState("Y1S1");
  const [deg1, setDeg1] = useState(options[0]);
  const [deg2, setDeg2] = useState(options[0]);
  const [deg3, setDeg3] = useState(progs[0]);
  const [modTitles, setModTitles] = useState([]);
  const [open, setOpen] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveProg = async () => {
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
  }

  const saveSem = async () => {
    await setDoc(doc(db, "programme", user.email), {
      degrees: degrees
      });
  }

  const saveAll = async (e) => {
    e.preventDefault();
    await Promise.all([saveProg(), saveSem()])
    .then(() =>
      dispatch(
        addNotification({
          message: "Saved successfully!",
          variant: "success",
        })
      )
    )
    .catch((err) =>
      dispatch(
        addNotification({
          message: `Failed to save: ${err}`,
          variant: "error",
        })
      )
    );
  };

  const saveDegree = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "programme", user.email), {
      degrees: degrees
    }).then(() =>
    dispatch(
      addNotification({
        message: "Saved successfully!",
        variant: "success",
      })
    )
  )
  .catch((err) =>
    dispatch(
      addNotification({
        message: `Failed to save: ${err}`,
        variant: "error",
      })
    )
  );
  };

  const getAll = useCallback(async () => {
    const docRef = doc(db, "semesters", user.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const sem = docSnap.data().semesters
      setSemesters(sem);
      setCount(sem[sem.length-1]?.count + 1 || 0);
    }
    const docRef2 = doc(db, "programme", user.email);
    const docSnap2 = await getDoc(docRef2);
    if (docSnap2.exists()) {
      setDegrees(docSnap2.data().degrees);
      setDeg1(options[docSnap2.data().degrees[0]?.['id']]);
      setDeg2(options[docSnap2.data().degrees[1]?.['id']]);
      setDeg3(progs[docSnap2.data().degrees[2]?.['id']]);
    } 
  }, [user]);

  const delSem = async (c) => {
    try {
      const listingRef = doc(db, "semesters", user.email);
      await updateDoc(listingRef, {
        semesters: arrayRemove(semesters[c])
      });
      const docSnap = await getDoc(listingRef);
      if (docSnap.exists()) {
        setSemesters(docSnap.data().semesters);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  const addSem = async (c) => {
    try {
      const listingRef = doc(db, "semesters", user.email);
      await setDoc(listingRef, {
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
    } catch (e) {
      console.log(e.message);
    }
  }

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
    setDeg1(options[getDegree(0)]);
    setDeg2(options[getDegree(1)]);
    setDeg3(progs[getDegree(2)])
  }

  function getDegreeTitle() {
    if (typeof degrees[0]?.title != 'undefined') {
      return degrees[0]?.title;;
    }
    return "";
  }

  function getDegreeFaculty() {
    if (typeof degrees[0]?.faculty != 'undefined') {
      return degrees[0]?.faculty;;
    }
    return "";
  }

  /*
  function updateHeader() {
    const c = count;
    console.log(c);
    const year = c % 2 === 1 ? Math.floor(c + 1 / 2) : (c / 2);
    const sem = c % 2 === 1 ? 1 : 2
    setHeader(`Y${year}S${sem}`);
  }
  */

  function addSemester() {
    setCount(count + 1);
    const c = count + 1;
    const year = c % 2 === 1 ? Math.ceil(c / 2) : (c / 2);
    const sem = c % 2 === 1 ? 1 : 2
    setHeader(`Y${year}S${sem}`);
    const head = `Y${year}S${sem}`;
    setSemesters([
      ...semesters,
      {
        header: head,
        count: count,
        isDeleted: false,
        modules: [],
      },
    ]);
    
  };

  function deleteSemester() {
    count <= MIN ? setCount(0) : setCount(count - 1);
    const c = count <= MIN ? 1 : count - 1;
    const year = c % 2 === 1 ? Math.ceil(c / 2) : (c / 2);
    const sem = c % 2 === 1 ? 1 : 2
    setHeader(`Y${year}S${sem}`);
    delSem(c);
  };

  function getHeader(index) {
    return semesters[index].header;
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
    updateModTitles();
  }

  function newModule(semIndex) {
    semesters[semIndex].modules.push({
      modInfo:{ title: '', code: '', id: 0 },
      isDeleted: false,
    });
    setSemesters([...semesters]);
    updateModTitles();
  }

  function deleteModule(semIndex, moduleIndex) {
    //semesters[semIndex].modules[moduleIndex].isDeleted = true;
    semesters[semIndex].modules.splice(moduleIndex, 1);
    updateModTitles();
  }

  function updateModTitles() {
    const arr = [];
    semesters.forEach((semester) => semester.modules.forEach((mod) => arr.push(mod.modInfo.title)));
    console.log(arr);
    setModTitles(arr);
  }

  function checkPresent(title) {
    const color = "#cff8df";
    const arr = modTitles;
    if (arr.includes(title)) {
      return color;
    } else {
      return "#FFFFFF";
    }
  }

  function getUe() {
    return [{ title: 'To Be Updated', code: '', id: 0, mc: 0 }];
  }

  const handleClear = () => {
    deleteContentPlanner(user.email);
    handleClose();
    store.dispatch(
      addNotification({
        message: "Deleted successfully!",
        variant: "success",
      })
    );
    setTimeout(() => {
      window.location.reload();
    }, 2500);
  };

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
            onClick={handleClickOpen}
            disabled={semesters.length === 0 && degrees.length === 0}
          >
            Clear
          </Button>

          <Button
            variant="contained"
            sx={{
              ml: 2,
              backgroundColor: "#fcf4d4",
              color: "black",
            }}
            onClick= {saveAll}
          >
            Save All
          </Button>
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Doing so will delete all your saved data. Click confirm to
              proceed.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ color: "#b7b0f5" }}>
              Cancel
            </Button>
            <Button onClick={handleClear} autoFocus variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
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
            value={deg1 || null}         
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
            value={deg2 || null}         
            onChange={(_, value) => {
              updateDegree(1, value);
            }}
            renderInput={(params) => <TextField {...params} label="2nd Degree/Major?" />}
            />
          </Grid>
          
          <Grid item xs={3}>
            <Autocomplete
            disablePortal
            id="addon2-selector"           
            options={progs.sort((a, b) => -b.title.localeCompare(a.title))}
            getOptionLabel={(option) => option.title}
            sx={{ width: 200 }}
            value={deg3 || null}         
            onChange={(_, value) => {
              updateDegree(2, value);
            }}
            renderInput={(params) => <TextField {...params} label="Select Programme" />}
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

      <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <Button
                variant="contained"
                onClick= {() => {
                  addSemester();
                  addSem(count);}}
                sx={{ mt: 2, mb: 10 }}
                color="neutral"
              >
                + Semesters
              </Button>
            </Grid>

            <Grid item xs={2}>
              <Button
                variant="contained"
                onClick= {() => deleteSemester()}
                sx={{ mt: 2, mb: 10 }}
                color="neutral"
              >
                - Semesters
              </Button>
            </Grid>
          </Grid>
        </Box>

      <Grid container spacing={2}>
        {semesters.map((_, semIndex) => {
        return (
          <Grid item sm={6} key={semIndex}>
            {!semesters[semIndex].isDeleted && (
              <Semester
                key={semIndex}
                semIndex={semIndex}
                deleteModule={deleteModule}
                getModuleId={getModuleId}
                updateModule={updateModule}
                getAllModules={getAllModules}
                newModule={newModule}
                getHeader={getHeader}
              />
            )}
          </Grid>
        );
      })}
      </Grid>
      
      <hr />
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
        Degree Requirements
      </Typography>
    </Box>

    <Grid container spacing={2}>
      <Grid item sm={4} >
          <div>
            {<ProgRequirements
                checkPresent={checkPresent}
                getDegreeTitle={getDegreeTitle}
              />
            }
            </div>
      </Grid>

      <Grid item sm={4} >
          <div>
            {<CommonRequirements
                checkPresent={checkPresent}
                getDegreeFaculty={getDegreeFaculty}
              />
            }
            </div>
      </Grid>

      <Grid item sm={4} >
        <div>
        {<UnrestrictedRequirements
                getUe={getUe}
              />
            }
        </div>
      </Grid>
    </Grid>

    </Container>
  );
}

/*

      */