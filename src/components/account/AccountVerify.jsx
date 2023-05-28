import { message, Modal, Steps, Image } from 'antd';
import { Box, Button, Chip, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';

import { IMAGE } from '../../utils/constant';
import cameraSlice from '../camera/cameraSlice';
import Camera from '../camera';
import { accountSelector, imagesSelector } from '../../redux/selectors';
import ImagesReview from '../camera/imagesReview';
import { post } from '../../utils/request';
import { errorNotification, successNotification } from '../../utils/notification';
import { LoadingButton } from '@mui/lab';
import { aboutMe } from '../../layouts/appSlice';

const AccountVerify = () => {
    const dispatch = useDispatch()
    const images = useSelector(imagesSelector)
    const account = useSelector(accountSelector)
    const [current, setCurrent] = useState(0);
    const [loading, isLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (account?.verify?.image?.url) {
            dispatch(cameraSlice.actions.addSingleImage(account?.verify?.image))
        }
        if (account?.verify?.status) {
            setCurrent(2)
        } else {
            setCurrent(1)
        }
    }, []);

    const handleVerifyCard = async () => {
        isLoading(true)
        try {
            const data = await post("/account/verify", images[0])
            if (data?.status_code == 200) {
                successNotification("Card has been verifed", "Check your student email to continue", "bottomRight")
                dispatch(aboutMe())
                setCurrent(1)
            } else {
                errorNotification(data.status_code, data.msg, "bottomRight")
            }
        } catch { } finally {
            isLoading(false)
        }
    }

    useEffect(() => {
        const socket = io(`ws://localhost:8001?client_id=${account.id}`, { path: "/ws/socket.io", transports: ['websocket'] })
        socket.on("verify", (message) => {
            dispatch(aboutMe())
            setCurrent(2)
        });

        return () => {
            socket.off("verify");
            socket.disconnect();
        };
    }, []);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const steps = [
        {
            title: 'Verify Card',
        },
        {
            title: 'Verify Student Email',
        },
        {
            title: 'Done',
        },
    ];

    const handleUploadImage = () => {
        dispatch(cameraSlice.actions.setSingle(true))
        setIsModalOpen(true);
    }

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    return (
        <>
            <Steps current={current} items={items} />
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Box
                        className="flex min-h-[60vh] flex-col justify-center items-center p-0 sm:p-4 space-y-5"
                    >
                        <Image
                            src={images[0]?.url || IMAGE}
                            className='max-w-full max-h-[50vh] shadow-md'
                        />
                        <Button className='w-fit' variant="outlined" onClick={handleUploadImage}>
                            Change Image
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4} className='w-full flex justify-center'>
                    <List className='w-full grid grid-cols-1 '>
                        <ListItem>
                            <ListItemText primary="School" secondary={account?.verify?.detail?.school} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Major" secondary={account?.verify?.detail?.major} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Full Name" secondary={account?.verify?.detail?.fullname} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Birth" secondary={account?.verify?.detail?.birth} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Expired Card" secondary={account?.verify?.detail?.expired_card} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Student Number" secondary={account?.verify?.detail?.number} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Student Email" secondary={account?.verify?.detail?.email} />
                        </ListItem>
                        <ListItem>
                            {
                                account?.verify?.status
                                    ?
                                    <Chip label="Verified" color="success" variant="outlined" />
                                    :
                                    <Chip label="No verify" color="error" variant="outlined" />
                            }
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
            <div
                className='mt-6 w-full items-center flex justify-center space-x-5'
            >
                <LoadingButton
                    loading={loading}
                    onClick={handleVerifyCard}
                    variant="contained"
                >
                    Verify Card
                </LoadingButton>

                <Modal centered title="Upload Student Card" width={1000} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okType='default' destroyOnClose={true}>
                    <Typography variant="body2">
                        Take a shoot
                    </Typography>
                    <Camera />
                    <Typography variant="body2">
                        Update from device
                    </Typography>
                    <ImagesReview />
                </Modal>
            </div>
        </>
    );
};
export default AccountVerify;