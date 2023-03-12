import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "./Firebase.js";
import { TextField, Button } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LooksIcon from "@mui/icons-material/Looks";

export function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);

  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

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
