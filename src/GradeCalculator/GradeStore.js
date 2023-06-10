import { createSlice } from "@reduxjs/toolkit";

import { deleteDoc, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

import { addNotification } from "../Notifications";

import { db } from "../UserAuth/Firebase";
import { handleApiCall, convertTimeFromData } from "../UserAuth/FirebaseHooks";

const calculatorSlice = createSlice({
  name: "calculator",
  initialState: {
    assessments: [],
    datetime: undefined,
  },

  reducers: {
    addAssessment: (state) => {
      state.assessments = [
        ...state.assessments,
        {
          title: "",
          components: [
            {
              componentTitle: "",
              score: 0,
              total: 0,
              weight: 0,
            },
          ],
        },
      ];
    },
    updateAssessment: (state, action) => {
      state.assessments[action.payload.assessmentIndex].title =
        action.payload.newTitle;
    },
    deleteAssessment: (state, action) => {
      state.assessments = [
        ...state.assessments.slice(0, action.payload.assessmentIndex),
        ...state.assessments.slice(action.payload.assessmentIndex + 1),
      ];
    },
    addComponent: (state, action) => {
      state.assessments[action.payload.assessmentIndex].components = [
        ...state.assessments[action.payload.assessmentIndex].components,
        {
          componentTitle: "",
          score: 0,
          total: 0,
          weight: 0,
        },
      ];
    },
    updateComponent: (state, action) => {
      state.assessments[action.payload.assessmentIndex].components[
        action.payload.componentIndex
      ][action.payload.key] = action.payload.newValue;
    },
    deleteComponent: (state, action) => {
      const components =
        state.assessments[action.payload.assessmentIndex].components;
      state.assessments[action.payload.assessmentIndex].components = [
        ...components.slice(0, action.payload.componentIndex),
        ...components.slice(action.payload.componentIndex + 1),
      ];
    },
    saveCalculatorToStore: (state, action) => {
      state.assessments = action.payload.assessments;
      state.datetime = action.payload.datetime;
    },
    resetCalculatorInStore: (state) => {
      state.assessments = [];
      state.datetime = "";
    },
  },
});

export function saveCalculator(id) {
  return async (dispatch, getState) => {
    await handleApiCall(
      setDoc(doc(db, "assessments", id), {
        assessments: getState().calculator.assessments,
        datetime: Timestamp.fromDate(new Date()),
      }).then((res) => {
        dispatch(
          addNotification({
            message: "You have successfully saved your progress.",
            variant: "success",
          })
        );
        return res;
      })
    );
  };
}

export function fetchCalculator(id) {
  return async (dispatch, getState) => {
    const response = await handleApiCall(getDoc(doc(db, "assessments", id)));
    if (response.exists()) {
      const calculatorData = response.data();
      dispatch(
        calculatorSlice.actions.saveCalculatorToStore({
          ...calculatorData,
          datetime: convertTimeFromData(calculatorData),
        })
      );
    } else {
      dispatch(calculatorSlice.actions.resetCalculatorInStore());
    }
  };
}

export function clearCalculator(id) {
  return async (dispatch, getState) => {
    await handleApiCall(
      deleteDoc(doc(db, "assessments", id)).then((res) => {
        dispatch(
          addNotification({
            message: "You have cleared your data.",
            variant: "success",
          })
        );
        return res;
      })
    );
    dispatch(calculatorSlice.actions.resetCalculatorInStore());
  };
}

export function addAssessment(dispatch, getState) {
  return dispatch(calculatorSlice.actions.addAssessment());
}

export function updateAssessment(assessmentIndex, newTitle) {
  return (dispatch, getState) => {
    return dispatch(
      calculatorSlice.actions.updateAssessment({
        assessmentIndex,
        newTitle,
      })
    );
  };
}

export function deleteAssessment(assessmentIndex) {
  return (dispatch, getState) => {
    return dispatch(
      calculatorSlice.actions.deleteAssessment({ assessmentIndex })
    );
  };
}

export function addComponent(assessmentIndex) {
  return (dispatch, getState) => {
    return dispatch(calculatorSlice.actions.addComponent({ assessmentIndex }));
  };
}

export function updateComponent(
  assessmentIndex,
  componentIndex,
  key,
  newValue
) {
  return (dispatch, getState) => {
    return dispatch(
      calculatorSlice.actions.updateComponent({
        assessmentIndex,
        componentIndex,
        key,
        newValue,
      })
    );
  };
}

export function deleteComponent(assessmentIndex, componentIndex) {
  return (dispatch, getState) => {
    return dispatch(
      calculatorSlice.actions.deleteComponent({
        assessmentIndex,
        componentIndex,
      })
    );
  };
}

export const calculatorReducer = calculatorSlice.reducer;
