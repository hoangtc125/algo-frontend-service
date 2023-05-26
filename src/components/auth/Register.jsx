import { Button, Typography, Box, Grid, TextField } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { post } from '../../utils/request';
import { openNotification } from '../../utils/notification';

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

    if (!values.name) {
        errors.name = 'Required';
    } else if (values.name.length > 100) {
        errors.name = 'Must be 100 characters or less';
    }

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    return errors;
};

export default function Register() {
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            password: '',
            repassword: '',
            email: '',
            name: '',
        },
        validate,
        onSubmit: async (values) => {
            const data = await post(`/account/register`, values)
            if (data?.status_code != 200) {
              openNotification(data.status_code, data.msg, "bottomRight")
            } else {
                openNotification("Success", "Check your email to active account", "bottomRight")
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
                Register to Algo
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
                    label="Email Address"
                    name='email'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                    <div className='text-red-600'>{formik.errors.email}</div>
                ) : null}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Your Name"
                    name='name'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                    <div className='text-red-600'>{formik.errors.name}</div>
                ) : null}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
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
                    Sign Up
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
