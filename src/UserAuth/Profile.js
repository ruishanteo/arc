import { useEffect, useState } from "react";
import { upload, useAuth } from "./Firebase.js";

import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { PhotoCamera, Send } from "@mui/icons-material";

export function Profile() {
  const currentUser = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState();

  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }

  function handleClick() {
    upload(photo, currentUser, setLoading);
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
      <Button component="label" onChange={handleChange}>
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

      <Button
        variant="contained"
        disabled={loading || !photo}
        onClick={handleClick}
        sx={{ backgroundColor: "#ffe0f7", width: 120, height: 40 }}
      >
        <Typography sx={{ marginRight: 1 }}>Submit</Typography>
        <Send />
      </Button>
    </Box>
  );
}
