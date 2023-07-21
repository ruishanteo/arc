import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { deleteComment, editComment } from "./ForumStore";

import { useAuth } from "../UserAuth/FirebaseHooks";
import { FormTextField } from "../Components/FormTextField.js";

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Close,
  DeleteOutline,
  Done,
  ModeEditOutline,
} from "@mui/icons-material";

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
        <Button
          id="confirm-delete-comment-button"
          onClick={confirmAction}
          autoFocus
          variant="contained"
        >
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

  const users = useSelector((state) => state.users.users);

  const handleDeleteComment = () => {
    setLoading(true);
    dispatch(deleteComment(id)).finally(() => onUpdate());
  };

  if (!user) {
    return;
  }

  return (
    <Box display="flex" flexDirection="row" sx={{ mt: 2, mb: 2 }}>
      <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection="row" align="left">
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
            <Formik
              initialValues={{ text: comment.text }}
              validationSchema={Yup.object().shape({
                text: Yup.string().required("Required"),
              })}
              onSubmit={async (values) => {
                await dispatch(editComment(values, id)).finally(() =>
                  onUpdate()
                );
                setEditMode(false);
                setLoading(false);
              }}
            >
              {(formikProps) => (
                <Form id="edit-comment-form">
                  <Box width="58vw">
                    <FormTextField
                      label="text"
                      type="text"
                      id="edit-comment"
                      formikProps={formikProps}
                      placeholder="Enter comment here"
                      multiline
                      fullWidth
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
                      id="submit-comment-button"
                      type="submit"
                      aria-label="edit"
                      variant="contained"
                      sx={{
                        backgroundColor: "#ffe0f7",
                        borderRadius: 1,
                      }}
                      disabled={
                        !formikProps.dirty ||
                        formikProps.isSubmitting ||
                        loading
                      }
                    >
                      <Done />
                    </IconButton>
                  </Box>
                </Form>
              )}
            </Formik>
          ) : (
            <Grid container direction="row">
              <Grid item width="58vw">
                <Typography
                  sx={{ wordBreak: "break-word" }}
                  variant="subtitle1"
                >
                  {comment.text}
                </Typography>
              </Grid>

              {(user.uid === comment.posterId ||
                user.uid === comment.author.userId) && (
                <Grid item>
                  <IconButton
                    id="delete-comment-button"
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
                      id="edit-comment-button"
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
                </Grid>
              )}
            </Grid>
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
