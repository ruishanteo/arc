import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Autocomplete, Button, Grid, TableCell, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import { store } from "../stores/store";
import {
  updateModule,
  deleteModule,
  updateCategory,
} from "./PlannerStore";

const categ = [
  { title: '' },
  { title: 'Programme' },
  { title: 'Double Count' },
  { title: 'GE' },
  { title: 'UE'}
]

categ.sort((a, b) => a.title.localeCompare(b.title));

categ.forEach((prog, index) => {
  prog.id = index;
});

export function ModuleComponent({
  semIndex,
  moduleIndex,
  semesterNum,
}) { 
  const module = useSelector(
    (state) =>
      state.plannerSem.semesters[semIndex].modules[moduleIndex]
  );

  function onChangeModule(value) {
    store.dispatch(updateModule(semIndex, moduleIndex, value));
  }

  function onChangeCateg(value) {
    store.dispatch(updateCategory(semIndex, moduleIndex, value));

  }

  let sem1Mods = require('../module_data/sem1Modules.json');
  let sem2Mods = require('../module_data/sem2Modules.json');


  const selector = () => {
    if (semesterNum === 0) {
      return (
        <Autocomplete
        disablePortal
        disableClearable
        id={`module-selector-${semIndex}-${moduleIndex}`}     
        options={sem1Mods}
        groupBy={(sem1Mods) => sem1Mods.code}
        getOptionLabel={(sem1Mods) => sem1Mods.moduleCode}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={module.modInfo  || null}
        onChange={(_, value) => {
          onChangeModule(value);
        }}
        renderInput={(params) => <TextField {...params} label="Select Module" />}
        ListboxProps={{style:{
          maxHeight: '200px',
          }}}
        />)
    } else {
      return (
        <Autocomplete
        disablePortal
        disableClearable
        id={`module-selector-${semIndex}-${moduleIndex}`}           
        options={sem2Mods}
        groupBy={(sem2Mods) => sem2Mods.code}
        getOptionLabel={(sem2Mods) => sem2Mods.moduleCode}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={module.modInfo  || null}
        onChange={(_, value) => {
          onChangeModule(value);
        }}
        renderInput={(params) => <TextField {...params} label="Select Module" />}
        ListboxProps={{style:{
          maxHeight: '200px',
          }}}
        />
        );
    }
  }

  return (
    <>
      <TableCell align="center">
        <Grid item xs={6}>
          <Button
            type="button"
            onClick={() => store.dispatch(deleteModule(semIndex, moduleIndex))}
            sx={{ 
              backgroundColor: "#fcf4d4", 
              color: "black", }}
          >
            <ClearIcon />
          </Button>
        </Grid>
      </TableCell>
    
      <TableCell align="center">
        <Grid item xs={12} >
          <Autocomplete
            disablePortal
            disableClearable
            id={`categ-selector-${semIndex}-${moduleIndex}`}          
            options={categ}
            getOptionLabel={(categ) => categ.title}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={module.category  || null}
            onChange={(_, value) => {
              onChangeCateg(value);
            }}
            renderInput={(params) => <TextField {...params} label="Select Category" />}
            ListboxProps={{style:{
              maxHeight: '200px',
              }}}
            />
        </Grid>
      </TableCell>
      
      <TableCell align="center">
        <Grid item xs={12}>
          {selector()}
        </Grid>
      </TableCell>
    </>
  );
}