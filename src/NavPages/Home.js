import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { query, collection, getDocs, where } from "firebase/firestore";
import { auth, db } from "../UserAuth/Firebase.js";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@mui/material";

import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";

import background from "../background.jpg";

export function Home() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading, navigate]);

  return (
    <Container maxWidth="lg" align="center">
      <Box
        sx={{
          marginTop: 5,
          display: "flex",
          flexDirection: "column",
          width: 1100,
          height: 300,
        }}
        align="left"
      >
        <img src={background} alt="Logo" />
        <Typography sx={{ ml: 20, mt: -30 }} variant="h3">
          Welcome, {name ? name : "___"}!
        </Typography>
        <Typography sx={{ ml: 20 }} variant="h6">
          Let's get started.
        </Typography>
      </Box>
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
          sx={{ maxWidth: 345 }}
        >
          <CardActionArea href="/GradeCalculator">
            <CalculateOutlinedIcon
              sx={{ fontSize: 80, display: { xs: "none", md: "flex" } }}
            />
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
          sx={{ maxWidth: 345 }}
        >
          <CardActionArea>
            <AutoStoriesOutlinedIcon
              sx={{ fontSize: 80, display: { xs: "none", md: "flex" } }}
            />
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
          sx={{ maxWidth: 345 }}
        >
          <CardActionArea>
            <ForumOutlinedIcon
              sx={{ fontSize: 80, display: { xs: "none", md: "flex" } }}
            />
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
    </Container>
  );
}
