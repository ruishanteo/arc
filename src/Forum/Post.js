import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { deletePost, fetchPost } from "./ForumStore.js";
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
  Typography,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";

export function Post() {
  const params = useParams();
  const id = params.id;

  const user = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

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
            Back
          </Button>

          <Box
            display="flex"
            flexDirection="row"
            sx={{ mt: 5, mb: 2 }}
            align="left"
          >
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

            <Box display="flex" flexDirection="column">
              <Typography variant="h4">{post.title}</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {post.post}
              </Typography>
            </Box>

            <Box sx={{ width: "100vw", backgroundColor: "white" }} />

            {user.uid === post.author.userId && (
              <Box display="flex" flexDirection="row" height="5vh">
                <Button
                  onClick={() => setOpen(true)}
                  aria-label="delete"
                  variant="contained"
                  sx={{ backgroundColor: "#fcf4d4", mr: 2 }}
                >
                  <DeleteOutlineIcon />
                </Button>
                <Button
                  aria-label="edit"
                  variant="contained"
                  sx={{ backgroundColor: "#ffe0f7" }}
                >
                  <ModeEditOutlineIcon />
                </Button>
              </Box>
            )}
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
