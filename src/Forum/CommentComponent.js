import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { deleteComment, editComment } from "./ForumStore";

import { db } from "../UserAuth/Firebase";
import { useAuth } from "../UserAuth/FirebaseHooks";

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Close,
  DeleteOutline,
  Done,
  ModeEditOutline,
} from "@mui/icons-material";
import { doc, getDoc } from "@firebase/firestore";

function DeleteCommentDialog({ open, setOpen, confirmAction }) {
  return (
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
        <Button onClick={confirmAction} autoFocus variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function CommentComponent({
  id,
  comment,
  onUpdate,
  loading,
  setLoading,
}) {
  const user = useAuth();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [text, setText] = useState("");

  const users = useSelector((state) => state.users.users);

  const handleDeleteComment = () => {
    setLoading(true);
    dispatch(deleteComment(id)).finally(() => onUpdate());
  };

  const handleEditComment = () => {
    setLoading(true);
    dispatch(
      editComment(
        {
          text: text,
        },
        id
      )
    ).finally(() => onUpdate());
  };

  if (!user) {
    return;
  }

  return (
    <Box display="flex" flexDirection="row" sx={{ mt: 2, mb: 2 }}>
      <Box display="flex" flexDirection="column">
        <Box
          display="flex"
          flexDirection="row"
          sx={{ width: "70vw" }}
          align="left"
          alignItems="center"
        >
          <Avatar
            src={users[comment.author.userId]?.photoURL}
            sx={{
              width: 60,
              height: 60,
              cursor: "pointer",
              mr: 2,
            }}
          />

          {editMode ? (
            <>
              <Box width="100vw">
                <TextField
                  fullWidth
                  defaultValue={comment.text}
                  onChange={(e) => setText(e.target.value)}
                  multiline
                  rows={Math.max(1, Math.floor(comment.text.length / 105))}
                />
              </Box>

              <Box width="5vw" />

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
                  onClick={() => setEditMode(false)}
                >
                  <Close />
                </IconButton>
                <IconButton
                  aria-label="edit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#ffe0f7",
                    borderRadius: 1,
                  }}
                  disabled={!text}
                  onClick={handleEditComment}
                >
                  <Done />
                </IconButton>
              </Box>
            </>
          ) : (
            <>
              <Box>
                <Typography
                  sx={{ wordBreak: "break-word" }}
                  variant="subtitle1"
                  width="60vw"
                >
                  {comment.text}
                </Typography>
              </Box>
              <Box width="30vw" />
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
                    onClick={() => setOpen(true)}
                  >
                    <DeleteOutline />
                  </IconButton>
                  {user.uid === comment.author.userId && (
                    <IconButton
                      aria-label="edit"
                      variant="contained"
                      sx={{
                        backgroundColor: "#ffe0f7",
                        borderRadius: 1,
                      }}
                      onClick={() => setEditMode(true)}
                    >
                      <ModeEditOutline />
                    </IconButton>
                  )}
                  <DeleteCommentDialog
                    open={open}
                    setOpen={setOpen}
                    confirmAction={handleDeleteComment}
                  />
                </Box>
              )}
            </>
          )}
        </Box>

        <Box align="left" sx={{ mt: 1, ml: 2 }}>
          <Typography variant="caption">
            by {users[comment.author.userId]?.name}
          </Typography>
          <Box width="60vw" />
          <Tooltip title={comment.datetime}>
            <Typography variant="caption">
              {comment.formattedDatetime}
            </Typography>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
