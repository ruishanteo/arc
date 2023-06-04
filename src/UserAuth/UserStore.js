import { createSlice } from "@reduxjs/toolkit";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  Timestamp,
} from "firebase/firestore";

import { addNotification } from "../Notifications";

import { db } from "../UserAuth/Firebase";
import { handleApiCall, convertTimeFromData } from "../UserAuth/FirebaseHooks";

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: {},
  },

  reducers: {
    saveUsersToStore: (state, action) => {
      state.users = action.payload;
    },
    saveUserToStore: (state, action) => {
      const userData = action.payload;
      state.users = {
        ...state.users,
        [userData.id]: userData,
      };
    },
    clearUsers: (state) => {
      state.users = {};
    },
  },
});

export async function fetchAllUsers(dispatch, getState) {
  const response = await handleApiCall(getDocs(query(collection(db, "users"))));
  const users = {};
  response.docs.forEach((user) => {
    users[user.id] = {
      ...user.data(),
      id: user.id,
    };
  });
  dispatch(userSlice.actions.saveUsersToStore(users));
}

export function fetchUser(userId) {
  return async function (dispatch, getState) {
    const response = await handleApiCall(getDoc(doc(db, "users", userId)));
    if (response.exists()) {
      dispatch(
        userSlice.actions.saveUserToStore({
          ...response.data(),
          id: response.id,
        })
      );
    }
  };
}
export const { saveUsersToStore, saveUserToStore } = userSlice.actions;
export const userReducer = userSlice.reducer;
