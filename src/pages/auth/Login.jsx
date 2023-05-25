import { useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { FacebookAuthProvider, GoogleAuthProvider, OAuthProvider, GithubAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import WindowSharpIcon from '@mui/icons-material/WindowSharp';
import GitHubIcon from '@mui/icons-material/GitHub';

import appSlice, { loginFirebase, aboutMe } from '../../layouts/appSlice';
import { accountSelector, tokenSelector } from '../../redux/selectors';

export default function Login() {
  const auth = getAuth();
  const dispatch = useDispatch()
  const account = useSelector(accountSelector)
  const token = useSelector(tokenSelector)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      if (!token) {
        dispatch(appSlice.actions.addToken(localStorage.getItem("accessToken")))
      }
      if (!account) {
        dispatch(aboutMe())
      } else {
        navigate("/home")
      }
    }
  }, [token, account])

  const handleLoginFirebase = () => {
    const unsubcribed = auth.onIdTokenChanged(async (user) => {
      console.log('[From AuthProvider]', { user });
      if (user?.uid) {
        if (user.accessToken !== localStorage.getItem('accessToken')) {
          localStorage.setItem('accessToken', user.accessToken);
        }
        dispatch(loginFirebase(user.accessToken))
      }
    });
    unsubcribed()
  }

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      handleLoginFirebase()
    } catch(e) {
      console.log({e});
    }
  };

  const handleLoginWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      handleLoginFirebase()
    } catch(e) {
      console.log({e});
    }
  };

  const handleLoginWithMicrosoft = async () => {
    const provider = new OAuthProvider('microsoft.com');
    try {
      await signInWithPopup(auth, provider);
      handleLoginFirebase()
    } catch(e) {
      console.log({e});
    }
  };

  const handleLoginWithGithub = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      handleLoginFirebase()
    } catch(e) {
      console.log({e});
    }
  };

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
