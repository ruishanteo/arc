import { Box, Button, Grid, Typography } from "@mui/material";

import notFoundPic from "../Images/notFound.jpg";

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
        <Grid item xs={3} align="center">
          <Grid item>
            <img width="250px" src={notFoundPic} alt="Page not found" />
          </Grid>

          <Grid item>
            <Typography>
              The page you are looking for can't be found.
            </Typography>
            <Button
              variant="contained"
              href="/home"
              sx={{ mt: 2, backgroundColor: "#b7b0f5", color: "white" }}
            >
              Go to home
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
