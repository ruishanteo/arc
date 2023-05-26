import { CircularProgress, Grid } from "@mui/material";

export const LoadingSpinner = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      sx={{ minHeight: "100vh", mt: 5 }}
    >
      <Grid item xs={3}>
        <CircularProgress color="neutral" size={30} />
      </Grid>
    </Grid>
  );
};
