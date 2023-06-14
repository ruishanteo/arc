import React from "react";
import { useSelector } from "react-redux";

import { store } from "../stores/store";
import { deleteComponent, updateComponent } from "./GradeStore";

import { FormTextField } from "../Components";

import { Grid, IconButton, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const min = 0;
const max = 100;

const DISPLAY_NAMES = {
  componentTitle: "ASSESSMENT",
  score: "SCORE",
  total: "TOTAL",
  weight: "WEIGHTAGE",
};

export function AssessmentComponent({
  assessmentIndex,
  componentIndex,
  formikProps,
}) {
  const component = useSelector(
    (state) =>
      state.calculator.assessments[assessmentIndex].components[componentIndex]
  );

  function onChange(value, dataKey) {
    store.dispatch(
      updateComponent(assessmentIndex, componentIndex, dataKey, value)
    );
  }

  return (
    <Grid container maxWidth="lg" align="center">
      <Grid container maxWidth="lg" align="center">
        <Grid item width="1vw" sx={{ display: { lg: "flex", xs: "none" } }} />

        <Grid
          item
          xs={5.5}
          sm={5.8}
          md={6}
          sx={{
            align: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <IconButton
            type="button"
            onClick={() =>
              store.dispatch(deleteComponent(assessmentIndex, componentIndex))
            }
            sx={{
              backgroundColor: "#fcf4d4",
              borderRadius: 1,
              color: "black",
              height: "5vh",
              width: "2vw",
              mr: 1,
            }}
          >
            <ClearIcon />
          </IconButton>

          <FormTextField
            label={`components[${componentIndex}].componentTitle`}
            type="text"
            formikProps={formikProps}
            hideError={true}
            fullWidth
            placeholder="Assessment"
            value={component.componentTitle}
            onChange={(event) => {
              onChange(event.target.value, "componentTitle");
            }}
            inputProps={{
              min,
              max,
              style: { fontSize: "0.75rem" },
              maxLength: 15,
            }}
          />
        </Grid>

        <Grid item xs={2} lg={1.8}>
          <FormTextField
            label={`components[${componentIndex}].score`}
            type="number"
            formikProps={formikProps}
            hideError={true}
            value={component.score}
            onChange={(event) => {
              let value = parseInt(event.target.value, 10);
              if (value < min) value = min;
              if (Number.isNaN(value)) value = 0;
              onChange(value, "score");
            }}
            inputProps={{
              min,
              max,
              style: { fontSize: "0.75rem" },
            }}
          />
        </Grid>

        <Grid item xs={2} lg={1.8}>
          <FormTextField
            label={`components[${componentIndex}].total`}
            type="number"
            formikProps={formikProps}
            hideError={true}
            value={component.total}
            onChange={(event) => {
              let value = parseInt(event.target.value, 10);
              if (value < min) value = min;
              if (Number.isNaN(value)) value = 0;
              onChange(value, "total");
            }}
            inputProps={{
              min,
              max,
              style: { fontSize: "0.75rem" },
            }}
          />
        </Grid>

        <Grid item xs={2} lg={1.8}>
          <FormTextField
            label={`components[${componentIndex}].weight`}
            type="number"
            formikProps={formikProps}
            hideError={true}
            value={component.weight}
            onChange={(event) => {
              let value = parseInt(event.target.value, 10);
              if (value > max) value = max;
              if (value < min) value = min;
              if (Number.isNaN(value)) value = 0;
              onChange(value, "weight");
            }}
            inputProps={{
              min,
              max,
              style: { fontSize: "0.75rem" },
            }}
          />
        </Grid>
      </Grid>
      {!(formikProps.isValid ?? formikProps.isValid) &&
        formikProps.errors &&
        formikProps.errors.components &&
        formikProps.touched.components[componentIndex] &&
        formikProps.errors.components[componentIndex] &&
        Object.keys(formikProps.errors.components[componentIndex]).filter(
          (key, index) => formikProps.touched.components[componentIndex][key]
        ).length !== 0 && (
          <Grid container maxWidth="lg" align="center">
            <Grid>
              <Typography align="left" variant="body2">
                The following errors occurred while trying to calculate:
              </Typography>

              {Object.keys(formikProps.errors.components[componentIndex]).map(
                (key, index) => {
                  if (formikProps.touched.components[componentIndex][key]) {
                    const value =
                      formikProps.errors.components[componentIndex][key];
                    return (
                      <Typography key={index} align="left" variant="body2">
                        {`\n\u2022 ${DISPLAY_NAMES[key]}: ${value}`}
                      </Typography>
                    );
                  }
                  return null;
                }
              )}
            </Grid>
          </Grid>
        )}
    </Grid>
  );
}
