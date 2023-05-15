import { useEffect, useCallback, useState } from "react";

import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

//import { Module } from "./Module";
import { db } from "../UserAuth/Firebase.js";

import { Autocomplete, Box, Button, Container, Grid, Typography, TextField } from "@mui/material";

export function ModuleChecker() {
  // temporarily hard-coded
  const degrees = [
    { title : 'Computer Science', faculty: 'SOC' },
    { title: 'Business Analytics', faculty: 'SOC' },
    { title: 'Information Systems', faculty: 'SOC'},
    { title: 'Computer Engineering', faculty: 'SOC'},
    { title: 'Information Security', faculty: 'SOC'},
    { title: 'Others', faculty: 'others'} ]

    const options = degrees.map((option) => {
    const firstLetter = option.faculty.toUpperCase();
  return {
    firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
    ...option,
  };
  })

  /*
  const [assessments, setAssessments] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  const saveAll = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "assessments", user.email), {
      assessments: assessments
        .filter((assessment) => !assessment.isDeleted)
        .map((assessment) => {
          return {
            ...assessment,
            components: assessment.components.filter(
              (component) => !component.isDeleted
            ),
          };
        }),
    });
  };

  const getAll = useCallback(async () => {
    const docRef = doc(db, "assessments", user.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAssessments(docSnap.data().assessments);
    }
  }, [user]);

  useEffect(() => {
    getAll();
  }, [user, getAll]);

  function getComponents(assessmentIndex) {
    return assessments[assessmentIndex].components;
  }

  function getText(assessmentIndex, componentIndex, dataKey) {
    const value =
      assessments[assessmentIndex].components[componentIndex][dataKey];
    return value;
  }

  function updateText(assessmentIndex, componentIndex, dataKey, value) {
    if (value != null) {
      assessments[assessmentIndex].components[componentIndex][dataKey] = value;
      setAssessments([...assessments]);
    }
  }

  function newComponent(assessmentIndex) {
    assessments[assessmentIndex].components.push({
      componentTitle: "",
      score: 0,
      total: 0,
      weight: 0,
      isDeleted: false,
    });
    setAssessments([...assessments]);
  }

  function deleteComponent(assessmentIndex, componentIndex) {
    assessments[assessmentIndex].components[componentIndex].isDeleted = true;
    setAssessments([...assessments]);
  }

  const addModule = () => {
    setAssessments([
      ...assessments,
      {
        title: "",
        isDeleted: false,
        components: [],
      },
    ]);
  };

  const deleteModule = (index) => {
    const updatedAssessments = [...assessments];
    updatedAssessments[index].isDeleted = true;
    setAssessments(updatedAssessments);
  };

  const setModuleTitle = (index, moduleTitle) => {
    const updatedAssessments = [...assessments];
    updatedAssessments[index].title = moduleTitle;
    setAssessments(updatedAssessments);
  };

  const getModuleTitle = (index) => {
    return assessments[index].title;
  };

  if (!user) {
    return;
  }
  */
 
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
            onClick= {() => {}}
          >
            Save All
          </Button>
        </Grid>
      </Box>
            
     <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
        <Grid item xs={4}>
        <Autocomplete
        disablePortal
        id="degree-selector"           
        options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
        groupBy={(option) => option.firstLetter}
        getOptionLabel={(option) => option.title}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Select Degree" />}
        />
        </Grid>

        <Grid item xs={4}>
        <Autocomplete
        disablePortal
        id="degree-selector"           
        options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
        groupBy={(option) => option.firstLetter}
        getOptionLabel={(option) => option.title}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Select Degree" />}
        />
        </Grid>
        
        <Grid item xs={4}>
        <Autocomplete
        disablePortal
        id="degree-selector"           
        options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
        groupBy={(option) => option.firstLetter}
        getOptionLabel={(option) => option.title}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Select Degree" />}
        />
        </Grid>
        </Grid>
      </Box>
      <Button
        variant="contained"
        onClick= {() => {}}
        sx={{ mt: 2, mb: 10 }}
        color="neutral"
      >
        + Semesters
      </Button>
    </Container>
  );
}
