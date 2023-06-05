import { TextField } from "@mui/material";
import { Field, ErrorMessage } from "formik";

export const FormTextField = ({ label, type, formikProps, inputProps }) => {
  return (
    <Field
      type={type}
      name={label}
      as={TextField}
      helperText={<ErrorMessage name={label} />}
      error={formikProps.errors[label] && formikProps.touched[label]}
      inputProps={inputProps}
    />
  );
};
