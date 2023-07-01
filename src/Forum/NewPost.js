import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { useAuth } from "../UserAuth/FirebaseHooks.js";
import { store } from "../stores/store.js";
import { createPost } from "./ForumStore.js";

import { FormTextField } from "../Components/FormTextField.js";

import { LoadingButton } from "@mui/lab";
import { Box, Button, Container, Typography } from "@mui/material";
import { Cancel, Send } from "@mui/icons-material";

export function NewPost() {
  const navigate = useNavigate();
  const user = useAuth();

  return (
    <Container maxWidth="lg">
      <Formik
        initialValues={{ title: "", post: "" }}
        validationSchema={Yup.object().shape({
          title: Yup.string().required("Required"),
          post: Yup.string().required("Required"),
        })}
        onSubmit={async (values) => {
          await store
            .dispatch(
              createPost({
                ...values,
                author: {
                  userId: user.uid,
                },
              })
            )
            .then(() => navigate("/forum"))
        }}
      >
        {(formikProps) => (
          <Form id="login-form">
            <Box align="center">
              <Box sx={{ mt: 5, mb: 2 }} align="left">
                <Typography variant="h4">New Post</Typography>
              </Box>

              <Box align="center" display="flex" flexDirection="column">
                <FormTextField
                  label="title"
                  type="text"
                  id="title"
                  formikProps={formikProps}
                  inputProps={{ maxLength: 100 }}
                  placeholder="Enter title here"
                />
                <FormTextField
                  label="post"
                  type="text"
                  id="post"
                  formikProps={formikProps}
                  placeholder="Enter text here"
                  sx={{ mt: 2 }}
                  rows={5}
                  multiline
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <LoadingButton
                  id="submit-button"
                  type="submit"
                  sx={{ mr: 3, backgroundColor: "#cff8df" }}
                  variant="contained"
                  disabled={formikProps.isSubmitting}
                  loading={formikProps.isSubmitting}
                >
                  Submit <Send />
                </LoadingButton>

                <Link
                  to="/Forum"
                  style={{
                    color: "black",
                    textDecoration: "none",
                  }}
                >
                  <Button
                    sx={{ backgroundColor: "#fcf4d4" }}
                    variant="contained"
                    disabled={formikProps.isSubmitting}
                  >
                    Cancel
                    <Cancel />
                  </Button>
                </Link>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
