import { useState } from "react";

import { addDoc, collection } from "firebase/firestore";

import { db, useAuth } from "../UserAuth/Firebase.js";

import { store } from "../stores/store.js";
import { addNotification } from "../Notifications/index.js";

import { LoadingButton } from "@mui/lab";
import { Box, TextField } from "@mui/material";

export function NewComment({ postId, getComments }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useAuth();

  const addComment = async () => {
    setLoading(true);
    if (!comment) {
      store.dispatch(
        addNotification({
          message: "Please fill in the field.",
          variant: "error",
        })
      );
    } else {
      await addDoc(collection(db, "comments"), {
        postId: postId,
        text: comment,
        author: {
          username: user.displayName,
          email: user.email,
          profilePic: user.photoURL,
          userId: user.uid,
        },
        datetime: new Date().toLocaleString(),
      });

      getComments();
      store.dispatch(
        addNotification({
          message: "Commented successfully!",
          variant: "success",
        })
      );
    }
    setLoading(false);
  };

  return (
    <Box align="center">
      <TextField
        type="text"
        name="thread"
        required
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Enter reply here."
        multiline
        rows={3}
        backgroundColor="gray"
        fullWidth
      />

      <LoadingButton
        sx={{ mt: 3, mb: 3, backgroundColor: "#cff8df" }}
        variant="contained"
        onClick={addComment}
        loading={loading}
      >
        Submit
      </LoadingButton>
    </Box>
  );
}
