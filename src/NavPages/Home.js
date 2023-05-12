import React, { useEffect, useState } from "react";

import { useAuth } from "../UserAuth/Firebase.js";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";

import desktopImage from "../Images/homeDesktop.jpg";
import mobileImage from "../Images/homeMobile.jpg";

export function Home() {
  const [name, setName] = useState("");
  const currentUser = useAuth();
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
    if (currentUser) {
      setName(currentUser.displayName);
    }
  }, [currentUser]);

  return (
    <div
      style={{
        backgroundImage: `url(${imageURL})`,
        height: "90vh",
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
          <Typography variant="h3">Welcome, {name ? name : "___"}!</Typography>
          <Typography variant="h6">Let's get started.</Typography>
        </Box>
      </Box>
      <Box minHeight="40vh" />
      <Box
        align="center"
        sx={{
          mt: 5,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          style={{ border: "none", boxShadow: "none" }}
          sx={{ maxWidth: "20vw", maxHeight: "25vh", mr: 5 }}
        >
          <CardActionArea href="/GradeCalculator">
            <CalculateOutlinedIcon sx={{ fontSize: 80, display: "flex" }} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Grade Calculator
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keep track of scores attained for every assessment component.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card
          style={{ border: "none", boxShadow: "none" }}
          sx={{ maxWidth: "20vw", maxHeight: "25vh", mr: 5 }}
        >
          <CardActionArea>
            <AutoStoriesOutlinedIcon sx={{ fontSize: 80, display: "flex" }} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Module Planner
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Plan your modules for each semester to meet your degree
                requirements.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card
          style={{ border: "none", boxShadow: "none" }}
          sx={{ maxWidth: "20vw", maxHeight: "25vh", mr: 5 }}
        >
          <CardActionArea>
            <ForumOutlinedIcon sx={{ fontSize: 80, display: "flex" }} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Forum
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Discuss school related experiences and look for advice on the
                forum.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </div>
  );
}
