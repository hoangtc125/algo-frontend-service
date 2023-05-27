import { Box, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { get } from '../../utils/request';
import { errorNotification, infoNotification, successNotification } from '../../utils/notification';

const validate = values => {
    const errors = {};
    if (!values.username) {
        errors.username = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)) {
        errors.username = 'Invalid email address';
    }
    return errors;
};

const ForgotPassword = () => {
    const formik = useFormik({
        initialValues: {
            username: '',
        },
        validate,
        onSubmit: async (values) => {
            infoNotification("Wait a second", "Your action has been processed", "bottomRight")
            const data = await get(`/account/reset-password?email=${values.username}`)
            if (data?.status_code == 200) {
                successNotification("Check your email", "A link to reset password has been sent", "bottomRight")
            } else {
                errorNotification(data.status_code, data.msg, "bottomRight")
            }
        },
    });

    return (
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
                label="Email Address"
                name='username'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
                <div className='text-red-600'>{formik.errors.username}</div>
            ) : null}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                className='text-lg sm:text-sm'
            >
                Submit
            </Button>
        </Box>
    );
}

export default ForgotPassword;
