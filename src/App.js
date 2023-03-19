import { GradeCalculator } from "./GradeCalculator/GradeCalculator.js";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Header } from "./NavBar/Header.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./Login/Login.js";
import { Register } from "./Login/Register.js";
import { Landing } from "./Login/Landing.js";
import { Dashboard } from "./Login/Dashboard.js";
import { Reset } from "./Login/Reset.js";
import React from "react";
import { auth } from "./Login/Firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";

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
  const [user, loading, error] = useAuthState(auth);

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
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
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
