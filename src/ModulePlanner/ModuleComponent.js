import { useState, useEffect } from "react";
import { Autocomplete, Button, Grid, TableCell, TextField } from "@mui/material";

const categ = [
  { title: '' },
  { title: 'GEA' },
  { title: 'GEC' },
  { title: 'GESS' },
  { title: 'GEI' },
  { title: 'GEX'},
  { title: 'GEN'},
  { title: 'UE'}
]

categ.sort((a, b) => a.title.localeCompare(b.title));

categ.forEach((prog, index) => {
  prog.id = index;
});

export function ModuleComponent({
  index,
  updateModule,
  updateCategory,
  getModuleId,
  getCatId,
  deleteModule,
  getSemester,
}) { 
  const [selectedModule, setSelectedModule] = useState(null);
  let sem = getSemester(index);
  useEffect(() => {
    setSelectedModule(sem)
  }, [selectedModule]);

  function onChangeModule(value) {
    updateModule(index, value);
  }

  function onChangeCateg(value) {
    updateCategory(index, value)
  }

  let sem1Mods = require('../module_data/sem1Modules.json');
  let sem2Mods = require('../module_data/sem2Modules.json');


  const selector = () => {
    if (selectedModule === 0) {
      return (
        <Autocomplete
        disablePortal
        disableClearable
        id="module-selector"           
        options={sem1Mods}
        groupBy={(sem1Mods) => sem1Mods.code}
        getOptionLabel={(sem1Mods) => sem1Mods.moduleCode}
        value={sem1Mods[getModuleId(index)]  || null}
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
        id="module-selector"           
        options={sem2Mods}
        groupBy={(sem2Mods) => sem2Mods.code}
        getOptionLabel={(sem2Mods) => sem2Mods.moduleCode}
        value={sem2Mods[getModuleId(index)]  || null}
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
            onClick={() => deleteModule(index)}
            sx={{ 
              backgroundColor: "#fcf4d4", 
              color: "black", }}
          >
            —
          </Button>
        </Grid>
      </TableCell>
    
      <TableCell align="center">
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            disableClearable
            id="categ-selector"           
            options={categ}
            getOptionLabel={(categ) => categ.title}
            value={categ[getCatId(index)]  || null}
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