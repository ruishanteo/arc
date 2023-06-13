import { useEffect, useCallback, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  updateSem,
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

const MIN = 0;
const color = "#cff8df";

export function ModuleChecker() {
  //const [semesters, setSemesters] = useState([]);
  const [count, setCount] = useState(0);
  const [header, setHeader] = useState("Y1S1");
  const [modTitles, setModTitles] = useState([]);
  const [progress, setProgress] = useState(0);

  const [open, setOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const [visible, setVisible] = useState(true);

  const user = useAuth();
  const dispatch = useDispatch();
  const isNarrowScreen = useMediaQuery('(max-width: 960px)');

  const degrees = useSelector((state) => state.plannerDeg.degrees);
  const semesters = useSelector((state) => state.plannerSem.semesters);

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

    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.onbeforeunload = handleBeforeUnload;
    return () => {
      window.onbeforeunload = null;
    };
  }, [user, hasUnsavedChanges, onUpdate]);

  function updateDegree(degreeInd, value) {
    store.dispatch(updateDegrees(degreeInd, value));
  }

  function checkValues(arr, list) {
    if (Array.isArray(arr)) {
      return arr.some(value => {
        return checkValues(value, list)});
    } else {
      // Check if the single value is present
      return list.includes(arr);
    }
  }

  function checkPresent(titleArr) {
    const arr = modTitles;
    const present = titleArr.find(title => checkValues(title, arr));
    if (present) {
      return color;
    } else {
      return "#FFFFFF";
    }
}

  function cdid_check(arr, data) {
    let idCount = 0;
    let cdCount = 0;

    arr.forEach(code => {
      if (idCount === 3 || (idCount === 2 && cdCount === 1)) {
        return; // Exit loop if conditions already met
      }
      
      const foundInID = data.ID.some(item => item.moduleCode === code);
      const foundInCD = data.CD.some(item => item.moduleCode === code);
      
      if (foundInID) {
        idCount++;
      } else if (foundInCD) {
        cdCount++;
      }
    });

    if (idCount === 3 || (idCount === 2 && cdCount === 1)) {
      return true;
    } else {
      return false;
    }
  }

  function checkcsbreadth(modules) {
    let data = require('../module_data/csbreadth.json');

    for (const list of Object.values(data)) {
      const count = modules.filter(module => list.filter(listModule => listModule.moduleCode === module)).length;
      if (count >= 3) {
        return true;
      }
    }
    
    return false;
  }

  function checkPresentCommonMod(inputString) {
    let commonMod = require('../module_data/' + inputString + '.json');
    const arr = modTitles;
    if (inputString === "cdid") {
      if (cdid_check(arr, commonMod)) {
        return color;
      } else {
        return "#FFFFFF";
      }
    } else {
      const hasCommonElement = commonMod.some((element) => arr.includes(element.moduleCode));
      if (hasCommonElement) {
        return color;
      } else {
        return "#FFFFFF";
      }
    }
  }

  function checkPresentCommonModRC(prog, inputString) {
    const program = prog.toLowerCase();
    let commonMod;
    if (inputString === "gei") {
      commonMod = require('../module_data/utcpgei.json');
    } else {
      commonMod = require('../module_data/' + program + inputString + '.json');
    }    
    const arr = modTitles;
    const hasCommonElement = commonMod.some((element) => arr.includes(element.moduleCode));
    if (hasCommonElement) {
      return color;
    } else {
      return "#FFFFFF";
    }
  }

  function countMc() {
    let mc = 0;
    semesters.forEach((semester) => semester.modules.forEach((mod) => {
      mc += Number(mod.moduleCredit) }))
    if (isNaN(mc)) {
      return 0;
    }
    return mc;
  }

  function updateProg() {
    let mc = countMc();
    if (mc > 160) {
      mc = 160;
    }
    setProgress((mc/160)*100);
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
 
  return (
    <Container maxWidth="lg">
      
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
          variant="contained"
          color="#fcf4d4"
          onClick={toggleVisibility}>
          <Help />
          </IconButton>

          <LoadingButton
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
            <Button onClick={handleClear} autoFocus variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      
     <Box sx={{ flexGrow: 1}}>
        <Grid container spacing={4} direction={isNarrowScreen ? 'column' : 'row'}>
          <Grid item xs={12} sm={4}>
            <Autocomplete
            disablePortal
            id="degree-selector"           
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            sx={{ width: isNarrowScreen ? '100%' : 300 }}
            value={degrees[0] || null}         
            onChange={(_, value) => {
              updateDegree(0, value);
              setHasUnsavedChanges(true);
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
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            sx={{ width: isNarrowScreen ? '100%' : 300 }}
            value={degrees[1] || null}         
            onChange={(_, value) => {
              updateDegree(1, value);
              setHasUnsavedChanges(true);
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
            sx={{ width: isNarrowScreen ? '100%' : 300, zIndex: 1 }}
            value={degrees[2] || null}         
            onChange={(_, value) => {
              updateDegree(2, value);
              setHasUnsavedChanges(true);
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
                variant="contained"
                onClick= {() => store.dispatch(addSem)}
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
                variant="contained"
                onClick= {() => store.dispatch(deleteSem)}
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
          <Grid item xs={12} mdl={12} lg={6} key={semIndex}>
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
      variant='determinate'
      color="neutral"
      size="sm"
      value={progress}
      sx={{
        height: '2.5rem',
        borderRadius: 10,
        boxShadow: 'sm',
        borderColor: 'neutral.500',
      }}
    ></LinearProgress>
      <Typography
        level="body3"
        fontWeight="xl"
        sx={{ fontWeight: 450, minWidth: 250 }}
        align='right'
      >
        {`${countMc()}`} MCs
      </Typography>
    
    </Box>

    <PlannerInstructions
        visible={visible} 
        setVisible={setVisible}
        sx={{zIndex: 2 }}
      />
    
    <Grid container spacing={2} sx={{ mt: '1rem' }}>
      <Grid item xs={12} sm={12} smm={12} md={4} >
          <div>
            {<ProgRequirements
                checkPresent={checkPresent}
              />
            }
            </div>
      </Grid>

      <Grid item xs={12} sm={12} smm={12} md={4} >
          <div>
            {<CommonRequirements
                checkPresentCommonMod={checkPresentCommonMod}
                checkPresentCommonModRC={checkPresentCommonModRC}
              />
            }
            </div>
      </Grid>

      <Grid item xs={12} sm={12} smm={12} md={4} >
        <div>
        {<UnrestrictedRequirements
              />
            }
        </div>
      </Grid>
    </Grid>

    </Container>
  );
}

/*

      */