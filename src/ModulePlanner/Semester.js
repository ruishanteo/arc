import React from "react";
import { useSelector } from "react-redux";
import { ModuleComponent } from "./ModuleComponent.js";

import {
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";

import { Add } from "@mui/icons-material";

import { store } from "../stores/store";
import { addModule } from "./PlannerStore";

export function Semester({ semIndex }) {
  const sems = useSelector((state) => state.plannerSem.semesters[semIndex]);

  const mods = sems.modules;

  const semesterNum = sems.count % 2;

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
            }}
          >
            <TableRow>
              <TableCell align="center" colSpan={6}>
                {" "}
                <Typography 
                id={`table-header-${semIndex}`}
                sx={{
                  fontSize: {
                    lg: 18,
                    md: 18,
                  },
                }}
                >{sems.header}</Typography>{" "}

              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {mods.map((_, moduleIndex) => {
              return (
                <TableRow 
                  key={moduleIndex}
                  className={`module-card-${semIndex}`}>
                  {<ModuleComponent
                    semIndex={semIndex}
                    moduleIndex={moduleIndex}
                    semesterNum={semesterNum}
                    />
                  }
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell align="left">
                <Button
                  id={`add-module-planner-button-${semIndex}`}
                  type="button" 
                  variant="contained"
                  onClick={() => store.dispatch(addModule(semIndex))}
                  startIcon={<Add />}
                  sx={{ backgroundColor: "#fcf4d4", color: "neutral" }}
                >
                  <Typography
                    sx={{
                      fontSize: {
                        lg: 16,
                        md: 16,
                        sm: 15,
                        xs: 14,
                      },
                    }}
                  >
                    Module
                  </Typography>{" "}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </form>
    </TableContainer>
  );
}
