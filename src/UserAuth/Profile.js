import { useEffect, useState } from "react";
import { changeProfile, onReAuth, useAuth } from "./Firebase.js";

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

import { PhotoCamera, Send } from "@mui/icons-material";

export function Profile() {
  const currentUser = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();

  const [confirmPW, setConfirmPW] = useState();
  const [open, setOpen] = useState(false);
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

  function handleClick() {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  function handleConfirmChange(e) {
    setConfirmPW(e.target.value);
  }

  async function onConfirmChange(e) {
    await onReAuth(confirmPW, currentUser.email, currentUser);
    await changeProfile(photo, username, email, currentUser, setLoading);
    setOpen(false);
  }

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser]);

  return (
    <Box
      sx={{ marginTop: 8, display: "flex", flexDirection: "column" }}
      align="center"
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

      <TextField
        placeholder={username}
        onChange={handleNameChange}
        sx={{ maxWidth: "40vw" }}
        label="Username"
      />

      <TextField
        defaultValue={email}
        onChange={handleEmailChange}
        sx={{ maxWidth: "40vw", mt: "10px" }}
        label="Email"
      />

      <Button
        variant="contained"
        disabled={
          loading ||
          (!photo &&
            (!username || username === currentUser?.displayName) &&
            (!email || email === currentUser?.email))
        }
        onClick={handleClick}
        sx={{ backgroundColor: "#ffe0f7", width: 120, height: 40, mt: 2 }}
      >
        <Typography sx={{ marginRight: 1 }}>Submit</Typography>
        <Send />
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
          <TextField label="password" onChange={handleConfirmChange} />
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            autoFocus
            onClick={(e) => onConfirmChange(e)}
          >
            Confirm
          </Button>
          <Button variant="contained" onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
