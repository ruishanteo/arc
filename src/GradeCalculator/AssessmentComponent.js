import { Grid, IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const min = 0;
const max = 100;

export function AssessmentComponent({
  index,
  updateText,
  getText,
  deleteComponent,
}) {
  function onChange(value, dataKey) {
    updateText(index, dataKey, value);
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
          onClick={() => deleteComponent(index)}
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
          value={getText(index, "componentTitle")}
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
          value={getText(index, "score")}
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
          value={getText(index, "total")}
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
          value={getText(index, "weight")}
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
