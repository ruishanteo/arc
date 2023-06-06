import { useEffect, useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useAuth } from "../UserAuth/FirebaseHooks";

import { fetchPosts } from "./ForumStore";
import { store } from "../stores/store";

import { LoadingSpinner } from "../Components/LoadingSpinner.js";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material/";
import { Add } from "@mui/icons-material";

export function Forum() {
  const user = useAuth();
  const navigate = useNavigate();
  const bgColor = ["#ffe0f7", "#fcf4d4", "#cff8df"];
  const [loading, setLoading] = useState(true);

  const posts = useSelector((state) => state.forum.posts);
  const users = useSelector((state) => state.users.users);

  const onUpdate = useCallback(() => {
    setLoading(true);
    store.dispatch(fetchPosts).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    onUpdate();
  }, [user, onUpdate]);

  let index = 1;

  return (
    <Container maxWidth="lg">
      <Box align="center">
        <Box align="left" sx={{ mt: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 450, minWidth: 250 }}>
            Forum
          </Typography>
          <Button
            sx={{ mt: 2, backgroundColor: "#b7b0f5", color: "white" }}
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/forum/new")}
          >
            Post
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          {loading ? (
            <LoadingSpinner />
          ) : posts.length === 0 ? (
            <Box>
              <Typography align="center">No posts found.</Typography>
            </Box>
          ) : (
            posts.map((row, index) => {
              const alternatingIndex = index % 3;
              return (
                <Box alignItems="center" key={row.id}>
                  <Link
                    to={`/forum/${row.id}`}
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    <Box
                      sx={{
                        height: "30vh",
                        backgroundColor: bgColor[alternatingIndex],
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 5,
                        mb: 3,
                      }}
                    >
                      <Card
                        sx={{
                          mx: 2,
                          width: "90vw",
                        }}
                      >
                        <CardActionArea sx={{ height: "25vh" }}>
                          <CardContent>
                            <Grid
                              container
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Grid item xs={2}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    maxWidth: "10vw",
                                    alignItems: "center",
                                  }}
                                >
                                  <Avatar
                                    sx={{ width: 80, height: 80 }}
                                    src={users[row.author.userId]?.photoURL}
                                  />
                                  <Box
                                    sx={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "-webkit-box",
                                      WebkitLineClamp: "1",
                                      WebkitBoxOrient: "vertical",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      sx={{ wordBreak: "break-word" }}
                                    >
                                      {users[row.author.userId]?.name}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>

                              <Grid item xs={10}>
                                <Box align="left" sx={{ ml: 2 }}>
                                  <Box
                                    sx={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "-webkit-box",
                                      WebkitLineClamp: "2",
                                      WebkitBoxOrient: "vertical",
                                    }}
                                  >
                                    <Typography
                                      variant="h6"
                                      sx={{ wordBreak: "break-word" }}
                                    >
                                      {row.title}
                                    </Typography>
                                  </Box>

                                  <Box
                                    sx={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "-webkit-box",
                                      WebkitLineClamp: "3",
                                      WebkitBoxOrient: "vertical",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      sx={{ wordBreak: "break-word" }}
                                    >
                                      {row.post}
                                    </Typography>
                                  </Box>

                                  <Box align="right">
                                    <Typography variant="caption">
                                      {row.formattedDatetime}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Box>
                  </Link>
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    </Container>
  );
}
