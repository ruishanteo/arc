import { useState, useEffect } from "react";
import { Assessment } from "./Assessment";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { db } from "../Login/Firebase.js";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function ModuleAssessment() {
  const [assessments, setAssessments] = useState([]);
  const auth = getAuth();
  let name = 0;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      user.providerData.forEach((profile) => {
        name = profile.email;
      });
    }
  });

  const saveAll = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "assessments", name), {
      assessments: assessments,
    });
  };

  function getComponents(assessmentIndex) {
    return assessments[assessmentIndex].components;
  }

  function getText(assessmentIndex, componentIndex, dataKey) {
    const value =
      assessments[assessmentIndex].components[componentIndex][dataKey];
    return typeof value === "number" && !isNaN(value) ? value : 0;
  }

  function updateText(assessmentIndex, componentIndex, dataKey, value) {
    const parsed = parseInt(value);
    if (parsed != null) {
      assessments[assessmentIndex].components[componentIndex][dataKey] = parsed;
      setAssessments([...assessments]);
    }
  }

  function newComponent(assessmentIndex) {
    assessments[assessmentIndex].components.push({
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
        title: `Assessment ${assessments.length + 1}`,
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
        <Typography variant="h4" sx={{ mt: 5, fontWeight: 450 }}>
          Grade Calculator
        </Typography>
        <Button
          variant="contained"
          align="right"
          sx={{ ml: 100, mt: 5, backgroundColor: "#fcf4d4", color: "black" }}
          onClick={saveAll}
        >
          Save All
        </Button>
      </Box>

      {assessments.map((_, assessmentIndex) => {
        return (
          <>
            {!assessments[assessmentIndex].isDeleted && (
              <div key={assessmentIndex}>
                <Assessment
                  key={assessmentIndex}
                  assessmentIndex={assessmentIndex}
                  deleteModule={deleteModule}
                  newComponent={newComponent}
                  deleteComponent={deleteComponent}
                  getText={getText}
                  updateText={updateText}
                  getComponents={getComponents}
                />
              </div>
            )}
          </>
        );
      })}
      <Button
        variant="contained"
        onClick={addModule}
        sx={{ mt: 2, mb: 10 }}
        color="neutral"
      >
        + Module
      </Button>
    </Container>
  );
}
