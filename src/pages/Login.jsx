import React, { useContext } from 'react';
import { Button, Typography } from '@mui/material';
import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { AuthContext } from '../context/AuthProvider';
import { Navigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';

export default function Login() {
  const auth = getAuth();
  const { user } = useContext(AuthContext);

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    const {
      user: { uid, displayName },
    } = await signInWithPopup(auth, provider);

    console.log({ user });
  };

  const handleLoginWithFacebook = async () => {
    const provider = new FacebookAuthProvider();

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
      <Button variant='outlined' sx={{ marginLeft: '10px' }} onClick={handleLoginWithGoogle} startIcon={<GoogleIcon />}>
        Login with Google
      </Button>
      <Button variant='outlined' sx={{ marginLeft: '10px' }} onClick={handleLoginWithFacebook} startIcon={<FacebookIcon />}>
        Login with Facebook
      </Button>
    </>
  );
}
