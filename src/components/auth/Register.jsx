import { Button, Typography, Box, Grid, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { post } from '../../utils/request';
import { errorNotification, infoNotification, successNotification } from '../../utils/notification';

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

    if (!values.name) {
        errors.name = 'Không được để trống';
    } else if (values.name.length > 100) {
        errors.name = 'Tối đa 100 ký tự hoặc ít hơn';
    }

    if (!values.email) {
        errors.email = 'Không được để trống';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Email không hợp lệ';
    }

    return errors;
};

export default function Register() {
    const formik = useFormik({
        initialValues: {
            password: '',
            repassword: '',
            email: '',
            name: '',
        },
        validate,
        onSubmit: async (values) => {
            infoNotification("Đợi giây lát", "Yêu cầu đang được xử lý", "bottomRight")
            const data = await post(`/account/register`, values)
            if (data?.status_code != 200) {
              errorNotification(data.status_code, data.msg, "bottomRight")
            } else {
                successNotification("Đăng ký thành công", "Kiểm tra Email đã đăng ký để kích hoạt tài khoản", "bottomRight")
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
                Đăng ký tài khoản Algo
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
                    label="Địa chỉ Email"
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
                    label="Tên hiện thị của bạn"
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
                    Đăng ký tài khoản
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
