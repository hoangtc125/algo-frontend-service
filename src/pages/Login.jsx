import React from 'react';
import { Button, Typography } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Navigate } from 'react-router-dom';

const clientId = '305741284989-3mn8l3cl8bul185sdp5h3sn7sqqkd4ia.apps.googleusercontent.com';

export default function Login() {
  const auth = getAuth();
  // const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    const {
      user: { uid, displayName },
    } = await signInWithPopup(auth, provider);


    console.log({ user });
  };

  if (localStorage.getItem('accessToken')) {
    return <Navigate to="/" />
  }

  return (
    <>
      <Typography variant='h5' sx={{ marginBottom: '10px' }}>
        Welcome
      </Typography>
      <Button variant='outlined' onClick={handleLoginWithGoogle}>
        Login with Google
      </Button>
    </>
  );
}
