import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

import { db } from "../UserAuth/Firebase.js";

import { store } from "../stores/store.js";
import { addNotification } from "../Notifications/index.js";

import { LoadingButton } from "@mui/lab";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

export function NewPost() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const addPost = async () => {
    setLoading(true);
    if (!title || !text) {
      store.dispatch(
        addNotification({
          message: "Please fill in all the fields.",
          variant: "error",
        })
      );
    } else {
      await addDoc(collection(db, "posts"), {
        title: title,
        post: text,
        author: {
          username: user.displayName,
          email: user.email,
          profilePic: user.photoURL,
          userId: user.uid,
        },
        datetime: new Date().toLocaleString(),
      });

      store.dispatch(
        addNotification({
          message: "Posted successfully!",
          variant: "success",
        })
      );
      navigate("/forum");
    }
    setLoading(false);
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
            onClick={addPost}
            loading={loading}
          >
            Submit
          </LoadingButton>
          <Button sx={{ backgroundColor: "#fcf4d4" }} variant="contained">
            <Link
              to="/Forum"
              style={{ color: "black", textDecoration: "none" }}
            >
              Cancel
            </Link>
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
