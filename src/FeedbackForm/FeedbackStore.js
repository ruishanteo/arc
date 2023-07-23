import { createSlice } from "@reduxjs/toolkit";

import {
  addDoc,
  collection,
} from "firebase/firestore";

import { addNotification } from "../Notifications";

import { db } from "../UserAuth/Firebase";
import { handleApiCall } from "../UserAuth/FirebaseHooks";

const RATE_LIMIT_DURATION = 10000;

let lastFeedbackTimestamp = 0;

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
    const currentTimestamp = Date.now();

    // Check if the rate limit duration has elapsed since the last feedback request
    if (currentTimestamp - lastFeedbackTimestamp < RATE_LIMIT_DURATION) {
      dispatch(
        addNotification({
          message: "Please wait before submitting another feedback.",
          variant: "error",
        })
      );
      return;
    }

    // Update the timestamp of the last feedback request
    lastFeedbackTimestamp = currentTimestamp;

    return await handleApiCall(
      addDoc(collection(db, "feedbacks"), {
        ...feedback,
      })
        .then((res) => {
          dispatch(
            addNotification({
              message: "Your feedback has been submitted.",
              variant: "success",
            })
          );
          return res;
        })
        .finally(() => {
          // Reset the timestamp after the rate limit duration has elapsed
          setTimeout(() => {
            lastFeedbackTimestamp = 0;
          }, RATE_LIMIT_DURATION);
        })
    );
  };
}


export const { saveFeedbackToStore } = feedbackSlice.actions;
export const feedbackReducer = feedbackSlice.reducer;
