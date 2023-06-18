import { Button, Box, TextField, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { post, put } from '../../utils/request';
import { errorNotification, infoNotification, successNotification } from '../../utils/notification';
import MapPicker from '../map/MapPicker';
import mapSlice from '../map/mapSlice';
import { CLUB_TYPE } from '../../utils/constant';
import { clubInfoSelector, positionSelector } from '../../redux/selectors';
import { useNavigate, useParams } from 'react-router-dom';

const validate = values => {
    const errors = {};

    if (!values.name) {
        errors.name = 'Không được để trống';
    } else if (values.name.length > 200) {
        errors.name = 'Tối đa 200 ký tự hoặc ít hơn';
    }

    if (!values.email) {
        errors.email = 'Không được để trống';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Email không hợp lệ';
    }

    if (!values.nickname) {
        errors.nickname = 'Không được để trống';
    } else if (values.nickname.length > 200) {
        errors.nickname = 'Tối đa 200 ký tự hoặc ít hơn';
    }

    if (!values.address) {
        errors.address = 'Không được để trống';
    } else if (values.address.length > 200) {
        errors.address = 'Tối đa 200 ký tự hoặc ít hơn';
    }

    if (!values.slogan) {
        errors.slogan = 'Không được để trống';
    } else if (values.slogan.length > 200) {
        errors.slogan = 'Tối đa 200 ký tự hoặc ít hơn';
    }

    if (!values.description) {
        errors.description = 'Không được để trống';
    } else if (values.description.length > 200) {
        errors.description = 'Tối đa 200 ký tự hoặc ít hơn';
    }

    if (!values.type) {
        errors.type = 'Không được để trống';
    } else if (values.type.length > 200) {
        errors.type = 'Tối đa 200 ký tự hoặc ít hơn';
    }

    return errors;
};

export default function CreateInfo() {
    const dispatch = useDispatch()
    const clubInfo = useSelector(clubInfoSelector)
    const position = useSelector(positionSelector)
    const navigate = useNavigate()
    const { clubId } = useParams()

    useEffect(() => {
        dispatch(mapSlice.actions.setEdit(true))
        return () => {
            dispatch(mapSlice.actions.setEdit(false))
        }
    }, [])

    const formik = useFormik({
        initialValues: {
            name: clubInfo?.name || "",
            email: clubInfo?.email || "",
            nickname: clubInfo?.nickname || "",
            address: clubInfo?.address || "",
            slogan: clubInfo?.slogan || "",
            description: clubInfo?.description || "",
            type: clubInfo?.type || "",
        },
        validate,
        onSubmit: async (values) => {
            infoNotification("Đợi giây lát", "Yêu cầu đang được xử lý", "bottomRight")
            const data = await put(`/club/update?club_id=${clubId}`, { ...values, addressPosition: position })
            if (data?.status_code == 200) {
                successNotification("Thao tác thành công", "", "bottomRight")
                navigate(`/algo-frontend-service/club/${clubId}`)
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
        >
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
                    label="Tên"
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                    <div className="text-red-600">{formik.errors.name}</div>
                ) : null}

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Địa chỉ Email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-600">{formik.errors.email}</div>
                ) : null}

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Tên viết tắt"
                    name="nickname"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.nickname}
                />
                {formik.touched.nickname && formik.errors.nickname ? (
                    <div className="text-red-600">{formik.errors.nickname}</div>
                ) : null}

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Địa chỉ"
                    name="address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                />
                {formik.touched.address && formik.errors.address ? (
                    <div className="text-red-600">{formik.errors.address}</div>
                ) : null}
                <MapPicker />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Slogan"
                    name="slogan"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.slogan}
                />
                {formik.touched.slogan && formik.errors.slogan ? (
                    <div className="text-red-600">{formik.errors.slogan}</div>
                ) : null}

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    multiline
                    label="Mô tả"
                    name="description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                />
                {formik.touched.description && formik.errors.description ? (
                    <div className="text-red-600">{formik.errors.description}</div>
                ) : null}

                <Box className="w-full mt-3">
                    <FormControl fullWidth>
                        <InputLabel id="cllub-type-label">Loại</InputLabel>
                        <Select
                            labelId="cllub-type-label"
                            id="club-type"
                            label="Loại"
                            name="type"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.type}
                        >
                            {Object.keys(CLUB_TYPE).map(opt => (
                                <MenuItem key={opt} value={opt}>
                                    {CLUB_TYPE[opt]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                {formik.touched.type && formik.errors.type ? (
                    <div className="text-red-600">{formik.errors.type}</div>
                ) : null}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    className='text-lg sm:text-sm'
                >
                    Cập nhật
                </Button>
            </Box>
        </Box>
    );
}
