import { TextField } from "@mui/material";
import { Field, ErrorMessage } from "formik";

export const FormTextField = ({
  label,
  type,
  formikProps,
  hideError,
  ...props
}) => {
  return (
    <Field
      type={type}
      name={label}
      as={TextField}
      helperText={!hideError && <ErrorMessage name={label} />}
      error={
        !hideError && formikProps.errors[label] && formikProps.touched[label]
      }
      {...props}
    />
  );
};
