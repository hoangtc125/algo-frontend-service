import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { errorNotification, infoNotification, successNotification } from '../../utils/notification';
import { post } from '../../utils/request';

const validate = values => {
    const errors = {};
    if (!values.password) {
        errors.password = 'Không được để trống';
    } else if (values.password.length > 15) {
        errors.password = 'Tối đa 15 ký tự hoặc ít hơn';
    }

    if (!values.newpassword) {
        errors.newpassword = 'Không được để trống';
    } else if (values.newpassword.length > 15) {
        errors.newpassword = 'Tối đa 15 ký tự hoặc ít hơn';
    }

    if (!values.repassword) {
        errors.repassword = 'Không được để trống';
    } else if (values.repassword != values.newpassword) {
        errors.repassword = 'Không khớp với mật khẩu mới';
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
            infoNotification("Đợi giây lát", "Yêu cầu đang được xử lý", "bottomRight")
            const data = await post("/account/update-password", {
                password: values.password,
                newpassword: values.newpassword,
            })
            if (data?.status_code == 200) {
                successNotification("Cập nhật thành công", "Mật khẩu đã được thay đổi", "bottomRight")
            } else {
                errorNotification(data.status_code, data.msg, "bottomRight")
            }
        },
    });
    console.log("re-render");

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
                Cập nhật mật khẩu
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
                    label="Mật khẩu hiện tại"
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
                    label="Mật khẩu mới"
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
                    label="Nhập lại mật khẩu mới"
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
                    Thay đổi mật khẩu
                </Button>
            </Box>
        </Box>
    );
}

export default AccountSetting;
