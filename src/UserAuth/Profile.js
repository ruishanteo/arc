import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";

import {
  updateUserDisplayName,
  updateUserEmail,
  updateUserPassword,
  updateUserProfilePicture,
  onDeleteUser,
  onReAuth,
  useAuth,
  onReAuthGoogle,
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
  DialogContentText,
} from "@mui/material";

import {
  Close,
  Delete,
  Done,
  PhotoCamera,
  ModeEditOutline,
} from "@mui/icons-material";

import { Formik, Form } from "formik";

import { FormTextField, LoadingSpinner } from "../Components";

function ConfirmPasswordDialog({
  user,
  dialogOpen,
  setDialogOpen,
  setEditMode,
  handleConfirmChange,
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await onReAuth(user, password)
      .then(async () => {
        await handleConfirmChange();
        setDialogOpen(false);
        if (setEditMode) setEditMode(false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={dialogOpen} onClose={handleClose} justifycontent="center">
      <DialogTitle>{"Please enter your password to confirm."}</DialogTitle>
      <DialogContent>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <form id="password-form">
            <TextField
              id="password-field"
              label="Password"
              type="password"
              autoComplete="on"
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
        )}
      </DialogContent>
      {!loading && (
        <DialogActions>
          <Button
            id="submit-password-button"
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
      )}
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

  const handleSubmitGoogle = async (handleConfirmChange) => {
    await onReAuthGoogle(user)
      .then(async () => {
        await handleConfirmChange();
        if (setEditMode) setEditMode(false);
      })
      .catch(() => {});
  };

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
              onSubmit={async (values) => {
                if (user.providerData[0].providerId === "password") {
                  setDialogOpen(true);
                } else {
                  await handleSubmitGoogle(() => handleUpdate(values));
                }
              }}
              validationSchema={userPropSchema}
            >
              {(formikProps) => (
                <Form id={`${userProp}-particular-form`}>
                  <Grid container alignItems="center">
                    <Grid item>
                      <FormTextField
                        id={`${userProp}-particular-field`}
                        name={userProp}
                        label={userProp}
                        type={userPropType}
                        autoComplete="on"
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
                        id={`${userProp}-submit-edit-button`}
                        aria-label="edit"
                        variant="contained"
                        type="submit"
                        sx={{
                          backgroundColor: "#cff8df",
                          borderRadius: 1,
                        }}
                        disabled={!formikProps.dirty}
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
                  id={`${userProp}-edit-button`}
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
  const [confirmPWDialogOpen, setConfirmPWDialogOpen] = useState(false);
  const [confirmDeleteAccOpen, setConfirmDeleteAccOpen] = useState(false);

  const handleSubmitGoogle = async (handleConfirmChange) => {
    await onReAuthGoogle(user)
      .then(async () => {
        await handleConfirmChange();
        setConfirmDeleteAccOpen(false);
      })
      .catch(() => {});
  };

  const handleClick = (isEmail) => {
    isEmail ? setConfirmPWDialogOpen(true) : setConfirmDeleteAccOpen(true);
  };

  return (
    <>
      <Button
        id="delete-account-button"
        variant="contained"
        onClick={() =>
          handleClick(user.providerData[0].providerId === "password")
        }
        sx={{
          backgroundColor: "#ffe0f7",
          mt: 4,
          minWidth: "20vw",
          mb: 6,
        }}
      >
        <Typography>Delete Account</Typography>
        <Delete />
      </Button>
      <ConfirmPasswordDialog
        user={user}
        dialogOpen={confirmPWDialogOpen}
        setDialogOpen={setConfirmPWDialogOpen}
        handleConfirmChange={() => onDeleteUser(user)}
      />
      <Dialog
        open={confirmDeleteAccOpen}
        onClose={() => setConfirmDeleteAccOpen(false)}
      >
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Doing so will delete your account and all its data. Click confirm to
            proceed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDeleteAccOpen(false)}
            sx={{ color: "#b7b0f5" }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmitGoogle(() => onDeleteUser(user))}
            autoFocus
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function Profile() {
  const user = useAuth();
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();

  function handlePicChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }

  const updateState = useCallback(() => {
    setUsername(user.displayName);
    setEmail(user.email);
    setPhotoURL(user.photoURL);
  }, [user]);

  useEffect(() => {
    if (user) {
      updateState();
    }
  }, [user, updateState]);

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
      {!loading ? (
        <Button
          id="profile-picture-button"
          component="label"
          onChange={handlePicChange}
        >
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
      ) : (
        <Box
          sx={{
            width: 100,
            height: 100,
            marginBottom: 2,
          }}
        >
          <LoadingSpinner />
        </Box>
      )}
      {photo && (
        <Button
          id="confirm-profile-picture-button"
          variant="contained"
          onClick={() => {
            setLoading(true);
            updateUserProfilePicture(user, photo)
              .then(updateState)
              .finally(() => {
                setPhoto(null);
                setLoading(false);
              });
          }}
          sx={{ backgroundColor: "#cff8df" }}
          disabled={loading}
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

        {user.providerData[0].providerId === "password" && (
          <>
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
                password: Yup.string()
                  .required("Required")
                  .min(6, "Too short!"),
              })}
              handleUpdate={async (values) =>
                updateUserPassword(user, values.password)
              }
            />
          </>
        )}
      </Box>

      <DeleteAccount user={user} />
    </Box>
  );
}
