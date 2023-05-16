import React, { useState } from "react";
import { AssessmentComponent } from "./AssessmentComponent.js";

import {
  Button,
  Grid,
  styled,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Typography,
} from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

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
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
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

export function Assessment({
  assessmentIndex,
  deleteModule,
  newComponent,
  deleteComponent,
  getText,
  updateText,
  getComponents,
  setModuleTitle,
  getModuleTitle,
}) {
  const arr = getComponents(assessmentIndex);
  const [curr, setCurr] = useState("");
  const [result, setResult] = useState("");
  const [value, setValue] = useState(0);

  const [name, setName] = React.useState("");
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  function calculateGrade() {
    const totalScore = arr
      .filter((t) => t.weight > 0 && t.total > 0 && !t.isDeleted)
      .reduce((acc, cur) => acc + (cur.score / cur.total) * cur.weight, 0);
    const totalWeight = arr
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
          <Typography>{name}</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <header align="left">
            <Button
              type="button"
              onClick={() => deleteModule(assessmentIndex)}
              sx={{ backgroundColor: "#fcf4d4", color: "black" }}
            >
              <DeleteOutlineIcon />
            </Button>
          </header>

          <header align="center">
            <TextField
              inputProps={{ style: { fontSize: 30, textAlign: "center" } }}
              placeholder="Module Name"
              onChange={(e) => {
                setName(e.target.value);
                setModuleTitle(assessmentIndex, e.target.value);
              }}
              value={getModuleTitle(assessmentIndex)}
              variant="standard"
            />
          </header>

          <form>
            <Button
              variant="contained"
              onClick={() => newComponent(assessmentIndex)}
              sx={{ mt: 2, mb: 1 }}
              color="neutral"
            >
              + Component
            </Button>

            <Table>
              <TableHead
                sx={{
                  "& th": {
                    backgroundColor: "#cff8df",
                    color: "black",
                    fontSize: "1.2rem",
                  },
                }}
              >
                <TableRow>
                  <TableCell align="center">
                    {" "}
                    <Typography> </Typography>{" "}
                  </TableCell>
                  <TableCell align="center">
                    {" "}
                    <Typography
                      sx={{
                        fontSize: {
                          lg: 18,
                          md: 18,
                          sm: 15,
                          xs: 11,
                        },
                      }}
                    >
                      ASSESSMENT
                    </Typography>{" "}
                  </TableCell>
                  <TableCell align="center">
                    {" "}
                    <Typography
                      sx={{
                        fontSize: {
                          lg: 18,
                          md: 18,
                          sm: 15,
                          xs: 11,
                        },
                      }}
                    >
                      SCORE
                    </Typography>{" "}
                  </TableCell>
                  <TableCell align="center">
                    {" "}
                    <Typography
                      sx={{
                        fontSize: {
                          lg: 18,
                          md: 18,
                          sm: 15,
                          xs: 11,
                        },
                      }}
                    >
                      TOTAL
                    </Typography>{" "}
                  </TableCell>
                  <TableCell align="center">
                    {" "}
                    <Typography
                      sx={{
                        fontSize: {
                          lg: 18,
                          md: 18,
                          sm: 15,
                          xs: 11,
                        },
                      }}
                    >
                      WEIGHTAGE
                    </Typography>{" "}
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {arr.map((element, componentIndex) => {
                  return (
                    <tr key={componentIndex}>
                      {!element.isDeleted && (
                        <AssessmentComponent
                          index={componentIndex}
                          getText={(componentIndex, dataKey) =>
                            getText(assessmentIndex, componentIndex, dataKey)
                          }
                          updateText={(componentIndex, dataKey, value) =>
                            updateText(
                              assessmentIndex,
                              componentIndex,
                              dataKey,
                              value
                            )
                          }
                          deleteComponent={(componentIndex) =>
                            deleteComponent(assessmentIndex, componentIndex)
                          }
                        />
                      )}
                    </tr>
                  );
                })}
              </TableBody>
            </Table>

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
          </form>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
