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
    <div className="register" align="center">
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
        <Looks
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
          Register
        </Typography>

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", mt: 1 }}
        >
          <TextField
            variant="filled"
            type="text"
            className="register__textBox"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            sx={{ mt: 1, width: 400 }}
            inputProps={{ maxLength: 50 }}
          />

          <TextField
            variant="filled"
            type="text"
            className="register__textBox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
            sx={{ mt: 1 }}
          />

          <TextField
            variant="filled"
            type="password"
            className="register__textBox"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            sx={{ mt: 1 }}
          />

          <LoadingButton
            align="center"
            className="register__btn"
            onClick={register}
            sx={{ mt: 4, backgroundColor: "#b7b0f5", color: "black" }}
            variant="contained"
            loading={loading}
          >
            Register
          </LoadingButton>

          <LoadingButton
            align="center"
            className="register__btn register__google"
            onClick={signInWithGoogle}
            sx={{ mt: 2, mb: 3, backgroundColor: "#b7b0f5", color: "black" }}
            variant="contained"
            loading={loading}
          >
            Register with Google
          </LoadingButton>

          <Grid container alignItems="center">
            <Grid item container direction="column" xs={12}>
              <Typography textAlign="center">
                Already have an account? <Link to="/Login">Login</Link> now.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}
