import { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { Assessment } from "./Assessment";
import { db, deleteContent } from "../UserAuth/Firebase.js";

import { store } from "../stores/store";
import { addNotification } from "../Notifications";

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

export function ModuleAssessment() {
  const [assessments, setAssessments] = useState([]);
  const [open, setOpen] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveAll = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "assessments", user.email), {
      assessments: assessments
        .filter((assessment) => !assessment.isDeleted)
        .map((assessment) => {
          return {
            ...assessment,
            components: assessment.components.filter(
              (component) => !component.isDeleted
            ),
          };
        }),
    })
      .then(() =>
        dispatch(
          addNotification({
            message: "Saved successfully!",
            variant: "success",
          })
        )
      )
      .catch((err) =>
        dispatch(
          addNotification({
            message: `Failed to save: ${err}`,
            variant: "error",
          })
        )
      );
  };

  const getAll = useCallback(async () => {
    const docRef = doc(db, "assessments", user.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAssessments(docSnap.data().assessments);
    }
  }, [user]);

  useEffect(() => {
    getAll();
  }, [user, getAll]);

  function getComponents(assessmentIndex) {
    return assessments[assessmentIndex].components;
  }

  function getText(assessmentIndex, componentIndex, dataKey) {
    const value =
      assessments[assessmentIndex].components[componentIndex][dataKey];
    return value;
  }

  function updateText(assessmentIndex, componentIndex, dataKey, value) {
    if (value != null) {
      assessments[assessmentIndex].components[componentIndex][dataKey] = value;
      setAssessments([...assessments]);
    }
  }

  function newComponent(assessmentIndex) {
    assessments[assessmentIndex].components.push({
      componentTitle: "",
      score: 0,
      total: 0,
      weight: 0,
      isDeleted: false,
    });
    setAssessments([...assessments]);
  }

  function deleteComponent(assessmentIndex, componentIndex) {
    assessments[assessmentIndex].components[componentIndex].isDeleted = true;
    setAssessments([...assessments]);
  }

  const addModule = () => {
    setAssessments([
      ...assessments,
      {
        title: "",
        isDeleted: false,
        components: [],
      },
    ]);
  };

  const deleteModule = (index) => {
    const updatedAssessments = [...assessments];
    updatedAssessments[index].isDeleted = true;
    setAssessments(updatedAssessments);
  };

  const setModuleTitle = (index, moduleTitle) => {
    const updatedAssessments = [...assessments];
    updatedAssessments[index].title = moduleTitle;
    setAssessments(updatedAssessments);
  };

  const getModuleTitle = (index) => {
    return assessments[index].title;
  };

  const handleClear = () => {
    deleteContent(user.email);
    handleClose();
    store.dispatch(
      addNotification({
        message: "Deleted successfully!",
        variant: "success",
      })
    );
    setTimeout(() => {
      window.location.reload();
    }, 2500);
  };

  if (!user) {
    return;
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
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#fcf4d4",
              color: "black",
            }}
            onClick={handleClickOpen}
            disabled={assessments.length === 0}
          >
            Clear
          </Button>

          <Button
            variant="contained"
            sx={{
              ml: 2,
              backgroundColor: "#cff8df",
              color: "black",
            }}
            onClick={saveAll}
          >
            Save All
          </Button>
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

      {assessments.map((_, assessmentIndex) => {
        return (
          <div key={assessmentIndex}>
            {!assessments[assessmentIndex].isDeleted && (
              <Assessment
                key={assessmentIndex}
                assessmentIndex={assessmentIndex}
                deleteModule={deleteModule}
                newComponent={newComponent}
                deleteComponent={deleteComponent}
                getText={getText}
                updateText={updateText}
                getComponents={getComponents}
                setModuleTitle={setModuleTitle}
                getModuleTitle={getModuleTitle}
              />
            )}
          </div>
        );
      })}
      <Button
        variant="contained"
        onClick={addModule}
        sx={{ mt: 2, mb: 10 }}
        color="neutral"
      >
        + Module
      </Button>
    </Container>
  );
}
