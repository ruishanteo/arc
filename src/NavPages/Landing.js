import { useEffect, useState } from "react";

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

import LooksIcon from "@mui/icons-material/Looks";

import desktopImage from "../Images/landingDesktop.jpeg";
import mobileImage from "../Images/landingMobile.jpeg";

export function Landing() {
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

  return (
    <div
      style={{
        backgroundImage: `url(${imageURL})`,
        height: "100vh",
        backgroundSize: "cover",
        overflowY: "scroll",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Box
            sx={{
              flexDirection: "row",
              flexGrow: 4,
              display: "flex",
            }}
          >
            <LooksIcon sx={{ fontSize: 40, display: "flex", mr: 1 }} />
            <Typography
              variant="h5"
              sx={{
                mr: 2,
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: ".3rem",
                color: "inherit",
              }}
            >
              ARC
            </Typography>
            <Box
              sx={{
                mr: 2,
                justifyContent: "right",
                flexGrow: 1,
                display: "flex",
              }}
            >
              <Button
                sx={{ backgroundColor: "#ffe0f7", mr: 2 }}
                component="a"
                href="/login"
                variant="contained"
              >
                Login
              </Button>
              <Button
                sx={{ backgroundColor: "#ffe0f7" }}
                component="a"
                href="/register"
                variant="contained"
              >
                Register
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box display="flex" flexDirection="column">
        <Box minHeight="10vh" />

        <Box display="flex" flexDirection="row">
          <Box minWidth="25vw" />

          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              width: "80vw",
              height: "55vh",
              alignItems: "center",
            }}
          >
            <Box display="flex" flexDirection="row">
              <LooksIcon
                sx={{
                  fontSize: 100,
                  mr: 2.5,
                }}
              />
              <Typography
                sx={{
                  color: "black",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: "1.4rem",
                  mt: 1.5,
                }}
                variant="h1"
              >
                ARC
              </Typography>
            </Box>

            <Typography sx={{ color: "black" }} variant="h5">
              Your one-stop planning needs.
            </Typography>
            <Button
              sx={{ mt: 3, backgroundColor: "#e0fbff", width: 200 }}
              component="a"
              href="/register"
              variant="contained"
            >
              Get Started
            </Button>
          </Box>
        </Box>
        <Box minHeight="10vh" />
        <Box minHeight="12vh" backgroundColor="white" align="center">
          <Typography sx={{ color: "black" }} variant="h4">
            Boost your productivity.
          </Typography>
          <Typography>
            Includes grade calculator, module planner and forum.
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
