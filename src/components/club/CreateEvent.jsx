import { Button, Box, TextField, FormControl, Select, InputLabel, MenuItem, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


import { post, put } from '../../utils/request';
import { errorNotification, infoNotification, successNotification } from '../../utils/notification';
import { CLUB_TYPE, EVENT_TYPE } from '../../utils/constant';
import { clubGroupsSelector, clubInfoSelector, positionSelector } from '../../redux/selectors';
import { useNavigate, useParams } from 'react-router-dom';
import clubSlice, { createEvent } from './clubSlice';

const validate = values => {
    const errors = {};

    if (!values.name) {
        errors.name = 'Không được để trống';
    } else if (values.name.length > 200) {
        errors.name = 'Tối đa 200 ký tự hoặc ít hơn';
    }

    if (!values.description) {
        errors.description = 'Không được để trống';
    } else if (values.description.length > 200) {
        errors.description = 'Tối đa 200 ký tự hoặc ít hơn';
    }

    if (!values.type) {
        errors.type = 'Không được để trống';
    }

    if (!values.group_id) {
        errors.group_id = 'Không được để trống';
    }

    return errors;
};

export default function CreateEvent() {
    const dispatch = useDispatch()
    const groups = useSelector(clubGroupsSelector)
    const clubInfo = useSelector(clubInfoSelector)
    const navigate = useNavigate()
    const { clubId } = useParams()

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            group_id: groups[0].id,
            start_time: 0,
            end_time: 0,
            type: "RECRUIT",
        },
        validate,
        onSubmit: async (values) => {
            infoNotification("Đợi giây lát", "Yêu cầu đang được xử lý", "bottomRight")
            dispatch(createEvent({...values, club_id: clubId}))
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
                        <InputLabel id="owner-label">Đơn vị tổ chức</InputLabel>
                        <Select
                            labelId="owner-label"
                            id="owner-type"
                            label="Đơn vị tổ chức"
                            name="group_id"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.group_id}
                        >
                            {groups.map(opt => (
                                <MenuItem key={opt.id} value={opt.id}>
                                    {opt.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                {formik.touched.group_id && formik.errors.group_id ? (
                    <div className="text-red-600">{formik.errors.group_id}</div>
                ) : null}

                <Box className="w-full mt-3">
                    <FormControl fullWidth>
                        <InputLabel id="event-type-label">Loại sự kiện</InputLabel>
                        <Select
                            labelId="event-type-label"
                            id="event-type-type"
                            label="Loại sự kiện"
                            name="type"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.type}
                        >
                            {Object.keys(EVENT_TYPE).map(opt => (
                                <MenuItem key={opt} value={opt}>
                                    {EVENT_TYPE[opt]}
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
                    Tạo mới
                </Button>
            </Box>
        </Box>
    );
}
