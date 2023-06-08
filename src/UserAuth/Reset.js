import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "./Firebase.js";
import { sendPasswordReset } from "./FirebaseHooks.js";

import { Box, Button, TextField, Typography } from "@mui/material";
import LooksIcon from "@mui/icons-material/Looks";

export function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/home");
  }, [user, loading, navigate]);

  return (
    <div className="reset" align="center">
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
          Reset Password
        </Typography>

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", mt: 1 }}
        >
          <TextField
            variant="filled"
            type="text"
            className="reset__textBox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
            sx={{ mt: 1 }}
          />

          <Button
            className="reset__btn"
            onClick={() => sendPasswordReset(email)}
            sx={{ mt: 4, mb: 3, backgroundColor: "#b7b0f5", color: "black" }}
            variant="contained"
          >
            Send email
          </Button>
          <div>
            Don't have an account? <Link to="/register">Register</Link> now.
          </div>
        </Box>
      </Box>
    </div>
  );
}
