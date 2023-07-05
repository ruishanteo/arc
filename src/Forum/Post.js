import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { Timestamp } from "firebase/firestore";

import { deletePost, editPost, fetchPost } from "./ForumStore.js";
import { store } from "../stores/store.js";

import { useAuth } from "../UserAuth/FirebaseHooks.js";
import { FormTextField } from "../Components/FormTextField.js";

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
  Grid,
  IconButton,
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

  const post = useSelector((state) => state.forum.post);
  const users = useSelector((state) => state.users.users);

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
    <Container maxWidth="lg" align="center">
      <Box align="center" sx={{ mt: 5, mb: 2 }}>
        <Box align="left">
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
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          sx={{ mt: 5, mb: 2 }}
          align="left"
        >
          <Avatar
            src={users[post.author.userId]?.photoURL}
            sx={{
              width: 100,
              height: 100,
              cursor: "pointer",
              mb: 2,
              mr: 2,
            }}
          />

          {editMode ? (
            <Formik
              initialValues={{ title: post.title, post: post.post }}
              validationSchema={Yup.object().shape({
                title: Yup.string().required("Required"),
                post: Yup.string().required("Required"),
              })}
              onSubmit={async (values) => {
                await store
                  .dispatch(
                    editPost(
                      {
                        ...values,
                        datetime: Timestamp.fromDate(new Date()),
                      },
                      id
                    )
                  )
                  .finally(() => onUpdate());
                setEditMode(false);
              }}
            >
              {(formikProps) => (
                <Form id="post-form">
                  <Grid container direction="column">
                    <Grid item width="67vw">
                      <FormTextField
                        label="title"
                        type="text"
                        id="title"
                        formikProps={formikProps}
                        inputProps={{ maxLength: 100 }}
                        placeholder="Enter title here"
                        fullWidth
                      />
                    </Grid>

                    <Grid item>
                      <FormTextField
                        label="post"
                        type="text"
                        id="post"
                        formikProps={formikProps}
                        placeholder="Enter text here"
                        sx={{ mt: 2 }}
                        rows={10}
                        multiline
                        fullWidth
                      />
                    </Grid>

                    <Grid container>
                      <Grid item>
                        <IconButton
                          sx={{
                            backgroundColor: "#fcf4d4",
                            mr: 1,
                            borderRadius: 1,
                          }}
                          onClick={() => setEditMode(false)}
                        >
                          <Close />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          type="submit"
                          disabled={
                            !formikProps.dirty ||
                            formikProps.isSubmitting ||
                            loading
                          }
                          sx={{
                            backgroundColor: "#ffe0f7",
                            mr: 1,
                            borderRadius: 1,
                          }}
                        >
                          <Done />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          ) : (
            <Grid container direction="row">
              <Grid item xs={10}>
                <Typography variant="h4" sx={{ wordBreak: "break-word" }}>
                  {post.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: 2, wordBreak: "break-word" }}
                >
                  {post.post}
                </Typography>
              </Grid>

              {user.uid === post.author.userId && (
                <Grid item>
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
                </Grid>
              )}
            </Grid>
          )}
        </Box>
        <Box align="right" sx={{ mr: 4 }}>
          <Typography variant="subtitle1" sx={{ wordBreak: "break-word" }}>
            - {users[post.author.userId]?.name}
          </Typography>
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
    </Container>
  );
}
