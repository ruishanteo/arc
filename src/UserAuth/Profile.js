import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
  updateUserDisplayName,
  updateUserEmail,
  updateUserPassword,
  updateUserProfilePicture,
  onDeleteUser,
  onReAuth,
  useAuth,
} from "./FirebaseHooks.js";

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
  TextField,
  Tooltip,
  Typography,
  Divider,
} from "@mui/material";

import {
  Close,
  Delete,
  Done,
  PhotoCamera,
  ModeEditOutline,
} from "@mui/icons-material";

import { Formik, Form } from "formik";

import { FormTextField } from "../Components";

function ConfirmPasswordDialog({
  user,
  dialogOpen,
  setDialogOpen,
  setEditMode,
  handleConfirmChange,
}) {
  const [password, setPassword] = useState("");

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    await onReAuth(user, password);
    await handleConfirmChange();
    setDialogOpen(false);
    if (setEditMode) setEditMode(false);
  };

  return (
    <Dialog open={dialogOpen} onClose={handleClose} justifycontent="center">
      <DialogTitle>{"Please enter your password to confirm."}</DialogTitle>
      <DialogContent>
        <TextField
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#cff8df" }}
          onClick={handleSubmit}
        >
          Confirm
        </Button>
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{ backgroundColor: "#fcf4d4" }}
          autoFocus
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ParticularField({
  user,
  userProp,
  userPropLabel,
  userPropType,
  userPropInitialValue,
  userPropPlaceholder,
  userPropSchema,
  userPropInputProps,
  handleUpdate,
}) {
  // const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Grid
      container
      alignItems="center"
      sx={{ mt: 2, flexDirection: { sm: "column", md: "row" } }}
    >
      <Box>
        <Grid item>
          <Typography align="left" width="5vw" variant="h6" sx={{ mt: 2 }}>
            {userPropLabel}:{" "}
          </Typography>
          {editMode ? (
            <Formik
              enableReinitialize={true}
              initialValues={{ [userProp]: userPropInitialValue }}
              onSubmit={async (values, { setSubmitting }) => {
                setDialogOpen(true);
              }}
              validationSchema={userPropSchema}
            >
              {(formikProps) => (
                <Form>
                  <Grid container alignItems="center">
                    <Grid item>
                      <FormTextField
                        label={userProp}
                        type={userPropType}
                        formikProps={formikProps}
                        inputProps={userPropInputProps}
                      />
                    </Grid>

                    <Grid item>
                      <IconButton
                        aria-label="delete"
                        variant="contained"
                        size="medium"
                        sx={{
                          backgroundColor: "#fcf4d4",
                          mx: 1,
                          ml: 2,
                          borderRadius: 1,
                        }}
                        onClick={() => setEditMode(false)}
                      >
                        <Close />
                      </IconButton>
                    </Grid>

                    <Grid item>
                      <IconButton
                        aria-label="edit"
                        variant="contained"
                        type="submit"
                        sx={{
                          backgroundColor: "#cff8df",
                          borderRadius: 1,
                        }}
                      >
                        <Done />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <ConfirmPasswordDialog
                    user={user}
                    dialogOpen={dialogOpen}
                    setDialogOpen={setDialogOpen}
                    setEditMode={setEditMode}
                    handleConfirmChange={() => handleUpdate(formikProps.values)}
                  />
                </Form>
              )}
            </Formik>
          ) : (
            <Grid container justify="flex-end" alignItems="center">
              <Grid item>
                <Tooltip title={userPropPlaceholder || userPropInitialValue}>
                  <Typography width="25vw" variant="subtitle1" noWrap>
                    {userPropPlaceholder || userPropInitialValue}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item>
                <IconButton
                  aria-label="edit"
                  variant="contained"
                  size="edit"
                  sx={{
                    ml: 2,
                    backgroundColor: "#fcf4d4",
                    borderRadius: 1,
                  }}
                  onClick={() => setEditMode(true)}
                >
                  <ModeEditOutline />
                </IconButton>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>

      <Divider />
    </Grid>
  );
}

function DeleteAccount({ user, handleUpdate }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <Button
        variant="contained"
        onClick={() => setDialogOpen(true)}
        sx={{
          backgroundColor: "#ffe0f7",
          mt: 4,
          minWidth: "20vw",
        }}
      >
        <Typography>Delete Account</Typography>
        <Delete />
      </Button>
      <ConfirmPasswordDialog
        user={user}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        handleConfirmChange={() => onDeleteUser(user)}
      />
    </>
  );
}

export function Profile() {
  const user = useAuth();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();

  function handlePicChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }

  function updateState() {
    setUsername(user.displayName);
    setEmail(user.email);
    setPhotoURL(user.photoURL);
  }

  useEffect(() => {
    if (user) {
      updateState();
    }
  }, [user]);

  if (!user) {
    return <></>;
  }

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Button component="label" onChange={handlePicChange}>
        <Avatar
          src={photoURL}
          sx={{
            width: 100,
            height: 100,
            cursor: "pointer",
            marginBottom: 2,
            marginLeft: 5,
          }}
        />
        <Box sx={{ mt: 5 }}>
          <IconButton aria-label="upload picture" component="label">
            <input hidden accept="image/*" type="file" />
            <PhotoCamera />
          </IconButton>
        </Box>
        <input hidden accept="image/*" multiple type="file" />
      </Button>
      {photo && (
        <Button
          variant="contained"
          onClick={() =>
            updateUserProfilePicture(user, photo).then(updateState)
          }
          sx={{ backgroundColor: "#cff8df" }}
        >
          Update Profile Picture
        </Button>
      )}

      <Typography variant="h4" sx={{ mt: 2 }}>
        Edit your particulars
      </Typography>

      <Box>
        <ParticularField
          user={user}
          userProp="username"
          userPropLabel="Username"
          userPropType="username"
          userPropInitialValue={username}
          userPropSchema={Yup.object().shape({
            username: Yup.string()
              .min(2, "Too Short!")
              .max(20, "Too Long!")
              .required("Required"),
          })}
          userPropInputProps={{ maxLength: 20 }}
          handleUpdate={async (values) =>
            updateUserDisplayName(user, values.username).then(updateState)
          }
        />

        <ParticularField
          user={user}
          userProp="email"
          userPropLabel="Email"
          userPropType="email"
          userPropInitialValue={email}
          userPropSchema={Yup.object().shape({
            email: Yup.string().email("Invalid email").required("Required"),
          })}
          handleUpdate={async (values) =>
            updateUserEmail(user, values.email).then(updateState)
          }
        />

        <ParticularField
          user={user}
          userProp="password"
          userPropLabel="Password"
          userPropType="password"
          userPropPlaceholder={"Change password"}
          userPropInitialValue={""}
          userPropSchema={Yup.object().shape({
            password: Yup.string().required("Required"),
          })}
          handleUpdate={async (values) =>
            updateUserPassword(user, values.password)
          }
        />
      </Box>

      <DeleteAccount user={user} />
    </Box>
  );
}
