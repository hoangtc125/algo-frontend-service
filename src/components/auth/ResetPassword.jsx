import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { openNotification } from '../../utils/notification';
import { post } from '../../utils/request';

const validate = values => {
    const errors = {};
    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length > 15) {
        errors.password = 'Must be 15 characters or less';
    }

    if (!values.repassword) {
        errors.repassword = 'Required';
    } else if (values.repassword != values.password) {
        errors.repassword = 'Not match password';
    }
    return errors;
};

const ResetPassword = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    
    const formik = useFormik({
        initialValues: {
            password: '',
            repassword: '',
        },
        validate,
        onSubmit: async (values) => {
            openNotification("Wait a second", "Your action has been processed", "bottomRight")
            const data = await post("/account/reset-password", {
                token: token,
                password: values.password,
            })
            if (data?.status_code == 200) {
                openNotification("Reset Successfull", "Please login with new password", "bottomRight")
            } else {
                openNotification(data.status_code, data.msg, "bottomRight")
            }
        },
    });

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
                Reset Password
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
                    label="New Password"
                    type="password"
                    name='password'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className='text-red-600'>{formik.errors.password}</div>
                ) : null}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Repeat Password"
                    type="password"
                    name='repassword'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                />
                {formik.touched.repassword && formik.errors.repassword ? (
                    <div className='text-red-600'>{formik.errors.repassword}</div>
                ) : null}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    className='text-lg sm:text-sm'
                >
                    Update
                </Button>
                <Grid container>
                    <Grid item>
                        <Link to="/login" variant="body2" className='underline'>
                            Have an account? Sign In
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default ResetPassword;
