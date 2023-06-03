import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchComments } from "./ForumStore";

import { useAuth } from "../UserAuth/FirebaseHooks";

import { CommentComponent } from "./CommentComponent";
import { LoadingSpinner } from "../Components/LoadingSpinner.js";
import { NewComment } from "./NewComment.js";

import { Box, Divider, Typography } from "@mui/material";

export function Comment({ postId, posterId }) {
  const user = useAuth();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const comments = useSelector((state) => state.forum.comments);

  const onUpdate = useCallback(() => {
    setLoading(true);
    dispatch(fetchComments(postId)).finally(() => setLoading(false));
  }, [dispatch, postId]);

  useEffect(() => {
    onUpdate();
  }, [user, onUpdate]);

  return (
    <Box sx={{ mb: 10 }}>
      <NewComment postId={postId} posterId={posterId} onUpdate={onUpdate} />

      <Box
        align="left"
        sx={{ backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 1, p: 2 }}
      >
        <Typography variant="h4">Comments</Typography>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {comments.length === 0 ? (
              <Typography sx={{ mt: 1 }}>
                No comments... Be the first to comment!
              </Typography>
            ) : (
              comments.map((comment) => (
                <Box key={comment.id}>
                  <CommentComponent
                    id={comment.id}
                    comment={comment}
                    onUpdate={onUpdate}
                    loading={loading}
                    setLoading={setLoading}
                  />
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
