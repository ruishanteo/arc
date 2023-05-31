import { useState, useEffect } from "react";
import { Autocomplete, Button, TableCell, TableRow, TextField } from "@mui/material";


export function ModuleComponent({
  index,
  updateModule,
  getModuleId,
  deleteModule,
  getSemester,
}) { 
  const [selectedModule, setSelectedModule] = useState(null);
  const sem = getSemester(index);
  useEffect(() => {
    setSelectedModule(sem)
  }, [selectedModule]);

  function onChange(value) {
    updateModule(index, value);
  }

  let sem1Mods = require('../module_data/sem1Modules.json');
  let sem2Mods = require('../module_data/sem2Modules.json');


  const selector = () => {
    if (selectedModule == 0) {
      console.log("sem1");
      return (
        <Autocomplete
        disablePortal
        disableClearable
        id="module-selector"           
        options={sem1Mods}
        groupBy={(sem1Mods) => sem1Mods.code}
        getOptionLabel={(sem1Mods) => sem1Mods.moduleCode}
        sx={{ width: {xs: 240, mdl:300, lg:300} }}
        value={sem1Mods[getModuleId(index)]  || null}
        onChange={(_, value) => {
          onChange(value);
        }}
        renderInput={(params) => <TextField {...params} label="Select Module" />}
        ListboxProps={{style:{
          maxHeight: '200px',
          }}}
        />)
    } else {
      console.log("sem2");
      return (
        <Autocomplete
        disablePortal
        disableClearable
        id="module-selector"           
        options={sem2Mods}
        groupBy={(sem2Mods) => sem2Mods.code}
        getOptionLabel={(sem2Mods) => sem2Mods.moduleCode}
        sx={{ width: {xs: 240, mdl:300, lg:300} }}
        value={sem2Mods[getModuleId(index)]  || null}
        onChange={(_, value) => {
          onChange(value);
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
        <Button
          type="button"
          onClick={() => deleteModule(index)}
          sx={{ 
            backgroundColor: "#fcf4d4", 
            color: "black", }}
        >
          —
        </Button>
      </TableCell>

      <TableCell align="center">
        {selector()}
      </TableCell>
    </>
  );
}