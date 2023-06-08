import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "./Firebase.js";
import {
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "./FirebaseHooks.js";

import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import LooksIcon from "@mui/icons-material/Looks";

export function Login() {
  const [email, setEmail] = useState("111@gmail.com");
  const [password, setPassword] = useState("123456");
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/home");
  }, [user, loading, navigate]);

  return (
    <Box align="center">
      <Box
        align="center"
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#e0fbff",
          width: { xs: 400, md: 500 },
          height: "13vh",
        }}
      >
        <LooksIcon
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
          alignItems: "center",
          backgroundColor: "#fcebf8",
          width: { xs: 400, md: 500 },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 450 }}>
          Login
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
          <TextField
            variant="filled"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
            sx={{ mt: 1 }}
          />

          <TextField
            variant="filled"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            sx={{ mt: 1 }}
          />

          <Button
            onClick={() => logInWithEmailAndPassword(email, password)}
            sx={{ mt: 4, backgroundColor: "#b7b0f5", color: "black" }}
            variant="contained"
          >
            Login
          </Button>

          <Button
            align="center"
            className="login__btn login__google"
            onClick={signInWithGoogle}
            sx={{ mt: 2, mb: 3, backgroundColor: "#b7b0f5", color: "black" }}
            variant="contained"
          >
            Login with Google
          </Button>

          <Grid container alignItems="center">
            <Grid item container direction="column" xs={12}>
              <Typography textAlign="center">
                <Link to="/reset">Forgot Password</Link>
              </Typography>
            </Grid>
            <Grid item container direction="column" xs={12}>
              <Typography textAlign="center">
                Don't have an account? <Link to="/register">Register</Link> now.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
