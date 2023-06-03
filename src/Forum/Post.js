import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { Timestamp } from "firebase/firestore";

import { deletePost, editPost, fetchPost } from "./ForumStore.js";
import { store } from "../stores/store.js";

import { useAuth } from "../UserAuth/FirebaseHooks.js";

import { Comment } from "./Comment.js";
import { LoadingSpinner } from "../Components/LoadingSpinner.js";
import { NotFound } from "../Components/NotFound.js";

import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowBackIos,
  Close,
  DeleteOutline,
  Done,
  ModeEditOutline,
} from "@mui/icons-material";

export function Post() {
  const params = useParams();
  const id = params.id;

  const user = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const post = useSelector((state) => state.forum.post);

  const onUpdate = useCallback(() => {
    setLoading(true);
    store.dispatch(fetchPost(id)).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    onUpdate();
  }, [user, onUpdate]);

  const handleDeletePost = () => {
    setLoading(true);
    store.dispatch(deletePost(id)).finally(() => navigate("/forum"));
  };

  const handleEditPost = () => {
    setLoading(true);
    store
      .dispatch(
        editPost(
          {
            title: title,
            post: text,
            datetime: Timestamp.fromDate(new Date()),
          },
          id
        )
      )
      .finally(() => onUpdate());
  };

  if (loading) return <LoadingSpinner />;
  if (!post) return <NotFound />;

  return (
    <Container maxWidth="lg">
      <Box align="center">
        <Box align="left" sx={{ mt: 5, mb: 2 }}>
          <Button
            sx={{
              backgroundColor: "#b7b0f5",
              color: "white",
              maxHeight: "5vh",
            }}
            variant="contained"
            onClick={() => navigate("/forum")}
          >
            <ArrowBackIos /> Back
          </Button>

          <Box
            display="flex"
            flexDirection="row"
            sx={{ mt: 5, mb: 2 }}
            align="left"
          >
            <Box display="flex" flexDirection="column" align="center">
              <Avatar
                src={post.author.profilePic}
                sx={{
                  width: 100,
                  height: 100,
                  cursor: "pointer",
                  mb: 2,
                  mx: 2,
                }}
              />
              <Typography variant="subtitle1" width="2vw">
                {post.author.username}
              </Typography>
            </Box>
            {editMode ? (
              <Box display="flex" flexDirection="column">
                <TextField
                  fullWidth
                  type="text"
                  name="title"
                  defaultValue={post.title}
                  onChange={(e) => setTitle(e.target.value)}
                  inputProps={{ maxLength: 100 }}
                  sx={{ width: "65vw" }}
                />
                <TextField
                  fullWidth
                  type="text"
                  name="thread"
                  defaultValue={post.post}
                  onChange={(e) => setText(e.target.value)}
                  sx={{ width: "65vw", mt: 2 }}
                  multiline
                  rows={10}
                />

                <Box display="flex" flexDirection="row">
                  <IconButton
                    onClick={() => {
                      handleEditPost();
                      setEditMode(false);
                    }}
                    disabled={!title && !text}
                  >
                    <Done />
                  </IconButton>

                  <IconButton onClick={() => setEditMode(false)}>
                    <Close />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <Box display="flex" flexDirection="row">
                <Box flexDirection="column" width="55vw">
                  <Typography variant="h4">{post.title}</Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {post.post}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: { xs: "none" },
                    width: "20vw",
                  }}
                />

                {user.uid === post.author.userId && (
                  <Box display="flex" flexDirection="row" height="5vh">
                    <IconButton
                      onClick={() => setOpen(true)}
                      aria-label="delete"
                      variant="contained"
                      sx={{
                        backgroundColor: "#fcf4d4",
                        mr: 1,
                        borderRadius: 1,
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                    <IconButton
                      aria-label="edit"
                      variant="contained"
                      sx={{ backgroundColor: "#ffe0f7", borderRadius: 1 }}
                      onClick={() => setEditMode(true)}
                    >
                      <ModeEditOutline />
                    </IconButton>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Box align="right" sx={{ mr: 4 }}>
            <Typography variant="caption">{post.datetime}</Typography>
          </Box>
        </Box>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Doing so will delete this post. Click confirm to proceed.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} sx={{ color: "#b7b0f5" }}>
              Cancel
            </Button>
            <Button onClick={handleDeletePost} autoFocus variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Comment postId={id} posterId={post.author.userId} />
      </Box>
    </Container>
  );
}
