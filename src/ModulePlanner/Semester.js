import React, { useState } from "react";
import { ModuleComponent } from "./ModuleComponent.js";

import {
  Box,
  Button,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
//import MuiAccordion from "@mui/material/Accordion";
//import MuiAccordionDetails from "@mui/material/AccordionDetails";
//import MuiAccordionSummary from "@mui/material/AccordionSummary";
//import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
//import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
//newModule,

export function Semester({
  semIndex,
  deleteModule,
  getModuleId,
  updateModule,
  getAllModules,
}) {
  const arr = getAllModules(semIndex);
  //const [selected, setSelected] = useState([]);
  
  return (
    <div className="title">
      <form>
        <Table aria-label="mod-table">
          <TableHead
          sx={{
            "& th": {
              backgroundColor: "#cff8df",
              color: "black",
              fontSize: "1.2rem",
            },
          }}>
            <TableRow>
              <TableCell aligh="center">
                {" "}
                <Typography> </Typography>{" "}
              </TableCell>
              <TableCell aligh="center">
                {" "}
                <Typography>Header</Typography>{" "}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {arr.map((element, moduleIndex) => {
              return (
                <tr key={moduleIndex}>
                  {!element.isDeleted && (
                    <ModuleComponent
                    index={moduleIndex}
                    updateModule={(moduleIndex, value) =>
                      updateModule(
                        semIndex,
                        moduleIndex,
                        value
                      )}
                    getModuleId={(moduleIndex) =>
                      getModuleId(semIndex, moduleIndex)}
                    deleteModule={(moduleIndex) =>
                      deleteModule(semIndex, moduleIndex)}
                    />
                  )}
                </tr>
              )
            })}
            <TableCell aligh="center">
                <Button
                  type="button" 
                  variant="contained"
                  onClick={() => {}}
                  sx={{ backgroundColor: "#fcf4d4", color: "neutral" }}
                >
                <Typography>+ Module</Typography>{" "}
                </Button>
            </TableCell>
          </TableBody>
        </Table>

        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <Button
              variant="contained"
              onClick= {() => {}}
              sx={{ mt: 2, mb: 10 }}
              color="neutral"
            >
              + Semesters
            </Button>
          </Grid>

          <Grid item xs={2}>
            <Button
              variant="contained"
              onClick= {()=>{}}
              sx={{ mt: 2, mb: 10 }}
              color="neutral"
            >
              - Semesters
            </Button>
          </Grid>
        </Grid>
        </Box>
      </form>
    </div>
  )
}

/*
return (
    <div className="title">
      <form>
        <Table aria-label="mod-table">
          <TableHead
          sx={{
            "& th": {
              backgroundColor: "#cff8df",
              color: "black",
              fontSize: "1.2rem",
            },
          }}>
            <TableRow>
              <TableCell aligh="center">
                {" "}
                <Typography> </Typography>{" "}
              </TableCell>
              <TableCell aligh="center">
                {" "}
                <Typography>{getHeader}</Typography>{" "}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {arr.map((element, moduleIndex) => {
              return (
                <tr key={moduleIndex}>
                  {!element.isDeleted && (
                    <ModuleComponent
                    index={moduleIndex}
                    updateModule={(moduleIndex, value) =>
                      updateModule(
                        semIndex,
                        moduleIndex,
                        value
                      )}
                    getModuleId={(moduleIndex) =>
                      getModuleId(semIndex, moduleIndex)}
                    deleteModule={(moduleIndex) =>
                      deleteModule(semIndex, moduleIndex)}
                    />
                  )}
                </tr>
              )
            })}
            <TableCell aligh="center">
                <Button
                  type="button" 
                  variant="contained"
                  onClick={() => newModule(semIndex)}
                  sx={{ backgroundColor: "#fcf4d4", color: "neutral" }}
                >
                <Typography>+ Module</Typography>{" "}
                </Button>
            </TableCell>
          </TableBody>
        </Table>

        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <Button
              variant="contained"
              onClick= {() => addSemester()}
              sx={{ mt: 2, mb: 10 }}
              color="neutral"
            >
              + Semesters
            </Button>
          </Grid>

          <Grid item xs={2}>
            <Button
              variant="contained"
              onClick= {(index) => deleteSemester(index)}
              sx={{ mt: 2, mb: 10 }}
              color="neutral"
            >
              - Semesters
            </Button>
          </Grid>
        </Grid>
        </Box>
      </form>
    </div>
  )
}
*/