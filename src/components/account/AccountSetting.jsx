import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { errorNotification, infoNotification, successNotification } from '../../utils/notification';
import { post } from '../../utils/request';

const validate = values => {
    const errors = {};
    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length > 15) {
        errors.password = 'Must be 15 characters or less';
    }

    if (!values.newpassword) {
        errors.newpassword = 'Required';
    } else if (values.newpassword.length > 15) {
        errors.newpassword = 'Must be 15 characters or less';
    }

    if (!values.repassword) {
        errors.repassword = 'Required';
    } else if (values.repassword != values.newpassword) {
        errors.repassword = 'Not match password';
    }
    return errors;
};

const AccountSetting = () => {
    
    const formik = useFormik({
        initialValues: {
            password: '',
            newpassword: '',
            repassword: '',
        },
        validate,
        onSubmit: async (values) => {
            infoNotification("Wait a second", "Your action has been processed", "bottomRight")
            const data = await post("/account/update-password", {
                password: values.password,
                newpassword: values.newpassword,
            })
            if (data?.status_code == 200) {
                successNotification("Update Successfull", "Your password has been updated", "bottomRight")
            } else {
                errorNotification(data.status_code, data.msg, "bottomRight")
            }
        },
    });

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
            className="p-0 sm:p-4"
        >
            <Typography component="h1" variant="h5">
                Update Password
            </Typography>
            <Box
                component="form"
                noValidate
                onSubmit={formik.handleSubmit}
                className='w-full sm:w-3/6'
                sx={{ mt: 1 }}
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Current Password"
                    type="password"
                    name='password'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className='text-red-600'>{formik.errors.password}</div>
                ) : null}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="New Password"
                    type="password"
                    name='newpassword'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newpassword}
                />
                {formik.touched.newpassword && formik.errors.newpassword ? (
                    <div className='text-red-600'>{formik.errors.newpassword}</div>
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
                    value={formik.values.repassword}
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
            </Box>
        </Box>
    );
}

export default AccountSetting;
