import { Grid, Typography } from "@mui/material";

export const NotFound = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      sx={{ mt: 5, height: "90vh" }}
    >
      <Grid item xs={3}>
        <Typography>404 NOT FOUND</Typography>
      </Grid>
    </Grid>
  );
};
