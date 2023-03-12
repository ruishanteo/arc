import { useState } from "react";
import { Assessment } from "./Assessment";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export function ModuleAssessment() {
  const [numAssessments, setNumAssessments] = useState(1);
  const [assessmentTitles, setAssessmentTitles] = useState(["Assessment 1"]);
  const [assessmentDeleted, setAssessmentDeleted] = useState([]);

  const addModule = () => {
    setNumAssessments(numAssessments + 1);
    setAssessmentTitles([
      ...assessmentTitles,
      `Assessment ${numAssessments + 1}`,
    ]);
    setAssessmentDeleted([...assessmentDeleted, false]);
  };

  const deleteModule = (index) => {
    assessmentDeleted[index] = true;
    setAssessmentDeleted([...assessmentDeleted]);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mt: 5, fontWeight: 450 }}>
        Grade Calculator
      </Typography>

      {assessmentTitles.map((title, index) => {
        return (
          <>
            {!assessmentDeleted[index] && (
              <div key={index}>
                <Assessment
                  key={index}
                  index={index}
                  deleteModule={deleteModule}
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
