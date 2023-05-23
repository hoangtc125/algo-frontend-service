import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import UserMenu from '../components/UserMenu';
import PushNotification from '../components/PushNotification'
import ToDo from './Todo';

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
      <ToDo />
    </>
  );
}
