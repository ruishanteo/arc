import { useState } from "react";

import { useAuth } from "../UserAuth/FirebaseHooks.js";

import { store } from "../stores/store.js";
import { createComment } from "./ForumStore.js";
import { addNotification } from "../Notifications/index.js";

import { LoadingButton } from "@mui/lab";
import { Box, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";

export function NewComment({ postId, posterId, onUpdate }) {
  const user = useAuth();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateComment = () => {
    setLoading(true);
    if (!comment) {
      store.dispatch(
        addNotification({
          message: "Please fill in the field.",
          variant: "error",
        })
      );
    } else {
      store
        .dispatch(
          createComment({
            postId: postId,
            posterId: posterId,
            text: comment,
            author: {
              userId: user.uid,
            },
          })
        )
        .finally(() => {
          onUpdate();
          setLoading(false);
        });
    }
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
        fullWidth
      />

      <LoadingButton
        sx={{ mt: 3, mb: 3, backgroundColor: "#cff8df" }}
        variant="contained"
        onClick={() => {
          handleCreateComment();
          setComment("");
        }}
        loading={loading}
      >
        Submit
        <Send />
      </LoadingButton>
    </Box>
  );
}
