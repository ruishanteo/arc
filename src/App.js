import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "./UserAuth/Firebase.js";
import { GradeCalculator } from "./GradeCalculator/GradeCalculator.js";
import { Header } from "./NavBar/Header.js";
import { Home } from "./NavPages/Home.js";
import { Landing } from "./NavPages/Landing.js";
import { Login } from "./UserAuth/Login.js";
import { Profile } from "./UserAuth/Profile.js";
import { Register } from "./UserAuth/Register.js";
import { Reset } from "./UserAuth/Reset.js";

import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  status: {
    danger: "#ebaaa7",
  },
  palette: {
    primary: {
      main: "#e0fbff",
      darker: "#053e85",
    },
    neutral: {
      main: "#b7b0f5",
      contrastText: "#fff",
    },
  },
});

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        {user ? (
          <>
            <Header />
            <div className="App">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/GradeCalculator" element={<GradeCalculator />} />
              </Routes>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
