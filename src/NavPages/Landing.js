import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";

import LooksIcon from "@mui/icons-material/Looks";

import landing from "../landing.jpg";

export function Landing() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Box
            sx={{
              flexDirection: "row",
              flexGrow: 4,
              display: { xs: "none", md: "flex" },
            }}
          >
            <LooksIcon
              sx={{ fontSize: 40, display: { xs: "none", md: "flex" }, mr: 1 }}
            />
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
                display: { xs: "none", md: "flex" },
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

      <Container maxWidth="lg" align="center">
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            width: 1200,
            height: 450,
          }}
          align="left"
        >
          <img src={landing} alt="Logo" />
          <Box sx={{ ml: 20, display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{
                mt: -55,
                color: "black",
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: 70,
                letterSpacing: ".3rem",
              }}
              variant="h3"
            >
              <LooksIcon
                sx={{
                  fontSize: 70,
                  display: { xs: "none", md: "flex" },
                  mr: 1,
                }}
              />
              ARC
            </Typography>
            <Typography sx={{ color: "black" }} variant="h8">
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

        <Box
          align="right"
          sx={{
            marginTop: -5,
            mr: 20,
          }}
        >
          <Typography sx={{ color: "black" }} variant="h4">
            Boost your productivity.
          </Typography>
          <Typography>Some description about the place.</Typography>
        </Box>
      </Container>
    </div>
  );
}
