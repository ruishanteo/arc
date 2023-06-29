import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import {
  useAuth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "./FirebaseHooks.js";

import { Box, Button, Typography } from "@mui/material";
import { Looks } from "@mui/icons-material";

import { FormTextField } from "../Components/FormTextField.js";

export function Register() {
  const user = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  return (
    <Box align="center">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexGrowth: 1,
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#e0fbff",
          width: { xs: 400, md: 500 },
        }}
      >
        <Looks
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
          backgroundColor: "#fcebf8",
          width: { xs: 400, md: 500 },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 450 }}>
          Register
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 1,
          }}
        >
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("Required"),
              email: Yup.string()
                .email("Please enter a valid email")
                .required("Required"),
              password: Yup.string()
                .required("Required")
                .min(6, "Password is too short"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              await registerWithEmailAndPassword(
                values.name,
                values.email,
                values.password
              ).finally(() => setSubmitting(false));
            }}
          >
            {(formikProps) => (
              <Form id="register-form">
                <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                  <FormTextField
                    label="name"
                    type="name"
                    id="name"
                    formikProps={formikProps}
                    inputProps={{ maxLength: 20 }}
                    placeholder="Name"
                    variant="filled"
                  />
                  <FormTextField
                    label="email"
                    type="email"
                    id="email"
                    autoComplete="on"
                    formikProps={formikProps}
                    inputProps={{ maxLength: 50 }}
                    placeholder="E-mail Address"
                    variant="filled"
                    sx={{ mt: 1 }}
                  />
                  <FormTextField
                    label="password"
                    type="password"
                    id="password"
                    autoComplete="on"
                    formikProps={formikProps}
                    placeholder="Password"
                    variant="filled"
                    sx={{ mt: 1 }}
                  />
                  <Button
                    id="login-button"
                    type="submit"
                    disabled={formikProps.isSubmitting}
                    sx={{ mt: 4, backgroundColor: "#b7b0f5", color: "black" }}
                    variant="contained"
                  >
                    Register
                  </Button>
                  <Button
                    id="google-signin-button"
                    align="center"
                    onClick={signInWithGoogle}
                    disabled={formikProps.isSubmitting}
                    sx={{
                      mt: 2,
                      mb: 3,
                      backgroundColor: "#b7b0f5",
                      color: "black",
                    }}
                    variant="contained"
                  >
                    Register with Google
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>

          <Box>
            <Typography textAlign="center">
              Already have an account? <Link to="/Login">Login</Link> now.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
