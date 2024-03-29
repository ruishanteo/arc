import React, { useEffect, useState } from "react";

import { useAuth } from "../UserAuth/FirebaseHooks.js";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";

import desktopImage from "../Images/homeDesktop.jpeg";
import mobileImage from "../Images/homeMobile.jpeg";

import Typewriter from "typewriter-effect";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../UserAuth/Firebase.js";

export function Home() {
  const user = useAuth();
  const [name, setName] = useState("");
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

  useEffect(() => {
    if (user) {
      if (user.displayName) {
        setName(user.displayName);
      }

      async function createUserCollection() {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: user.displayName,
            authProvider:
              user.providerData[0].providerId === "password"
                ? "local"
                : "google",
            email: user.email,
            photoURL: user.photoURL,
          });
        }
      }
      createUserCollection();
    }
  }, [user]);

  if (user) {
    user.reload().then(() => {
      setName(user.displayName);
    });
  }

  return (
    <div
      style={{
        backgroundImage: `url(${imageURL})`,
        height: "93vh",
        backgroundSize: "cover",
        overflowY: "scroll",
      }}
    >
      <Box display="flex" flexDirection="row">
        <Box minWidth="20vw" />
        <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
          }}
          align="left"
        >
          {name && (
            <Typography variant="h3">
              <Typewriter
                onInit={(typewriter) => {
                  typewriter.typeString("Welcome, " + name + "!").start();
                }}
              />
            </Typography>
          )}
          <Typography variant="h6">Let's get started.</Typography>
        </Box>
      </Box>
      <Box minHeight="45vh" />
      <Grid
        container
        justifyContent="center"
        spacing={3}
        sx={{ backgroundColor: "rgba(255,255,255,0.7)" }}
      >
        <Grid key={"calc"} item>
          <Card
            style={{
              border: "none",
              boxShadow: "none",
              backgroundColor: "transparent",
            }}
            sx={{ maxWidth: "20vw", overflow: "auto" }}
          >
            <CardActionArea href="/GradeCalculator">
              <Box
                align="center"
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  maxHeight: "10vh",
                }}
              >
                <CalculateOutlinedIcon sx={{ fontSize: "10vh" }} />
              </Box>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  align="center"
                >
                  Grade Calculator
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Keep track of scores attained for every assessment component.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid key={"planner"} item>
          <Card
            style={{
              border: "none",
              boxShadow: "none",
              backgroundColor: "transparent",
            }}
            sx={{ maxWidth: "20vw", overflow: "auto" }}
          >
            <CardActionArea href="/ModulePlanner">
              <Box
                align="center"
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  maxHeight: "10vh",
                }}
              >
                <AutoStoriesOutlinedIcon sx={{ fontSize: "10vh" }} />
              </Box>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  align="center"
                >
                  Module Planner
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Plan your modules for each semester to meet your degree
                  requirements.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid key={"forum"} item>
          <Card
            style={{
              border: "none",
              boxShadow: "none",
              backgroundColor: "transparent",
            }}
            sx={{ maxWidth: "20vw", overflow: "auto" }}
          >
            <CardActionArea href="/forum">
              <Box
                align="center"
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  maxHeight: "10vh",
                }}
              >
                <ForumOutlinedIcon sx={{ fontSize: "10vh" }} />
              </Box>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  align="center"
                >
                  Forum
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Discuss school related experiences and look for advice on the
                  forum.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
