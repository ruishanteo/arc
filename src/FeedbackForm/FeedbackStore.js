import { createSlice } from "@reduxjs/toolkit";

import {
  addDoc,
  collection,
} from "firebase/firestore";

import { addNotification } from "../Notifications";

import { db } from "../UserAuth/Firebase";
import { handleErrorMessage } from "../UserAuth/FirebaseHooks";

const handleApiCall = async (func) => {
  return func.then((res) => res).catch(handleErrorMessage);
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedback: undefined,
  },

  reducers: {
    saveFeedbackToStore: (state, action) => {
      state.feedback = action.payload;
    },
  },
});



export function createFeedback(feedback) {
  return async (dispatch, getState) => {
    return await handleApiCall(
      addDoc(collection(db, "feedbacks"), {
        ...feedback
      }).then((res) => {
        dispatch(
          addNotification({
            message: "Your feedback has been submitted.",
            variant: "success",
          })
        );
        return res;
      })
    );
  };
}


export const { saveFeedbackToStore } = feedbackSlice.actions;
export const feedbackReducer = feedbackSlice.reducer;
