import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";

import { db } from "../UserAuth/Firebase.js";
import { Comment } from "./Comment.js";
import { LoadingSpinner } from "../Components/LoadingSpinner.js";

import { Avatar, Box, Button, Container, Typography } from "@mui/material";

export function Post() {
  const params = useParams();
  const id = params.id;

  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [exist, setExist] = useState(true);

  const navigate = useNavigate();

  const getPost = useCallback(async () => {
    setLoading(true);
    const q = await getDoc(doc(db, "posts", id));
    setLoading(false);
    q.exists() ? setPost(q.data()) : setExist(false);
  }, [id]);

  useEffect(() => {
    getPost();
    if (!exist) {
      navigate("/forum");
    }
  }, [exist, getPost, id, navigate]);

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg">
      <Box align="center">
        <Box align="left" sx={{ mt: 5, mb: 2 }}>
          <Button
            sx={{ backgroundColor: "#ffe0f7", maxHeight: "5vh" }}
            variant="contained"
            onClick={() => navigate("/forum")}
          >
            Back
          </Button>

          <Box
            display="flex"
            flexDirection="row"
            sx={{ mt: 5, mb: 2 }}
            align="left"
          >
            <Avatar
              src={post.author.profilePic}
              sx={{
                width: 100,
                height: 100,
                cursor: "pointer",
                mb: 2,
                mx: 2,
              }}
            />
            <Box display="flex" flexDirection="column">
              <Typography variant="h4">{post.title}</Typography>
              <Typography variant="body1">{post.post}</Typography>
            </Box>
          </Box>
        </Box>

        <Comment postId={id} />
      </Box>
    </Container>
  );
}
