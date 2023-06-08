import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "./FirebaseHooks.js";

import { Box, Grid, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Looks } from "@mui/icons-material";

export function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const register = () => {
    setLoading(true);
    registerWithEmailAndPassword(name, email, password)
      .then(() => {
        navigate("/home");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box align="center">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexGrowth: 1,
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#e0fbff",
          width: { xs: 400, md: 500 },
          height: "13vh",
        }}
      >
        <Looks
          sx={{
            mb: -4,
            fontSize: 50,
          }}
        />
        <Typography
          variant="h1"
          sx={{
            mt: 2,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
          }}
        >
          ARC
        </Typography>
      </Box>
      <Box
        sx={{
          padding: 5,
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fcebf8",
          width: { xs: 400, md: 500 },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 450 }}>
          Register
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 1,
          }}
        >
          <TextField
            variant="filled"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            sx={{ mt: 1 }}
            inputProps={{ maxLength: 20 }}
          />

          <TextField
            variant="filled"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
            sx={{ mt: 1 }}
            inputProps={{ maxLength: 50 }}
          />

          <TextField
            variant="filled"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            sx={{ mt: 1 }}
          />

          <LoadingButton
            align="center"
            onClick={register}
            sx={{ mt: 4, backgroundColor: "#b7b0f5", color: "black" }}
            variant="contained"
            loading={loading}
          >
            Register
          </LoadingButton>

          <LoadingButton
            align="center"
            onClick={signInWithGoogle}
            sx={{ mt: 2, mb: 3, backgroundColor: "#b7b0f5", color: "black" }}
            variant="contained"
            loading={loading}
          >
            Register with Google
          </LoadingButton>

          <Box>
            <Typography textAlign="center">
              Already have an account? <Link to="/Login">Login</Link> now.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
