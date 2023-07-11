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
  let sem1Mods = require('../module_data/sem1Modules.json');
  let sem2Mods = require('../module_data/sem2Modules.json');
  let progMods = require('../module_data/progMods.json');
  const module = useSelector(
    (state) =>
      state.plannerSem.semesters[semIndex].modules[moduleIndex]
  );
  const degrees = useSelector((state) => state.plannerDeg.degrees);

  function onChangeModule(value) {
    store.dispatch(updateModule(semIndex, moduleIndex, value));
  }

  function onChangeCateg(value) {
    store.dispatch(updateCategory(semIndex, moduleIndex, value));

  }

  const handleFilterOptions = (options, state) => {
    const { inputValue } = state;
  
    if (degrees.length > 0 && module.category.title === "UE" && degrees[0] !== null && typeof degrees[0] !== 'undefined') {
      const deg = degrees[0].title;
      const moduleCodes = progMods[deg].flatMap((item) => item.moduleCode);
  
      // Filter options based on the condition
      const filteredOptions = options.filter(
        (option) => !moduleCodes.includes(option.moduleCode)
      );
  
      // Apply default Autocomplete filtering based on inputValue
      const filteredDefaultOptions = filteredOptions.filter((option) =>
        option.moduleCode.toLowerCase().includes(inputValue.toLowerCase())
      );
  
      return filteredDefaultOptions;
    }
  
    // Apply default Autocomplete filtering based on inputValue
    const filteredDefaultOptions = options.filter((option) =>
      option.moduleCode.toLowerCase().includes(inputValue.toLowerCase())
    );
  
    return filteredDefaultOptions;
  };

  const handleFilterOptionsCateg = (options, state) => {
    const { inputValue } = state;
  
    if (degrees.length > 0 && degrees[0] !== null && typeof degrees[0] !== 'undefined') {
      const deg = degrees[0].title;
      const moduleCodes = progMods[deg].flatMap((item) => item.moduleCode);
  
      // Filter options based on the condition
      if (moduleCodes.includes(module.modInfo.moduleCode)) {
        return options.filter((option) => option.title !== "UE" && option.title !== "GE");
      }
    }
  
    // Apply default Autocomplete filtering based on inputValue
    const filteredDefaultOptions = options.filter((option) =>
      option.title.toLowerCase().includes(inputValue.toLowerCase())
    );
  
    return filteredDefaultOptions;
  };

  const selector = () => {
    if (semesterNum !== 0) {
      return (
        <Autocomplete
        disablePortal
        disableClearable
        id={`module-selector-${semIndex}-${moduleIndex}`}     
        options={sem1Mods}
        filterOptions={handleFilterOptions}
        groupBy={(sem1Mods) => sem1Mods.code}
        getOptionLabel={(sem1Mods) => sem1Mods.moduleCode}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={module.modInfo  || null}
        onChange={(_, value) => {
          onChangeModule(value);
        }}
        renderInput={(params) => <TextField {...params} label="Select Module" variant='standard' />}
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
        filterOptions={handleFilterOptions}
        groupBy={(sem2Mods) => sem2Mods.code}
        getOptionLabel={(sem2Mods) => sem2Mods.moduleCode}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={module.modInfo  || null}
        onChange={(_, value) => {
          onChangeModule(value);
        }}
        renderInput={(params) => <TextField {...params} label="Select Module" variant='standard' />}
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
            id={`delete-module-planner-button-${semIndex}-${moduleIndex}`}
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
            filterOptions={handleFilterOptionsCateg}
            getOptionLabel={(categ) => categ.title}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={module.category  || null}
            onChange={(_, value) => {
              onChangeCateg(value);
            }}
            renderInput={(params) => <TextField {...params} label="Select Category" variant='standard'/>}
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