import { createSlice } from "@reduxjs/toolkit";

import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

import { addNotification } from "../Notifications";

import { db } from "../UserAuth/Firebase";
import { handleApiCall } from "../UserAuth/FirebaseHooks";

const plannerDegSlice = createSlice({
    name: "plannerDeg",
    initialState: {
      degrees: [],
    },
  
    reducers: {
      updateDegree: (state, action) => {
        state.degrees[action.payload.degreeIndex] =
          action.payload.value;
      },
      saveDegreesToStore: (state, action) => {
        state.degrees = action.payload.degrees;
      },
      resetDegreesInStore: (state) => {
        state.degrees = [];
      },
    },
});

const plannerSemSlice = createSlice({
    name: "plannerSem",
    initialState: {
      semesters: [],
    },
  
    reducers: {
      addSem: (state) => {
        const prevSemester = state.semesters[state.semesters.length - 1];
        const prevCount = prevSemester ? prevSemester.count : 0;
        const newCount = prevCount + 1;
        const yearCount = newCount % 2 === 1 ? Math.ceil(newCount / 2) : (newCount / 2);
        const semCount = newCount % 2 === 1 ? 1 : 2
        const newHeader = `Y${yearCount}S${semCount}`;
  
        state.semesters = [
          ...state.semesters,
          {
            count: newCount,
            header: newHeader,
            modules: [
              {
                modInfo: {moduleCode: "",
                moduleCredit: "0",
                semester: [1, 2],
                code: "",
                id: 0},
                category: { title: "", id: 0 },
              },
            ],
          },
        ];
      },
      deleteSem: (state, action) => {
        state.semesters = [
            ...state.semesters.slice(0, action.payload.semIndex),
            ...state.semesters.slice(action.payload.semIndex + 1),
          ];
      },
      addModule: (state, action) => {
        state.semesters[action.payload.semIndex].modules = [
            ...state.semesters[action.payload.semIndex].modules,
            {modInfo: {"moduleCode": "", "moduleCredit": "0", 
            "semester": [1,2], "code": "", "id": 0}, category: {title: '', id: 0},},
          ];
      },
      deleteModule: (state, action) => {
        const components = state.semesters[action.payload.semIndex].modules;
        state.semesters[action.payload.semIndex].modules = [
        ...components.slice(0, action.payload.moduleIndex),
        ...components.slice(action.payload.moduleIndex + 1),
        ];
      },
      updateModule: (state, action) => {
        state.semesters[action.payload.semIndex].
        modules[action.payload.moduleIndex].modInfo = action.payload.newValue;
      },
      updateCategory: (state, action) => {
        state.semesters[action.payload.semIndex].
        modules[action.payload.moduleIndex].category = action.payload.newValue;
      },
      saveSemsToStore: (state, action) => {
        state.semesters = action.payload.semesters;
      },
      resetSemsInStore: (state) => {
        state.semesters = [];
      },
    },
});

export function savePlanner(id) {
    return async (dispatch, getState) => {
        await Promise.all([
            handleApiCall(
              setDoc(doc(db, "programme", id), {
                degrees: getState().plannerDeg.degrees,
              })
            ),
            handleApiCall(
              setDoc(doc(db, "semesters", id), {
                semesters: getState().plannerDeg.semesters,
              })
            ),
          ]).then((res) => {
          dispatch(
            addNotification({
              message: "You have successfully saved your progress.",
              variant: "success",
            })
          );
          return res;
        })
    };
  }

export function fetchPlanner(id) {
  return async (dispatch, getState) => {
    const degreesPromise = handleApiCall(getDoc(doc(db, "programme", id)));
    const semestersPromise = handleApiCall(getDoc(doc(db, "semesters", id)));

    const [degreesResponse, semestersResponse] = await Promise.all([
      degreesPromise,
      semestersPromise,
    ]);

    if (degreesResponse.exists()) {
      const degreeData = degreesResponse.data();
      dispatch(
        plannerDegSlice.actions.saveDegreesToStore({
          ...degreeData,
        })
      );
    } else {
      dispatch(plannerDegSlice.actions.resetDegreesInStore());
    }

    if (semestersResponse.exists()) {
      const semData = semestersResponse.data();
      dispatch(
        plannerSemSlice.actions.saveSemsToStore({
          ...semData,
        })
      );
    } else {
      dispatch(plannerSemSlice.actions.resetSemsInStore());
    }
  };
}

export function fetchDegrees(id) {
    return async (dispatch, getState) => {
        const response = await handleApiCall(getDoc(doc(db, "programme", id)));
        if (response.exists()) {
        const degreeData = response.data();
        dispatch(
            plannerDegSlice.actions.saveDegreesToStore({
            ...degreeData,
            })
        );
        } else {
        dispatch(plannerDegSlice.actions.resetDegreesInStore());
        }
    };
}  

export function fetchSemesters(id) {
    return async (dispatch, getState) => {
        const response = await handleApiCall(getDoc(doc(db, "semesters", id)));
        if (response.exists()) {
        const semData = response.data();
        dispatch(
            plannerSemSlice.actions.saveSemsToStore({
            ...semData,
            })
        );
        } else {
        dispatch(plannerDegSlice.actions.resetSemsInStore());
        }
    };
}  

export function clearPlanner(id) {
    return async (dispatch, getState) => {
      await Promise.all([
        handleApiCall(deleteDoc(doc(db, "programme", id))),
        handleApiCall(deleteDoc(doc(db, "semesters", id)))
      ]).then(() => {
        dispatch(
          addNotification({
            message: "You have successfully cleared your data.",
            variant: "success",
          })
        );
        dispatch(plannerDegSlice.actions.resetDegreesInStore());
        dispatch(plannerSemSlice.actions.resetSemsInStore());
      });
    };
  }

export function clearSemesters(id) {
    return async (dispatch, getState) => {
      await handleApiCall(
        deleteDoc(doc(db, "semesters", id)).then((res) => {
          dispatch(
            addNotification({
              message: "You have successfully cleared your data.",
              variant: "success",
            })
          );
          return res;
        })
      );
      dispatch(plannerSemSlice.actions.resetSemsInStore());
    };
}

export function updateDegrees(degreeIndex, value) {
    return (dispatch, getState) => {
        return dispatch(
        plannerDegSlice.actions.updateDegree({
            degreeIndex,
            value,
        })
        );
    };
}

export function addSem(dispatch, getState) {
    return dispatch(plannerSemSlice.actions.addSem());
}

export function deleteSem(semIndex) {
    return (dispatch, getState) => {
        return dispatch(
          plannerSemSlice.actions.deleteSem({ semIndex })
        );
      };
}

export function addModule(semIndex) {
    return (dispatch, getState) => {
      return dispatch(plannerSemSlice.actions.addModule({ semIndex }));
    };
}

export function deleteModule(semIndex, moduleIndex) {
    return (dispatch, getState) => {
      return dispatch(
        plannerSemSlice.actions.deleteModule({ semIndex, moduleIndex })
      );
    };
}

export function updateModule(semIndex, moduleIndex, newValue) {
    return (dispatch, getState) => {
      return dispatch(
        plannerSemSlice.actions.updateModule({semIndex, moduleIndex, newValue })
      );
    };
  }

export function updateCategory(semIndex, moduleIndex, newValue) {
    return (dispatch, getState) => {
        return dispatch(
        plannerSemSlice.actions.updateCategory({semIndex, moduleIndex, newValue }));
    };
}


export const plannerDegReducer = plannerDegSlice.reducer
export const plannerSemReducer = plannerSemSlice.reducer