import { useEffect } from 'react';
import { Button, Typography, Box, Grid, TextField } from '@mui/material';
import { FacebookAuthProvider, GoogleAuthProvider, OAuthProvider, GithubAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import WindowSharpIcon from '@mui/icons-material/WindowSharp';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useFormik } from 'formik';
import { Modal } from 'antd';

import appSlice, { loginFirebase, aboutMe, login } from '../../layouts/appSlice';
import { accountSelector, tokenSelector } from '../../redux/selectors';
import { infoNotification, errorNotification } from '../../utils/notification';
import ForgotPassword from './ForgotPassword';


const validate = values => {
    const errors = {};

    if (!values.password) {
        errors.password = 'Không được để trống';
    } else if (values.password.length > 15) {
        errors.password = 'Tối đa 15 ký tự hoặc ít hơn';
    }

    if (!values.username) {
        errors.username = 'Không được để trống';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)) {
        errors.username = 'Email không hợp lệ';
    }

    return errors;
};

export default function Login() {
    const auth = getAuth();
    const dispatch = useDispatch()
    const account = useSelector(accountSelector)
    const token = useSelector(tokenSelector)
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            password: '',
            username: '',
        },
        validate,
        onSubmit: values => {
            infoNotification("Đợi giây lát", "Yêu cầu đang được xử lý", "bottomRight")
            dispatch(login(`grant_type=&username=${values.username}&password=${values.password}&scope=&client_id=&client_secret=`))
        },
    });
    console.log("re-render");

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            if (!token) {
                dispatch(appSlice.actions.addToken(localStorage.getItem("accessToken")))
            }
            if (!account) {
                dispatch(aboutMe())
            } else {
                navigate(localStorage.getItem("redirect") ||"/algo-frontend-service/home")
            }
        }
    }, [token, account])

    const handleForgotPassword = () => {
        Modal.info({
            closable: true,
            title: 'Đặt lại Mật khẩu',
            content: (
                <div className='pr-8'>
                    <p>Đường link đổi mật khẩu sẽ được gửi đến email tài khoản mà bạn đã đăng ký</p>
                    <ForgotPassword />
                </div>
            ),
            okText: "Cancel",
        });
    };

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
        } catch (e) {
            errorNotification("Email đã được sử dụng", "Hãy đăng nhập với phương thức khác", "bottomRight")
        }
    };

    const handleLoginWithFacebook = async () => {
        const provider = new FacebookAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            handleLoginFirebase()
        } catch (e) {
            errorNotification("Email đã được sử dụng", "Hãy đăng nhập với phương thức khác", "bottomRight")
        }
    };

    const handleLoginWithMicrosoft = async () => {
        const provider = new OAuthProvider('microsoft.com');
        try {
            await signInWithPopup(auth, provider);
            handleLoginFirebase()
        } catch (e) {
            errorNotification("Email đã được sử dụng", "Hãy đăng nhập với phương thức khác", "bottomRight")
        }
    };

    const handleLoginWithGithub = async () => {
        const provider = new GithubAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            handleLoginFirebase()
        } catch (e) {
            errorNotification("Email đã được sử dụng", "Hãy đăng nhập với phương thức khác", "bottomRight")
        }
    };

    return (
        <Box
            sx={{
                my: 16,
                mx: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography component="h1" variant="h5">
                Chào mừng bạn đến với Algo
            </Typography>
            <Box
                component="form"
                noValidate
                onSubmit={formik.handleSubmit}
                className='w-full'
                sx={{ mt: 1 }}
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    autoFocus={true}
                    label="Địa chỉ Email"
                    name='username'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                />
                {formik.touched.username && formik.errors.username ? (
                    <div className='text-red-600'>{formik.errors.username}</div>
                ) : null}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Mật khẩu"
                    type="password"
                    name='password'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className='text-red-600'>{formik.errors.password}</div>
                ) : null}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    className='text-lg sm:text-sm'
                >
                    Đăng nhập
                </Button>
                <Grid container>
                    <Grid item xs>
                        <Link href="#" variant="body2" className='underline' onClick={handleForgotPassword}>
                            Quên mật khẩu?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link to="/algo-frontend-service/register" variant="body2" className='underline'>
                            Chưa có tài khoản? Đăng ký ngay
                        </Link>
                    </Grid>
                </Grid>
                <Typography
                    component="h1"
                    variant="h5"
                    align="center"
                    className="center-text opacity-50 py-6"
                >
                    Hoặc
                </Typography>
                <Grid container spacing={{ xs: 1, md: 2 }}>
                    <Grid item xs={6} sm={6}>
                        <Button
                            variant="outlined"
                            sx={{ width: '100%', justifyContent: 'center' }}
                            onClick={handleLoginWithGoogle}
                            startIcon={<GoogleIcon />}
                        >
                            Google
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Button
                            variant="outlined"
                            sx={{ width: '100%', justifyContent: 'center' }}
                            onClick={handleLoginWithMicrosoft}
                            startIcon={<WindowSharpIcon />}
                        >
                            Microsoft
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Button
                            variant="outlined"
                            sx={{ width: '100%', justifyContent: 'center' }}
                            onClick={handleLoginWithFacebook}
                            startIcon={<FacebookIcon />}
                        >
                            Facebook
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Button
                            variant="outlined"
                            sx={{ width: '100%', justifyContent: 'center' }}
                            onClick={handleLoginWithGithub}
                            startIcon={<GitHubIcon />}
                        >
                            Github
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
