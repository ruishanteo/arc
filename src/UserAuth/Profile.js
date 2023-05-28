import { useEffect, useState } from "react";
import {
  changeProfile,
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
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { Delete, PhotoCamera, Send } from "@mui/icons-material";

export function Profile() {
  const currentUser = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [newPassword, setNewPassword] = useState();

  const [confirmPW, setConfirmPW] = useState();
  const [open, setOpen] = useState(false);
  const [openPW, setOpenPW] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  function handlePicChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }

  function handleNameChange(e) {
    setUsername(e.target.value);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setNewPassword(e.target.value);
  }

  function handleClick() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleClickPW() {
    setOpenPW(true);
  }

  function handleClosePW() {
    setOpenPW(false);
  }

  function handleConfirmChange(e) {
    setConfirmPW(e.target.value);
  }

  async function onConfirmChange() {
    const err = await onReAuth(confirmPW, currentUser.email, currentUser);
    if (err !== "err") {
      await changeProfile(
        photo,
        username,
        email,
        newPassword,
        currentUser,
        setLoading
      );
      window.location.reload();
    }
    setOpen(false);
  }

  async function onConfirmChangePW() {
    const err = await onReAuth(confirmPW, currentUser.email, currentUser);
    if (err !== "err") {
      onDeleteUser(currentUser);
    }
    setOpenPW(false);
  }

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser]);

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
        <Box sx={{ marginTop: 5 }}>
          <IconButton aria-label="upload picture" component="label">
            <input hidden accept="image/*" type="file" />
            <PhotoCamera />
          </IconButton>
        </Box>
        <input hidden accept="image/*" multiple type="file" />
      </Button>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h4">Edit your particulars</Typography>
      </Box>

      <TextField
        placeholder={username}
        onChange={handleNameChange}
        sx={{ mt: "10px", minWidth: "40vw" }}
        label="New Username"
      />

      <TextField
        defaultValue={email}
        onChange={handleEmailChange}
        sx={{ mt: "10px", minWidth: "40vw" }}
        label="New Email"
      />

      <TextField
        defaultValue={email}
        onChange={handlePasswordChange}
        sx={{ mt: "10px", minWidth: "40vw" }}
        label="New Password"
      />

      <Button
        variant="contained"
        disabled={
          loading ||
          (!photo &&
            (!username || username === currentUser?.displayName) &&
            (!email || email === currentUser?.email) &&
            !newPassword)
        }
        onClick={handleClick}
        sx={{ backgroundColor: "#b7b0f5", mt: 2, minWidth: "20vw" }}
      >
        <Typography sx={{ marginRight: 1 }}>Submit</Typography>
        <Send />
      </Button>

      <Button
        variant="contained"
        onClick={handleClickPW}
        sx={{ backgroundColor: "#ffe0f7", mt: 2, minWidth: "20vw" }}
      >
        <Typography> Delete Account</Typography>
        <Delete />
      </Button>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        display="flex"
        justifycontent="center"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Please enter your password to confirm."}
        </DialogTitle>

        <DialogContent>
          <TextField label="Password" onChange={handleConfirmChange} />
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#cff8df" }}
            autoFocus
            onClick={onConfirmChange}
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

      <Dialog
        fullScreen={fullScreen}
        open={openPW}
        onClose={handleClosePW}
        aria-labelledby="responsive-dialog-title"
        display="flex"
        justifycontent="center"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Please enter your password to confirm."}
        </DialogTitle>

        <DialogContent>
          <TextField label="Password" onChange={handleConfirmChange} />
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#cff8df" }}
            autoFocus
            onClick={onConfirmChangePW}
          >
            Confirm
          </Button>
          <Button
            variant="contained"
            onClick={handleClosePW}
            sx={{ backgroundColor: "#fcf4d4" }}
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
