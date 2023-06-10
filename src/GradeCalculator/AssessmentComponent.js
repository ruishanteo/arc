import { useSelector } from "react-redux";

import { store } from "../stores/store";
import { deleteComponent, updateComponent } from "./GradeStore";

import { Grid, IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const min = 0;
const max = 100;

export function AssessmentComponent({ assessmentIndex, componentIndex }) {
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

        <TextField
          fullWidth
          placeholder="Assessment"
          type="text"
          id="component"
          value={component.componentTitle}
          onChange={(event) => {
            onChange(event.target.value, "componentTitle");
          }}
          inputProps={{
            min,
            max,
            style: { fontSize: "0.75rem" },
          }}
        />
      </Grid>

      <Grid item xs={2} lg={1.8}>
        <TextField
          type="number"
          value={component.score}
          onChange={(event) => {
            var value = parseInt(event.target.value, 10);
            if (value < min) value = min;
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
        <TextField
          type="number"
          value={component.total}
          onChange={(event) => {
            var value = parseInt(event.target.value, 10);

            if (value < min) value = min;

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
        <TextField
          type="number"
          value={component.weight}
          onChange={(event) => {
            var value = parseInt(event.target.value, 10);

            if (value > max) value = max;
            if (value < min) value = min;

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
  );
}
