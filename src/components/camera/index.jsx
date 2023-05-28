import { Box, Grid, Typography, List, ListItem, Button, TextField, Slider, Switch } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { Image, Space } from 'antd';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { v4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';

import { cameraLoadingSelector, ipSelector, singleSelector } from '../../redux/selectors';
import { validateIP } from '../../utils/validIP'
import cameraSlice from './cameraSlice';
import { IMAGE } from '../../utils/constant';
import { get_webcam } from '../../utils/request'
import { errorNotification } from '../../utils/notification'

const validate = values => {
    const errors = {};
    if (!values.ip) {
        errors.ip = 'Required';
    } else if (!validateIP(values.ip)) {
        errors.ip = 'IP Invalid';
    }
    return errors;
};

const Camera = () => {
    const dispatch = useDispatch()
    const ip = useSelector(ipSelector)
    const loading = useSelector(cameraLoadingSelector)
    const single = useSelector(singleSelector)
    const [image, setImage] = useState()

    const setUpCamera = async () => {
        dispatch(cameraSlice.actions.setLoading(true))
        document.getElementById("ip-webcam").firstChild.src = IMAGE
        try {
            const res = await get_webcam(`http://${ip}:8080/status.json?show_avail=1`)
            const data = await res.json();
            if (data?.curvals?.video_size != "1280x720") {
                await get_webcam(`http://${ip}:8080/settings/video_size?set=1280x720`)
            }
            if (data?.curvals?.photo_size != "1280x720") {
                await get_webcam(`http://${ip}:8080/settings/photo_size?set=1280x720`)
            }
            if (data?.curvals?.ffc != "off") {
                await get_webcam(`http://${ip}:8080/settings/ffc?set=off`)
            }
            document.getElementById("ip-webcam").firstChild.src = `http://${ip}:8080/video`
        } catch {
            errorNotification("Camera Error", "Make sure start server IP Webcam", "bottomRight")
        } finally {
            dispatch(cameraSlice.actions.setLoading(false))
        }
    }

    const formik = useFormik({
        initialValues: {
            ip: ip || "",
        },
        validate,
        onSubmit: async (values) => {
            dispatch(cameraSlice.actions.changeIP(values.ip))
            if (image) {
                setImage()
            }
            await setUpCamera()
        },
    });

    const handleTakePhoto = async () => {
        dispatch(cameraSlice.actions.setLoading(true))
        document.getElementById("ip-webcam").firstChild.src = `http://${ip}:8080/photo.jpg`
        try {
            const data = await fetch(`http://${ip}:8080/photo.jpg`);
            const blob = await data.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                document.getElementById("ip-webcam").firstChild.src = base64data
                const uuid = v4()
                setImage(
                    {
                        uid: uuid,
                        name: `${uuid}.png`,
                        status: 'done',
                        url: base64data,
                        type: "image/jpeg",
                    }
                )
            }
        } catch { } finally {
            dispatch(cameraSlice.actions.setLoading(false))
        }
    }

    const handleContinue = () => {
        document.getElementById("ip-webcam").firstChild.src = `http://${ip}:8080/video`
        setImage()
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
            className="p-0 sm:p-4"
        >
            <Grid container>
                <Grid item xs={12} md={8}>
                    <List className='w-full h-full flex flex-col items-center space-y-5 justify-end'>
                        <Image
                            id='ip-webcam'
                            preview={false}
                            src={`http://${ip}:8080/video`}
                            className='max-w-full max-h-[50vh] shadow-md'
                            onError={() => {
                                document.getElementById("ip-webcam").firstChild.src = IMAGE
                            }}
                        />
                        {
                            image
                                ?
                                <Space size={20}>
                                    <LoadingButton loading={loading} loadingPosition='start' variant="contained" startIcon={<DeleteIcon />} color="error" className='w-28' onClick={() => { handleContinue() }}>Remove</LoadingButton>
                                    <LoadingButton loading={loading} loadingPosition='start' variant="contained" startIcon={<SendIcon />} color="success" className='w-28' onClick={() => {
                                        if (single) {
                                            dispatch(cameraSlice.actions.addSingleImage(image))
                                        } else {
                                            dispatch(cameraSlice.actions.addImage(image))
                                        }
                                        handleContinue()
                                    }}>Take</LoadingButton>
                                </Space>
                                :
                                <LoadingButton
                                    loading={loading}
                                    onClick={handleTakePhoto}
                                    loadingPosition="start"
                                    className='w-28'
                                    startIcon={<CameraAltIcon />}
                                    variant="contained"
                                >
                                    Shoot
                                </LoadingButton>
                        }
                    </List>
                </Grid>
                <Grid item xs={12} md={4}>
                    <List className='w-full flex flex-col'>
                        <ListItem>
                            <Box
                                component="form"
                                noValidate
                                onSubmit={formik.handleSubmit}
                                className='w-full space-y-4'
                            >
                                <div>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="IP Address"
                                        type="text"
                                        name='ip'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.ip}
                                    />
                                    {formik.touched.ip && formik.errors.ip ? (
                                        <div className='text-red-600'>{formik.errors.ip}</div>
                                    ) : null}
                                </div>
                                <div className='flex space-x-2 items-end'>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        className='text-lg sm:text-sm'
                                    >
                                        Connect
                                    </Button>
                                    <Typography variant='body2'>Press again if loss connection</Typography>
                                </div>
                            </Box>
                        </ListItem>
                    </List>
                    <List className='w-full flex flex-col items-center'>
                        <ListItem className='w-full space-x-5 mt-4'>
                            <Typography>Zoom</Typography>
                            <Slider
                                defaultValue={0}
                                step={10}
                                marks
                                min={0}
                                max={100}
                                valueLabelDisplay="on"
                                onChange={async (e, value) => {
                                    await get_webcam(`http://${ip}:8080/ptz?zoom=${value}`)
                                }}
                            />
                        </ListItem>
                        <ListItem className='w-full space-x-5'>
                            <Typography>Front Camera</Typography>
                            <Switch onChange={async (e) => {
                                await get_webcam(`http://${ip}:8080/settings/ffc?set=${e.target.checked ? "on" : "off"}`)
                            }} />
                        </ListItem>
                        <ListItem className='w-full space-x-5'>
                            <Typography>Orientation</Typography>
                            <Switch onChange={async (e) => {
                                await get_webcam(`http://${ip}:8080/settings/orientation?set=${e.target.checked ? "portrait" : "landscape"}`)
                            }} />
                        </ListItem>
                        <ListItem className='w-full space-x-5'>
                            <Typography>Hold Focus</Typography>
                            <Switch onChange={async (e) => {
                                await get_webcam(`http://${ip}:8080/${e.target.checked ? "focus" : "nofocus"}`)
                            }} />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Camera;
