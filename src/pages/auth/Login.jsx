import React from 'react';
import { Box, CssBaseline, Grid, Paper } from '@mui/material';

import Login from '../../components/auth/Login';
import loginImage from '../../assets/images/login.png'

const LoginPage = () => {
  return (
    <Box>
      <Grid container>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${loginImage})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh"
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
        >
          <Login />
        </Grid>
      </Grid>
    </Box>
  );
}

export default LoginPage;
