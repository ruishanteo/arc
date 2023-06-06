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
import { fetchUser } from "../UserAuth/UserStore";

const forumSlice = createSlice({
  name: "forum",
  initialState: {
    posts: [],
    post: undefined,
    comments: [],
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
  },
});

async function fetchUsersFromCollection(collection, dispatch) {
  const usersSet = new Set();
  collection.forEach((item) => {
    usersSet.add(item.author.userId);
  });
  usersSet.forEach((userId) => dispatch(fetchUser(userId)));
}

export async function fetchPosts(dispatch, getState) {
  const response = await handleApiCall(
    getDocs(query(collection(db, "posts"), orderBy("datetime")))
  );
  const posts = response.docs.map((doc) => {
    const post_data = doc.data();
    return {
      ...post_data,
      id: doc.id,
      datetime: post_data.datetime.toDate().toString(),
      formattedDatetime: convertTimeFromData(post_data),
    };
  });
  dispatch(forumSlice.actions.savePostsToStore(posts.reverse()));
  await fetchUsersFromCollection(posts, dispatch);
}

export function createPost(post) {
  return async (dispatch, getState) => {
    return await handleApiCall(
      addDoc(collection(db, "posts"), {
        ...post,
        datetime: Timestamp.fromDate(new Date()),
      }).then((res) => {
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
      const post_data = response.data();
      const post = {
        ...post_data,
        id: response.id,
        datetime: post_data.datetime.toDate().toString(),
        formattedDatetime: convertTimeFromData(post_data),
      };
      dispatch(forumSlice.actions.savePostToStore(post));
      await fetchUsersFromCollection([post], dispatch);
    }
  };
}

export function editPost(post, id) {
  return async (dispatch, getState) => {
    post.post = post.post === "" ? getState().forum.post.post : post.post;
    post.title = post.title === "" ? getState().forum.post.title : post.title;

    await updateDoc(doc(db, "posts", id), {
      ...post,
      datetime: Timestamp.fromDate(new Date()),
    }).then((res) => {
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
      addDoc(collection(db, "comments"), {
        ...comment,
        datetime: Timestamp.fromDate(new Date()),
      }).then((res) => {
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
      getDocs(
        query(
          collection(db, "comments"),
          orderBy("datetime"),
          where("postId", "==", postId)
        )
      )
    );
    const comments = response.docs.map((doc) => {
      const comment_data = doc.data();
      return {
        ...doc.data(),
        id: doc.id,
        datetime: comment_data.datetime.toDate().toString(),
        formattedDatetime: convertTimeFromData(comment_data),
      };
    });
    dispatch(forumSlice.actions.saveCommmentsToStore(comments.reverse()));
    await fetchUsersFromCollection(comments, dispatch);
  };
}

export function editComment(comment, id) {
  return async (dispatch, getState) => {
    return await handleApiCall(
      updateDoc(doc(db, "comments", id), {
        ...comment,
        datetime: Timestamp.fromDate(new Date()),
      }).then((res) => {
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
