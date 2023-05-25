import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "./Firebase.js";

import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import LooksIcon from "@mui/icons-material/Looks";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="login" align="center">
      <Box
        align="center"
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#e0fbff",
          width: 500,
          height: 100,
        }}
      >
        <LooksIcon
          sx={{
            mb: -4,
            fontSize: 50,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: 50,
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
          width: 500,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 450 }}>
          Login
        </Typography>

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", mt: 1 }}
        >
          <TextField
            variant="filled"
            type="text"
            className="login__textBox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
            sx={{ mt: 1 }}
          />

          <TextField
            variant="filled"
            type="password"
            className="login__textBox"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            sx={{ mt: 1 }}
          />

          <Button
            className="login__btn"
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
    </div>
  );
}
