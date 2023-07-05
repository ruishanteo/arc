import { Form, Formik } from "formik";
import * as Yup from "yup";

import { useAuth } from "../UserAuth/FirebaseHooks.js";

import { store } from "../stores/store.js";
import { createComment } from "./ForumStore.js";

import { FormTextField } from "../Components/FormTextField.js";

import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import { Send } from "@mui/icons-material";

export function NewComment({ postId, posterId, onUpdate }) {
  const user = useAuth();

  return (
    <Box align="center">
      <Formik
        initialValues={{ comment: "" }}
        validationSchema={Yup.object().shape({
          comment: Yup.string().required("Required"),
        })}
        onSubmit={async (values, { resetForm }) => {
          await store
            .dispatch(
              createComment({
                postId: postId,
                posterId: posterId,
                text: values.comment,
                author: {
                  userId: user.uid,
                },
              })
            )
            .finally(() => {
              resetForm();
              onUpdate();
            });
        }}
      >
        {(formikProps) => (
          <Form id="login-form">
            <FormTextField
              label="comment"
              type="text"
              id="comment"
              formikProps={formikProps}
              placeholder="Enter reply here"
              multiline
              rows={3}
              fullWidth
            />

            <LoadingButton
              type="submit"
              id="new-comment-button"
              sx={{ mt: 3, mb: 3, backgroundColor: "#cff8df" }}
              variant="contained"
              disabled={formikProps.isSubmitting}
              loading={formikProps.isSubmitting}
            >
              Submit
              <Send />
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
