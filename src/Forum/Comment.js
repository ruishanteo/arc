import { useCallback, useEffect, useState } from "react";

import { collection, query, where, getDocs } from "firebase/firestore";

import { db, useAuth } from "../UserAuth/Firebase";
import { LoadingSpinner } from "../Components/LoadingSpinner.js";
import { NewComment } from "./NewComment.js";

import { Avatar, Box, Divider, Typography } from "@mui/material";

export function Comment({ postId }) {
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuth();

  const getComments = useCallback(async () => {
    setLoading(true);

    const data = await getDocs(
      query(collection(db, "comments"), where("postId", "==", postId))
    );

    setLoading(false);
    setCommentList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [postId]);

  useEffect(() => {
    getComments();
  }, [user, getComments]);

  return (
    <Box sx={{ mb: 10 }}>
      <NewComment postId={postId} getComments={getComments} />

      <Box
        align="left"
        sx={{ backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 1, p: 2 }}
      >
        <Typography variant="h4">Comments</Typography>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {commentList.length === 0 ? (
              <Typography sx={{ mt: 1 }}>
                No comments... Be the first to comment!
              </Typography>
            ) : (
              commentList.map((comment) => (
                <Box key={comment.id}>
                  <Box
                    display="flex"
                    flexDirection="row"
                    sx={{ mt: 2 }}
                    align="left"
                    alignItems="center"
                  >
                    <Avatar
                      src={comment.author.profilePic}
                      sx={{
                        width: 60,
                        height: 60,
                        cursor: "pointer",
                        mr: 2,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1">
                        {comment.text}
                      </Typography>
                      <Typography variant="caption">
                        by {comment.author.username}
                      </Typography>
                    </Box>
                  </Box>
                  <Box align="right">
                    <Typography
                      variant="caption"
                      sx={{ transform: "translateY(-100%)" }}
                    >
                      {comment.datetime}
                    </Typography>
                  </Box>
                  <Divider />
                </Box>
              ))
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
