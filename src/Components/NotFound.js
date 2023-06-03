import { Box, Button, Grid, Typography } from "@mui/material";

import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

export const NotFound = () => {
  return (
    <Box align="center">
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{
          mt: 5,
          height: "50vh",
          width: "40vw",
        }}
      >
        <Grid item xs={3} />
        <Grid item xs={3} align="center">
          <Typography sx={{ fontSize: 70 }}>
            4 <SentimentDissatisfiedIcon sx={{ fontSize: 50 }} /> 4
          </Typography>

          <Typography>The page you are looking for can't be found.</Typography>
          <Button
            variant="contained"
            href="/home"
            sx={{ mt: 2, backgroundColor: "#b7b0f5", color: "white" }}
          >
            Go to home
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
