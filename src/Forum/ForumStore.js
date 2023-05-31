import { createSlice } from "@reduxjs/toolkit";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { addNotification } from "../Notifications";

import { db } from "../UserAuth/Firebase";
import { handleErrorMessage } from "../UserAuth/FirebaseHooks";

const handleApiCall = async (func) => {
  return func.then((res) => res).catch(handleErrorMessage);
};

const forumSlice = createSlice({
  name: "forum",
  initialState: {
    posts: [],
    post: undefined,
    comments: [],
    comment: undefined,
  },

  reducers: {
    savePostsToStore: (state, action) => {
      state.posts = action.payload;
      state.post = undefined;
      state.comments = [];
    },
    savePostToStore: (state, action) => {
      state.post = action.payload;
    },
    saveCommmentsToStore: (state, action) => {
      state.comments = action.payload;
    },
    saveCommentToStore: (state, action) => {
      state.comment = action.payload;
    },
  },
});

export async function fetchPosts(dispatch, getState) {
  const response = await handleApiCall(getDocs(collection(db, "posts")));
  const posts = response.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  dispatch(forumSlice.actions.savePostsToStore(posts));
}

export function createPost(post) {
  return async (dispatch, getState) => {
    return await handleApiCall(
      addDoc(collection(db, "posts"), post).then((res) => {
        dispatch(
          addNotification({
            message: "You have successfully created your post.",
            variant: "success",
          })
        );
        return res;
      })
    );
  };
}

export function fetchPost(postId) {
  return async (dispatch, getState) => {
    const response = await handleApiCall(getDoc(doc(db, "posts", postId)));
    if (response.exists()) {
      const post = { ...response.data(), id: response.id };
      dispatch(forumSlice.actions.savePostToStore(post));
    }
  };
}

export function editPost(post, id) {
  return async (dispatch, getState) => {
    post.post = post.post === "" ? getState().forum.post.post : post.post;
    post.title = post.title === "" ? getState().forum.post.title : post.title;

    await updateDoc(doc(db, "posts", id), post).then((res) => {
      dispatch(
        addNotification({
          message: "You have successfully edited your post.",
          variant: "success",
        })
      );
      return res;
    });
  };
}

export function deletePost(postId) {
  return async (dispatch, getState) => {
    await handleApiCall(
      deleteDoc(doc(db, "posts", postId)).then(() =>
        dispatch(
          addNotification({
            message: "You have deleted your post.",
            variant: "success",
          })
        )
      )
    );
    getState().forum.comments.forEach(
      async (comment) =>
        await handleApiCall(deleteDoc(doc(db, "comments", comment.id)))
    );
  };
}

export function createComment(comment) {
  return async (dispatch, getState) => {
    return await handleApiCall(
      addDoc(collection(db, "comments"), comment).then((res) => {
        dispatch(
          addNotification({
            message: "You have successfully created your comment.",
            variant: "success",
          })
        );

        return res;
      })
    );
  };
}

export function fetchComments(postId) {
  return async (dispatch, getState) => {
    const response = await handleApiCall(
      getDocs(query(collection(db, "comments"), where("postId", "==", postId)))
    );
    const comments = response.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    dispatch(forumSlice.actions.saveCommmentsToStore(comments));
  };
}

export function editComment(comment, id) {
  return async (dispatch, getState) => {
    return await handleApiCall(
      updateDoc(doc(db, "comments", id), comment).then((res) => {
        dispatch(
          addNotification({
            message: "You have successfully edited your comment.",
            variant: "success",
          })
        );
        return res;
      })
    );
  };
}

export function deleteComment(commentId) {
  return async (dispatch, getState) => {
    return await handleApiCall(
      deleteDoc(doc(db, "comments", commentId)).then(() =>
        dispatch(
          addNotification({
            message: "You have deleted your comment.",
            variant: "success",
          })
        )
      )
    );
  };
}

export const { savePostsToStore, savePostToStore } = forumSlice.actions;
export const forumReducer = forumSlice.reducer;
