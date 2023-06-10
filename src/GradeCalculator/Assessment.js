import React, { useState } from "react";
import { useSelector } from "react-redux";

import { store } from "../stores/store";
import {
  addComponent,
  deleteAssessment,
  updateAssessment,
} from "./GradeStore.js";

import { AssessmentComponent } from "./AssessmentComponent.js";

import {
  Box,
  Button,
  Grid,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";

import { Add, ArrowForwardIosSharp, DeleteOutline } from "@mui/icons-material";

const min = 0;
const max = 100;

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharp sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export function Assessment({ assessmentIndex }) {
  const assessment = useSelector(
    (state) => state.calculator.assessments[assessmentIndex]
  );
  const components = assessment.components;
  const [curr, setCurr] = useState("");
  const [result, setResult] = useState("");
  const [value, setValue] = useState(0);

  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  function calculateGrade() {
    const totalScore = components
      .filter((t) => t.weight > 0 && t.total > 0 && !t.isDeleted)
      .reduce((acc, cur) => acc + (cur.score / cur.total) * cur.weight, 0);
    const totalWeight = components
      .filter((t) => t.weight > 0 && t.total > 0 && !t.isDeleted)
      .reduce((acc, cur) => acc + cur.weight, 0);
    const currentScore = (totalScore / totalWeight) * 100;
    setCurr(`Current Score: ${currentScore.toFixed(2)}`);
    const sgoal = value;
    const needed = ((sgoal - totalScore) / (100 - totalWeight)) * 100;
    needed < 0
      ? setResult(`Desired score is too low!`)
      : setResult(`Score Required: ${needed.toFixed(2)}`);
  }

  return (
    <div className="title">
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          sx={{ backgroundColor: "#ffe0f7" }}
        >
          <Typography>{assessment.title}</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Stack align="center">
            <Box align="left">
              <Button
                type="button"
                onClick={() =>
                  store.dispatch(deleteAssessment(assessmentIndex))
                }
                sx={{ backgroundColor: "#fcf4d4", color: "black" }}
              >
                <DeleteOutline />
              </Button>
            </Box>

            <Box align="center">
              <TextField
                inputProps={{
                  maxLength: 10,
                  style: { fontSize: 30, textAlign: "center" },
                }}
                placeholder="Module Name"
                onChange={(e) => {
                  store.dispatch(
                    updateAssessment(assessmentIndex, e.target.value)
                  );
                }}
                value={assessment.title}
                variant="standard"
                sx={{ width: { lg: "30vw", xs: "80vw" } }}
              />
            </Box>

            <Box align="left">
              <Button
                variant="contained"
                onClick={() => store.dispatch(addComponent(assessmentIndex))}
                startIcon={<Add />}
                sx={{ mt: 2, mb: 1, width: 130 }}
                color="neutral"
              >
                Component
              </Button>
            </Box>

            <Grid
              container
              direction="row"
              sx={{
                alignItems: "center",
                backgroundColor: "#cff8df",
                fontSize: "1.2rem",
                height: "5vh",
                mb: 2,
              }}
            >
              <Grid item width="1vw" />

              <Grid item xs={5} sm={5.8} md={6}>
                <Typography
                  align="center"
                  sx={{
                    width: { lg: "31vw", md: "29vw", sm: "28vw", xs: "25vw" },
                    fontSize: {
                      lg: 18,
                      md: 18,
                      sm: 15,
                      xs: 11,
                    },
                  }}
                >
                  ASSESSMENT
                </Typography>
              </Grid>

              <Grid item xs={2} lg={1.8}>
                <Typography
                  align="center"
                  sx={{
                    width: { lg: "10vw", md: "12vw", sm: "15vw", xs: "18vw" },
                    fontSize: {
                      lg: 18,
                      md: 18,
                      sm: 15,
                      xs: 11,
                    },
                  }}
                >
                  SCORE
                </Typography>
              </Grid>

              <Grid item xs={2} lg={1.8}>
                <Typography
                  align="center"
                  sx={{
                    width: { lg: "10vw", md: "12vw", sm: "15vw", xs: "18vw" },
                    fontSize: {
                      lg: 18,
                      md: 18,
                      sm: 15,
                      xs: 11,
                    },
                  }}
                >
                  TOTAL
                </Typography>
              </Grid>

              <Grid item xs={2} md={1.5} lg={1.8}>
                <Typography
                  align="center"
                  sx={{
                    width: { lg: "10vw", md: "12vw", sm: "15vw", xs: "18vw" },
                    fontSize: {
                      lg: 18,
                      md: 18,
                      sm: 15,
                      xs: 11,
                    },
                  }}
                >
                  WEIGHTAGE
                </Typography>
              </Grid>
            </Grid>

            <Box>
              {components.map((element, componentIndex) => {
                return (
                  <Box key={componentIndex} sx={{ mb: 2 }}>
                    {!element.isDeleted && (
                      <AssessmentComponent
                        componentIndex={componentIndex}
                        assessmentIndex={assessmentIndex}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>

            <Grid container>
              <Grid item>
                <Typography sx={{ mt: 4 }}>Desired Score:</Typography>
              </Grid>

              <Grid item>
                <TextField
                  sx={{
                    mt: 2,
                    ml: 1,
                    mr: 2,
                    width: { sm: 100, md: 150 },
                    "& .MuiInputBase-root": {
                      height: 50,
                    },
                  }}
                  type="number"
                  value={value}
                  onChange={(event) => {
                    var value = parseInt(event.target.value, 10);

                    if (value > max) value = max;
                    if (value < min) value = min;

                    setValue(value);
                  }}
                  inputProps={{ min, max }}
                />
              </Grid>

              <Grid item>
                <Button
                  type="button"
                  onClick={calculateGrade}
                  sx={{ mt: 3, backgroundColor: "#fcf4d4" }}
                  variant="contained"
                >
                  {" "}
                  Calculate{" "}
                </Button>
              </Grid>
            </Grid>

            {curr && <Typography sx={{ mt: 2 }}>{curr}</Typography>}
            {result && <Typography>{result}</Typography>}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
