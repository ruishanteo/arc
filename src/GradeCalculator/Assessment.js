import { useState } from "react";
import React from "react";
import { AssessmentComponent } from "./AssessmentComponent.js";

import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Grid,
} from "@mui/material";

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

export function Assessment({ index, deleteModule }) {
  const [arr, setArr] = useState([]);

  const [curr, setCurr] = useState("");
  const [result, setResult] = useState("");
  const [value, setValue] = useState(0);

  const [name, setName] = React.useState("");
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  function getText(index, dataKey) {
    const value = arr[index][dataKey];
    return typeof value === "number" && !isNaN(value) ? value : 0;
  }

  function updateText(index, dataKey, value) {
    const parsed = parseInt(value);
    if (parsed != null) {
      arr[index][dataKey] = parsed;
      setArr([...arr]);
    }
  }

  function newComponent() {
    arr.push({ score: 0, total: 0, weight: 0, isDeleted: false });
    setArr([...arr]);
  }

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
    const needed =
      sgoal <= 0 ? "-" : ((sgoal - totalScore) / (100 - totalWeight)) * 100;
    const finalNeed = needed < 0 ? "Too Low" : needed;
    setResult(`Score Required: ${finalNeed.toFixed(2)}`);
  }

  function deleteComponent(index) {
    arr[index].isDeleted = true;
    setArr([...arr]);
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
              onClick={() => deleteModule(index)}
              sx={{ backgroundColor: "#fcf4d4", color: "black" }}
            >
              <DeleteOutlineIcon />
            </Button>
          </header>

          <header align="center">
            <TextField
              inputProps={{ style: { fontSize: 30, textAlign: "center" } }}
              placeholder="Module Name"
              onChange={(e) => setName(e.target.value)}
              variant="standard"
            />
          </header>

          <form>
            <Button
              variant="contained"
              onClick={newComponent}
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
                    <Typography>ASSESSMENT</Typography>{" "}
                  </TableCell>
                  <TableCell align="center">
                    {" "}
                    <Typography>SCORE</Typography>{" "}
                  </TableCell>
                  <TableCell align="center">
                    {" "}
                    <Typography>TOTAL</Typography>{" "}
                  </TableCell>
                  <TableCell align="center">
                    {" "}
                    <Typography>WEIGHTAGE</Typography>{" "}
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {arr.map((element, index) => {
                  return (
                    <tr key={index}>
                      {!element.isDeleted && (
                        <AssessmentComponent
                          index={index}
                          getText={getText}
                          updateText={updateText}
                          deleteComponent={deleteComponent}
                        />
                      )}
                    </tr>
                  );
                })}
              </TableBody>
            </Table>

            <Grid container>
              <Grid item>
                <Typography sx={{ mt: 4 }}>Desired Grade:</Typography>
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
