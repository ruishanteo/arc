import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../UserAuth/FirebaseHooks.js";
import { store } from "../stores/store.js";
import { createPost } from "./ForumStore.js";
import { addNotification } from "../Notifications/index.js";

import { LoadingButton } from "@mui/lab";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

import { Cancel, Send } from "@mui/icons-material";

export function NewPost() {
  const navigate = useNavigate();
  const user = useAuth();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreatePost = () => {
    if (!title || !text) {
      store.dispatch(
        addNotification({
          message: "Please fill in all the fields.",
          variant: "error",
        })
      );
    } else {
      setLoading(true);
      store
        .dispatch(
          createPost({
            title: title,
            post: text,
            author: {
              userId: user.uid,
            },
          })
        )
        .finally(() => navigate("/forum"));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box align="center">
        <Box sx={{ mt: 5, mb: 2 }} align="left">
          <Typography variant="h4">New Post</Typography>
        </Box>

        <Box align="center" display="flex" flexDirection="column">
          <TextField
            type="text"
            name="title"
            placeholder="Enter title here."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputProps={{ maxLength: 100 }}
          />

          <TextField
            type="text"
            name="thread"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text here."
            sx={{ mt: 2 }}
            multiline
            rows={5}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <LoadingButton
            sx={{ mr: 3, backgroundColor: "#cff8df" }}
            variant="contained"
            onClick={() => {
              handleCreatePost();
              setTitle("");
              setText("");
            }}
            loading={loading}
          >
            Submit <Send />
          </LoadingButton>

          <Link
            to="/Forum"
            style={{
              color: "black",
              textDecoration: "none",
            }}
          >
            <Button sx={{ backgroundColor: "#fcf4d4" }} variant="contained">
              Cancel
              <Cancel />
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
