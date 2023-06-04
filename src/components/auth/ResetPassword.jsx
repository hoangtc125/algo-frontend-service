import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { errorNotification, infoNotification, successNotification } from '../../utils/notification';
import { post } from '../../utils/request';

const validate = values => {
    const errors = {};
    if (!values.password) {
        errors.password = 'Không được để trống';
    } else if (values.password.length > 15) {
        errors.password = 'Tối đa 15 ký tự hoặc ít hơn';
    }

    if (!values.repassword) {
        errors.repassword = 'Không được để trống';
    } else if (values.repassword != values.password) {
        errors.repassword = 'Mật khẩu không khớp';
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
            infoNotification("Đợi giây lát", "Yêu cầu đang được xử lý", "bottomRight")
            const data = await post("/account/reset-password", {
                token: token,
                password: values.password,
            })
            if (data?.status_code == 200) {
                successNotification("Cập nhật thành công", "Hãy đăng nhập với mật khẩu mới", "bottomRight")
            } else {
                errorNotification(data.status_code, data.msg, "bottomRight")
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
                Đặt lại Mật khẩu
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
                    label="Mật khẩu mới"
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
                    label="Nhập lại Mật khẩu"
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
                    Cập nhật mật khẩu
                </Button>
                <Grid container>
                    <Grid item>
                        <Link to="/algo-frontend-service/login" variant="body2" className='underline'>
                            Đã có tài khoản? Đăng nhập
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default ResetPassword;
