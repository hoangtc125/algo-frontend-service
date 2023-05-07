import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import UserMenu from '../components/UserMenu';
import PushNotification from '../components/PushNotification'

export default function Home() {

  // console.log('[HomePage]',{data});

  return (
    <>
      <Typography variant='h4' sx={{ mb: '20px' }}>
        Algo App
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'right', mb: '10px' }}>
        <UserMenu />
        <PushNotification />
      </Box>
    </>
  );
}
