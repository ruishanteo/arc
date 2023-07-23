import { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";

import { PlannerInstructions } from './PlannerInstructions'
import { Semester } from "./Semester";
import { ProgRequirements } from "./ProgRequirements";
import { CommonRequirements } from "./CommonRequirements";
import { UnrestrictedRequirements } from "./UnrestrictedRequirements";

import { useAuth } from "../UserAuth/FirebaseHooks";

import { LoadingSpinner } from "../Components/LoadingSpinner";

import { store } from "../stores/store";

import {
  updateDegrees,
  fetchPlanner,
  clearPlanner,
  savePlanner,
  addSem,
  deleteSem,
} from "./PlannerStore";

import { 
  Autocomplete, 
  Box, 
  Button, 
  Container, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid, 
  IconButton,
  LinearProgress,
  Typography, 
  TextField,
  useMediaQuery 
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
import { Add, Cancel, Help, Remove, Save } from "@mui/icons-material";


let deg = require('../module_data/degrees.json');

const options = deg.map((option) => {
  const firstLetter = option.faculty.toUpperCase();
  return {
  firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
  ...option,
  };
})

options.sort((a, b) => {
  // Sort by faculty
  if (a.faculty !== b.faculty) {
    return a.faculty.localeCompare(b.faculty);
  }
  
  // Sort by title if faculties are the same
  return a.title.localeCompare(b.title);
});
options.forEach((options, index) => {
  options.id = index;
});

let secDeg = require('../module_data/seconddeg.json');

const secOptions = secDeg.map((option) => {
  const firstLetter = option.faculty.toUpperCase();
  return {
  firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
  ...option,
  };
})

secOptions.sort((a, b) => {
  // Sort by faculty
  if (a.faculty !== b.faculty) {
    return a.faculty.localeCompare(b.faculty);
  }
  
  // Sort by title if faculties are the same
  return a.title.localeCompare(b.title);
});
secOptions.forEach((options, index) => {
  options.id = index;
});

const progs = [
  { title: '' },
  { title: 'RC4' },
  { title: 'CAPT' },
  { title: 'Tembusu' },
  { title: 'RVRC' },
  { title: 'NUSC'}
]

progs.sort((a, b) => a.title.localeCompare(b.title));

progs.forEach((prog, index) => {
  prog.id = index;
});


export function ModuleChecker() {

  const [open, setOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [visible, setVisible] = useState(true);

  const user = useAuth();
  const isNarrowScreen = useMediaQuery('(max-width: 960px)');

  const degrees = useSelector((state) => state.plannerDeg.degrees);
  const semesters = useSelector((state) => state.plannerSem.semesters);

  const modulesList = semesters.reduce((modules, semester) => {
    return modules.concat(semester.modules);
  }, []);

  function calculateTotalModuleCredits(modulesList) {
    let uniqueModuleCreditsMap = [];
    let totalModuleCredits = 0;
  
    modulesList.forEach((moduleObj) => {
      const moduleCode = moduleObj.modInfo.moduleCode;
      const moduleCredit = parseInt(moduleObj.modInfo.moduleCredit, 10);
  
      if (!uniqueModuleCreditsMap.includes(moduleCode)) {
        uniqueModuleCreditsMap.push(moduleCode);
        totalModuleCredits += moduleCredit;
      }
    });

    return totalModuleCredits;
  }

  const totalModuleCredits = calculateTotalModuleCredits(modulesList);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveAll = async (e) => {
    setIsActionLoading(true);
    store
      .dispatch(savePlanner(user.uid))
      .finally(() => setIsActionLoading(false));
  };

  const handleClear = async () => {
    setIsActionLoading(true);
    store
      .dispatch(clearPlanner(user.uid))
      .finally(() => setIsActionLoading(false));
    setOpen(false);
  };

  const onUpdate = useCallback(() => {
    if (user) {
      setIsFetchingData(true);
      store
        .dispatch(fetchPlanner(user.uid))
        .finally(() => {
          setIsFetchingData(false)});
    }
  }, [user]);

  useEffect(() => {
    onUpdate();

  }, [user,  onUpdate]);

  function updateDegree(degreeInd, value) {
    store.dispatch(updateDegrees(degreeInd, value));
  }

  if (!user) {
    return;
  }

  if (isFetchingData) {
    return <LoadingSpinner />;
  }

  function toggleVisibility() {
    setVisible((prevVisibility) => !(prevVisibility));
  }

  const handleFilterOptions = (options, state) => {
    const inputValue = degrees[0];
  
    if (inputValue) {
      const filteredOptions = options.filter((option) => {
        if (option.faculty === "SOC" && inputValue.faculty === "SOC") {
          return false; // Filter out SOC options when inputValue has faculty "SOC"
        }
        if (option.title === inputValue.title) {
          return false; // Filter out options with the same title as inputValue
        }
        return true;
      });
  
      return filteredOptions;
    }
  
    return options; // Return all options if inputValue is empty
  };
 
  return (
    <Container maxWidth="lg" sx={{ paddingBottom: "3rem" }}>
      
      <Box
        align="center"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: 100,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 450, minWidth: 250 }}>
          Module Planner
        </Typography>
        <Grid container sx={{ 
          display: "flex", 
          justifyContent: "right"}}>

          <IconButton
            id="instruction-open-button"
            variant="contained"
            color="#fcf4d4"
            onClick={toggleVisibility}>
            <Help />
          </IconButton>

          <LoadingButton
            id="clear-planner-button"
            variant="contained"
            sx={{
              backgroundColor: "#fcf4d4",
              color: "black",
            }}
            onClick={handleClickOpen}
            loading={isActionLoading}
            disabled={semesters.length === 0 && degrees.length === 0}
            endIcon={<Cancel />}
          >
            <span>Clear</span>
          </LoadingButton>

          <LoadingButton
            id="save-planner-button"
            variant="contained"
            sx={{
              ml: 2,
              backgroundColor: "#cff8df",
              color: "black",
            }}
            onClick={saveAll}
            loading={isActionLoading}
            loadingPosition="end"
            endIcon={<Save />}
          >
            <span>Save</span>
          </LoadingButton>
        </Grid>
        
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Doing so will delete all your saved data. Click confirm to
              proceed.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ color: "#b7b0f5" }}>
              Cancel
            </Button>
            <Button 
              id="confirm-clear-planner-button"
              onClick={handleClear} 
              autoFocus 
              variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      
     <Box sx={{ flexGrow: 1}}>
        <Grid container spacing={4} direction={isNarrowScreen ? 'column' : 'row'}>
          <Grid item xs={12} sm={4} >
            <Autocomplete
            disablePortal
            data-testid="degree-selector"
            id="degree-selector"           
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            sx={{ width: isNarrowScreen ? '100%' : 300 }}
            value={degrees[0] || null}         
            onChange={(_, value) => {
              updateDegree(0, value);
            }}
            renderInput={(params) => <TextField {...params} label="Select Degree" variant='standard' />}
            ListboxProps={{style:{
                maxHeight: '150px',
            }}}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Autocomplete
            disablePortal
            id="addon-selector"           
            options={secOptions.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={handleFilterOptions}
            sx={{ width: isNarrowScreen ? '100%' : 300 }}
            value={degrees[1] || null}         
            onChange={(_, value) => {
              updateDegree(1, value);
            }}
            renderInput={(params) => <TextField {...params} label="2nd Degree/Major?" variant='standard' />}
            ListboxProps={{style:{
              maxHeight: '150px',
            }}}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Autocomplete
            disablePortal
            id="addon2-selector"           
            options={progs.sort((a, b) => -b.title.localeCompare(a.title))}
            getOptionLabel={(option) => option.title}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            sx={{ width: isNarrowScreen ? '100%' : 300, zIndex: 1 }}
            value={degrees[2] || null}         
            onChange={(_, value) => {
              updateDegree(2, value);
            }}
            renderInput={(params) => <TextField {...params} label="Select Programme" variant='standard' />}
            ListboxProps={{style:{
              maxHeight: '150px',
            }}}
            />
          </Grid>

        </Grid>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={4} sm={3} md={2} xl={2}>
              <Button
                id="add-semester-button"
                variant="contained"
                onClick= {() => {
                  store.dispatch(addSem)}}
                startIcon={<Add />}  
                sx={{ 
                  mt: 2, 
                  mb: 10 }}
                color="neutral"
              >
                Semesters
              </Button>
            </Grid>

            <Grid item xs={4} sm={3} md={2} xl={2}>
              <Button
                id="remove-semester-button"
                variant="contained"
                onClick= {() => {
                  store.dispatch(deleteSem(semesters.length-1))}}
                startIcon={<Remove />} 
                sx={{ 
                  mt: 2, 
                  mb: 10,}}
                color="neutral"
              >
              Semesters
              </Button>
            </Grid>
          </Grid>
      </Box>

      <Grid container spacing={{ xs: 0, sm: 2 }}>
        {semesters.map((_, semIndex) => {
        return (
          <Grid 
            item xs={12} mdl={12} lg={6} 
            key={semIndex}
            className="semester-card">
            {<Semester
                key={semIndex}
                semIndex={semIndex}
              />}
          </Grid>
        );
      })}
      </Grid>
      
      <hr />
    <Box
      align="center"
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: 100,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 450, minWidth: 250 }}>
        Degree Requirements
      </Typography>
    </Box>
    
    <Box>
    <LinearProgress 
      id="linear-progress-credits"
      variant='determinate'
      color="neutral"
      size="sm"
      value={totalModuleCredits > 160 ? 100 : (totalModuleCredits / 160) * 100}
      sx={{
        height: '2.5rem',
        borderRadius: 10,
        boxShadow: 'sm',
        borderColor: 'neutral.500',
      }}
    ></LinearProgress>
      <Typography
        id="progress-total-credits"
        level="body3"
        fontWeight="xl"
        sx={{ fontWeight: 450, minWidth: 250 }}
        align='right'
      >
        {totalModuleCredits} MCs
      </Typography>
    
    </Box>

    <PlannerInstructions
        data-testid="instruction-panel"
        visible={visible} 
        setVisible={setVisible}
        sx={{zIndex: 2 }}
      />
    
    <Grid container spacing={2} sx={{ mt: '1rem' }}>
      <Grid item xs={12} sm={12} smm={12} md={4} >
          <div>
            {<ProgRequirements/>
            }
            </div>
      </Grid>

      <Grid item xs={12} sm={12} smm={12} md={4} >
          <div>
            {<CommonRequirements/>
            }
            </div>
      </Grid>

      <Grid item xs={12} sm={12} smm={12} md={4} >
        <div>
        {<UnrestrictedRequirements/>
            }
        </div>
      </Grid>
    </Grid>

    </Container>
  );
}

/*

      */