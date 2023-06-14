import { Box, Grid, Typography } from "@mui/material";

import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

export const NoData = () => {
  return (
    <Box align="center">
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{
          mt: 5,
          height: "20vh",
          width: "40vw",
        }}
      >
        <Grid item xs={3} align="center">
          <Typography sx={{ fontSize: 70 }}>
            <SentimentDissatisfiedIcon sx={{ fontSize: 50 }} />
          </Typography>

          <Typography>You have no saved data. Get started!</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
