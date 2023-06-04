import { Box, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { get } from '../../utils/request';
import { errorNotification, infoNotification, successNotification } from '../../utils/notification';

const validate = values => {
    const errors = {};
    if (!values.username) {
        errors.username = 'Không được để trống';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)) {
        errors.username = 'Email không hợp lệ';
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
            infoNotification("Đợi giây lát", "Yêu cầu đang được xử lý", "bottomRight")
            const data = await get(`/account/reset-password?email=${values.username}`)
            if (data?.status_code == 200) {
                successNotification("Kiểm tra Email sinh viên của bạn", "Đường link thay đổi mật khẩu đã đươc gửi", "bottomRight")
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
                label="Địa chỉ Email"
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
                Xác nhận
            </Button>
        </Box>
    );
}

export default ForgotPassword;
