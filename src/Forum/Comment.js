import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { deleteComment, fetchComments } from "./ForumStore";
import { store } from "../stores/store";

import { useAuth } from "../UserAuth/FirebaseHooks";

import { LoadingSpinner } from "../Components/LoadingSpinner.js";
import { NewComment } from "./NewComment.js";

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";

export function Comment({ postId, posterId }) {
  const user = useAuth();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState("");

  const comments = useSelector((state) => state.forum.comments);

  const onUpdate = useCallback(() => {
    setLoading(true);
    store.dispatch(fetchComments(postId)).finally(() => setLoading(false));
  }, [postId]);

  const handleDeleteComment = (id) => {
    setLoading(true);
    store.dispatch(deleteComment(id)).finally(() => onUpdate());
  };

  useEffect(() => {
    onUpdate();
  }, [user, onUpdate]);

  const dialogConfirmation = (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Doing so will delete this comment. Click confirm to proceed.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} sx={{ color: "#b7b0f5" }}>
          Cancel
        </Button>
        <Button
          onClick={() => handleDeleteComment(currentId)}
          autoFocus
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ mb: 10 }}>
      <NewComment postId={postId} posterId={posterId} onUpdate={onUpdate} />

      <Box
        align="left"
        sx={{ backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 1, p: 2 }}
      >
        <Typography variant="h4">Comments</Typography>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {comments.length === 0 ? (
              <Typography sx={{ mt: 1 }}>
                No comments... Be the first to comment!
              </Typography>
            ) : (
              comments.map((comment) => (
                <Box key={comment.id}>
                  <Box display="flex" flexDirection="row" sx={{ mt: 2, mb: 2 }}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      sx={{ width: "55vw" }}
                      align="left"
                      alignItems="center"
                    >
                      <Avatar
                        src={comment.author.profilePic}
                        sx={{
                          width: 60,
                          height: 60,
                          cursor: "pointer",
                          mr: 2,
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{ wordBreak: "break-word" }}
                          variant="subtitle1"
                        >
                          {comment.text}
                        </Typography>
                        <Typography variant="caption">
                          by {comment.author.username}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ width: "30vw" }} />
                    <Box
                      alignItems="right"
                      display="flex"
                      flexDirection="column"
                      sx={{ width: "20vw", mt: 3 }}
                    >
                      {(user.uid === comment.posterId ||
                        user.uid === comment.author.userId) && (
                        <Box display="flex" flexDirection="row" height="5vh">
                          <IconButton
                            aria-label="delete"
                            variant="contained"
                            size="medium"
                            sx={{
                              backgroundColor: "#fcf4d4",
                              mr: 1,
                              borderRadius: 1,
                            }}
                            onClick={() => {
                              setCurrentId(comment.id);
                              setOpen(true);
                            }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                          <IconButton
                            aria-label="edit"
                            variant="contained"
                            sx={{ backgroundColor: "#ffe0f7", borderRadius: 1 }}
                          >
                            <ModeEditOutlineIcon />
                          </IconButton>
                          {dialogConfirmation}
                        </Box>
                      )}
                      <Box>
                        <Typography variant="caption">
                          {comment.datetime}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Divider />
                </Box>
              ))
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
