import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import {
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "./FirebaseHooks.js";

import { Box, Button, Grid, Typography } from "@mui/material";
import LooksIcon from "@mui/icons-material/Looks";

import { FormTextField } from "../Components/FormTextField.js";

export function Login() {
  const navigate = useNavigate();
  return (
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
          Login
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Please enter a valid email")
                .required("Required"),
              password: Yup.string()
                .required("Required")
                .min(6, "Password is too short"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              await logInWithEmailAndPassword(values.email, values.password)
                .then(() => navigate("/home"))
                .finally(() => setSubmitting(false));
            }}
          >
            {(formikProps) => (
              <Form id="login-form">
                <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                  <FormTextField
                    label="email"
                    id="email"
                    type="email"
                    autoComplete="on"
                    formikProps={formikProps}
                    placeholder="E-mail Address"
                    variant="filled"
                  />
                  <FormTextField
                    label="password"
                    id="password"
                    type="password"
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
                    Login
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
                    Login with Google
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>

          <Grid container alignItems="center">
            <Grid item container direction="column" xs={12}>
              <Typography textAlign="center">
                <Link to="/reset">Forgot Password</Link>
              </Typography>
            </Grid>
            <Grid item container direction="column" xs={12}>
              <Typography textAlign="center">
                Don't have an account? <Link to="/register">Register</Link> now.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
