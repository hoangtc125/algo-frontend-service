import React, { useContext } from 'react';
import { Button, Typography } from '@mui/material';
import { FacebookAuthProvider, GoogleAuthProvider, OAuthProvider, GithubAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { AuthContext } from '../context/AuthProvider';
import { Navigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import WindowSharpIcon from '@mui/icons-material/WindowSharp';
import GitHubIcon from '@mui/icons-material/GitHub';

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

  const handleLoginWithMicrosoft = async () => {
    const provider = new OAuthProvider('microsoft.com');
    const {
      user: { uid, displayName },
    } = await signInWithPopup(auth, provider);

    console.log({ user });
  };

  const handleLoginWithGithub = async () => {
    const provider = new GithubAuthProvider();
    const {
      user: { uid, displayName },
    } = await signInWithPopup(auth, provider);

    console.log({ user });
  };

  if (localStorage.getItem('accessToken')) {
    return <Navigate to="/" />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant='h5' sx={{ marginBottom: '10px' }}>
        Welcome
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button variant='outlined' sx={{ margin: '0 10px', flex: 1 }} onClick={handleLoginWithGoogle} startIcon={<GoogleIcon />}>
          Login with Google
        </Button>
        <Button variant='outlined' sx={{ margin: '0 10px', flex: 1 }} onClick={handleLoginWithMicrosoft} startIcon={<WindowSharpIcon />}>
          Login with Microsoft
        </Button>
        <Button variant='outlined' sx={{ margin: '0 10px', flex: 1 }} onClick={handleLoginWithFacebook} startIcon={<FacebookIcon />}>
          Login with Facebook
        </Button>
        <Button variant='outlined' sx={{ margin: '0 10px', flex: 1 }} onClick={handleLoginWithGithub} startIcon={<GitHubIcon />}>
          Login with Github
        </Button>
      </div>
    </div>
  );
}
