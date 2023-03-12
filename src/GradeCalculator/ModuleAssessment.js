import { useState } from "react";
import { Assessment } from "./Assessment";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export function ModuleAssessment() {
  const [assessments, setAssessments] = useState([]);

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
      <Typography variant="h4" sx={{ mt: 5, fontWeight: 450 }}>
        Grade Calculator
      </Typography>

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
