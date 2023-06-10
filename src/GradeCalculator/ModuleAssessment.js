import { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";

import { store } from "../stores/store";
import {
  addAssessment,
  clearCalculator,
  fetchCalculator,
  saveCalculator,
} from "./GradeStore";

import { Assessment } from "./Assessment";
import { useAuth } from "../UserAuth/FirebaseHooks";

import { LoadingSpinner } from "../Components/LoadingSpinner";

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Add, Cancel, Save } from "@mui/icons-material";

export function ModuleAssessment() {
  const user = useAuth();

  const [open, setOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const assessments = useSelector((state) => state.calculator.assessments);

  const onUpdate = useCallback(() => {
    if (user) {
      setIsFetchingData(true);
      store
        .dispatch(fetchCalculator(user.uid))
        .finally(() => setIsFetchingData(false));
    }
  }, [user]);

  useEffect(() => {
    onUpdate();
  }, [user, onUpdate]);

  const saveAll = async (e) => {
    setIsActionLoading(true);
    store
      .dispatch(saveCalculator(user.uid))
      .finally(() => setIsActionLoading(false));
  };

  const clearAll = async () => {
    setIsActionLoading(true);
    store
      .dispatch(clearCalculator(user.uid))
      .finally(() => setIsActionLoading(false));
  };

  if (!user) {
    return;
  }

  if (isFetchingData) {
    return <LoadingSpinner />;
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
          Grade Calculator
        </Typography>
        <Grid container sx={{ display: "flex", justifyContent: "right" }}>
          <LoadingButton
            variant="contained"
            sx={{
              backgroundColor: "#fcf4d4",
              color: "black",
            }}
            onClick={() => setOpen(true)}
            loading={isActionLoading}
            disabled={assessments.length === 0}
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
          onClose={() => setOpen(false)}
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
            <Button onClick={() => setOpen(false)} sx={{ color: "#b7b0f5" }}>
              Cancel
            </Button>
            <Button onClick={clearAll} autoFocus variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {assessments.map((_, assessmentIndex) => (
        <Box key={assessmentIndex}>
          <Assessment assessmentIndex={assessmentIndex} />
        </Box>
      ))}
      <Button
        variant="contained"
        onClick={() => store.dispatch(addAssessment)}
        sx={{ mt: 2, mb: 10 }}
        color="neutral"
        startIcon={<Add />}
      >
        Module
      </Button>
    </Container>
  );
}
