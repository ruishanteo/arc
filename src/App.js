import { GradeCalculator } from "./GradeCalculator/GradeCalculator.js";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Header } from "./NavBar/Header.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./UserAuth/Login.js";
import { Register } from "./UserAuth/Register.js";
import { Profile } from "./UserAuth/Profile.js";
import { Landing } from "./NavPages/Landing.js";
import { Home } from "./NavPages/Home.js";
import { Reset } from "./UserAuth/Reset.js";
import React from "react";
import { auth } from "./UserAuth/Firebase.js";
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
