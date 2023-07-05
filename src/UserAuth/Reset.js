import React from "react";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { sendPasswordReset } from "./FirebaseHooks.js";

import { FormTextField } from "../Components/FormTextField.js";

import { Box, Button, Typography } from "@mui/material";
import LooksIcon from "@mui/icons-material/Looks";

export function Reset() {
  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Please enter a valid email")
          .required("Required"),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        await sendPasswordReset(values.email);
      }}
    >
      {(formikProps) => (
        <Form id="reset-form">
          <Box align="center">
            <Box
              align="center"
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#e0fbff",
                width: { xs: 400, md: 500 },
                height: "13vh",
              }}
            >
              <LooksIcon
                sx={{
                  mb: -4,
                  fontSize: 50,
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  mt: 2,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                }}
              >
                ARC
              </Typography>
            </Box>
            <Box
              sx={{
                padding: 5,
                marginTop: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#fcebf8",
                width: { xs: 400, md: 500 },
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 450 }}>
                Reset Password
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                <FormTextField
                  label="email"
                  type="email"
                  id="email"
                  autoComplete="on"
                  formikProps={formikProps}
                  placeholder="E-mail Address"
                  variant="filled"
                  sx={{ mt: 1 }}
                />

                <Button
                  type="submit"
                  id="submit-button"
                  sx={{
                    mt: 4,
                    mb: 3,
                    backgroundColor: "#b7b0f5",
                    color: "black",
                  }}
                  variant="contained"
                >
                  Send email
                </Button>
                <Typography>
                  Don't have an account? <Link to="/register">Register</Link>{" "}
                  now.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
