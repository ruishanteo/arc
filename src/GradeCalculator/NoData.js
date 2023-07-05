import { Box, Grid, Typography } from "@mui/material";

import noDataPic from "../Images/noData.jpg";

export const NoData = () => {
  return (
    <Box align="center">
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{
          height: "20vh",
          width: "40vw",
        }}
      >
        <Grid item xs={3} align="center">
          <Grid item align="left">
            <img width="200vw" src={noDataPic} alt="start" />{" "}
          </Grid>
          <Grid item>
            <Typography>You have no saved data. Get started!</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
