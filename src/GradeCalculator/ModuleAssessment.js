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
  const [name, setName] = useState("");
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      user.providerData.forEach((profile) => {
        setName(profile.email);
      });
    }
  });

  const saveAll = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "assessments", name), {
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

  const getAll = async () => {
    if (name) {
      const docRef = doc(db, "assessments", name);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAssessments(docSnap.data().assessments);
      }
    }
  };

  useEffect(() => {
    getAll();
  }, [name]);

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
          <div key={assessmentIndex}>
            {!assessments[assessmentIndex].isDeleted && (
              <Assessment
                key={assessmentIndex}
                assessmentIndex={assessmentIndex}
                deleteModule={deleteModule}
                newComponent={newComponent}
                deleteComponent={deleteComponent}
                getText={getText}
                updateText={updateText}
                getComponents={getComponents}
                setModuleTitle={setModuleTitle}
                getModuleTitle={getModuleTitle}
              />
            )}
          </div>
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
