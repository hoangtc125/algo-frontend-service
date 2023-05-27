import { Box, Grid, Typography, List, ListItem, Button, TextField, Slider, Switch } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Image } from 'antd';
import React from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

import { ipSelector } from '../../redux/selectors';
import { validateIP } from '../../utils/validIP'
import cameraSlice from './cameraSlice';
import { useEffect } from 'react';
import { IMAGE } from '../../utils/constant';
import { get_webcam } from '../../utils/request'

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
    const ip = useSelector(ipSelector)
    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
            ip: ip || "",
        },
        validate,
        onSubmit: (values) => {
            dispatch(cameraSlice.actions.changeIP(values.ip))
        },
    });

    useEffect(() => {
        const setUpCamera = async () => {
            await get_webcam(`http://${ip}:8080/settings/video_size?set=1280x720`)
            await get_webcam(`http://${ip}:8080/settings/photo_size?set=1280x720`)
        }
        setUpCamera()
    }, [])

    useEffect(() => {
        const connectInterval = setInterval(() => {
            document.getElementById("ip-webcam").firstChild.src = "http://${ip}:8080/shot.jpg"
            document.getElementById("ip-webcam").firstChild.src = `http://${ip}:8080/video`
        }, 10000);

        return () => {
            clearInterval(connectInterval)
        }
    }, [ip])

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
                    <List className='w-full flex flex-col items-center space-y-5'>
                        <Image
                            id='ip-webcam'
                            preview={false}
                            src={`http://${ip}:8080/video`}
                            className='max-w-full max-h-96 shadow-md'
                            onError={() => {
                                document.getElementById("ip-webcam").firstChild.src = IMAGE
                            }}
                        />
                        <Button variant="contained" startIcon={<CameraAltIcon />} className='w-fit'>Shoot</Button>
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
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className='text-lg sm:text-sm'
                                >
                                    Connect
                                </Button>
                            </Box>
                        </ListItem>
                    </List>
                    <List className='w-full flex flex-col items-center'>
                        <ListItem className='w-full space-x-5'>
                            <Typography>Zoom</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
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
