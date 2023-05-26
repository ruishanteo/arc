import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";
import { Provider as ReduxProvider } from "react-redux";
import { SnackbarProvider } from "notistack";

import { auth } from "./UserAuth/Firebase.js";
import { GradeCalculator } from "./GradeCalculator/GradeCalculator.js";
import { Forum } from "./Forum/Forum.js";
import { Header } from "./NavBar/Header.js";
import { Home } from "./NavPages/Home.js";
import { Landing } from "./NavPages/Landing.js";
import { Login } from "./UserAuth/Login.js";
import { Profile } from "./UserAuth/Profile.js";
import { Register } from "./UserAuth/Register.js";
import { Reset } from "./UserAuth/Reset.js";

import { DismissIconButton, Notifier } from "./Notifications/";
import { store } from "./stores/store.js";

import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";

import desktopImage from "./Images/backgroundDesktop.jpg";
import mobileImage from "./Images/backgroundMobile.jpg";

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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const imageURL = windowWidth >= 915 ? desktopImage : mobileImage;

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  if (loading) return;
  return (
    <div
      style={{
        backgroundImage: `url(${imageURL})`,
        height: "100vh",
        width: "100vw",
        backgroundSize: "cover",
        overflowY: "scroll",
        overflowX: "scroll",
      }}
    >
      <ThemeProvider theme={theme}>
        <ReduxProvider store={store}>
          <SnackbarProvider
            maxSnack={5}
            action={(id) => <DismissIconButton id={id} />}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <CssBaseline />
            <Notifier />

            <Router>
              {user ? (
                <>
                  <Header />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route
                      path="/GradeCalculator"
                      element={<GradeCalculator />}
                    />
                    <Route
                      path="/Forum"
                      element={<Forum />}
                    />
                    <Route path="*" element={<Home />} />
                  </Routes>
                </>
              ) : (
                <>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset" element={<Reset />} />
                    <Route path="*" element={<Landing />} />
                  </Routes>
                </>
              )}
            </Router>
          </SnackbarProvider>
        </ReduxProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
