import React, { useState } from "react";
import { ModuleComponent } from "./ModuleComponent.js";

import {
  Box,
  Button,
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";


export function Semester({
  semIndex,
  deleteModule,
  getModuleId,
  updateModule,
  getAllModules,
  newModule,
  getHeader,
  getSemester,
}) {
  const arr = getAllModules(semIndex);
  //const [selected, setSelected] = useState([]);
  return (
    
    <TableContainer>
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

              <TableCell align="center" colSpan={6}>
                {" "}
                <Typography 
                sx={{
                  fontSize: {
                    lg: 18,
                    md: 18,
                  },
                }}
                >{getHeader(semIndex)}</Typography>{" "}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {arr.map((element, moduleIndex) => {
              return (
                <TableRow key={moduleIndex}>
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
                    getSemester={() => getSemester(semIndex)}
                    />
                  )}
                </TableRow>
              )
            })}
            <TableRow>
            <TableCell align="left">
                <Button
                  type="button" 
                  variant="contained"
                  onClick={() => newModule(semIndex)}
                  sx={{ backgroundColor: "#fcf4d4", color: "neutral",  }}
                >
                <Typography
                sx={{
                  fontSize: {
                    lg: 16,
                    md: 16,
                    sm: 15,
                    xs: 14
                  },
                }}
                >+ Module</Typography>{" "}
                </Button>
            </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </form>
    </TableContainer>
    
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
              <TableCell align="center">
                {" "}
                <Typography> </Typography>{" "}
              </TableCell>
              <TableCell align="center">
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
            <TableCell align="center">
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
              <TableCell align="center">
                {" "}
                <Typography> </Typography>{" "}
              </TableCell>
              <TableCell align="center">
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
            <TableCell align="center">
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