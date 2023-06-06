import { Modal, Steps, Image, Anchor, Divider, Tour, FloatButton } from 'antd';
import { Box, Button, Chip, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import io from 'socket.io-client';

import { IMAGE } from '../../utils/constant';
import cameraSlice from '../camera/cameraSlice';
import Camera from '../camera';
import { accountSelector, imagesSelector } from '../../redux/selectors';
import ImagesReview from '../camera/imagesReview';
import { get, post } from '../../utils/request';
import { errorNotification, successNotification } from '../../utils/notification';
import { LoadingButton } from '@mui/lab';
import { aboutMe } from '../../layouts/appSlice';
import { STUDENT_CARD, CARD_LIST } from '../../utils/constant';
import HUST from '../../assets/images/hust.png'
import { QuestionCircleOutlined } from '@ant-design/icons';
import { env } from '../../utils/env'; 
import { HOST } from '../../utils/constant';

const AccountVerify = () => {
    const dispatch = useDispatch()
    const images = useSelector(imagesSelector)
    const account = useSelector(accountSelector)
    const [school, setSchool] = useState('HUST');
    const [card, setCard] = useState(HUST);
    const [current, setCurrent] = useState(0);
    const [loading, isLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [isTourOpen, setIsTourOpen] = useState(false);
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);
    const ref5 = useRef(null);
    console.log("re-render");

    const tourSteps = [
        {
            title: 'Chọn loại thẻ sinh viên của bạn',
            description: 'Nhân Đổi loại thẻ sinh viên để chọn các mấu thẻ mà hệ thống hỗ trợ xác thực',
            target: () => ref1.current,
        },
        {
            title: 'Tải lên ảnh thẻ sinh viên của bạn',
            description: 'Nhấn Đổi ảnh thẻ sinh viên để chụp hoặc tải ảnh từ thiết bị',
            target: () => ref2.current,
        },
        {
            title: 'Yêu cầu xác thực thẻ sinh viên',
            description: 'Hệ thống sẽ tự động nhận diện thông tin từ ảnh thẻ mà bạn đã đăng tải theo mẫu đã chọn',
            target: () => ref3.current,
        },
        {
            title: 'Kiểm tra thông tin nhận diện được',
            description: 'Hệ thống sẽ gửi email xác nhận đến Email sinh viên nhận diện được từ thẻ của bạn',
            target: () => ref4.current,
        },
        {
            title: 'Kết quả xác thực tài khoản',
            description: 'Sau khi bạn xác thực qua đường link gửi về Email sinh viên, Hệ thống sẽ hiện thị kết quả cuối cùng',
            target: () => ref5.current,
        },
    ];

    useEffect(() => {
        if (account?.verify?.status) {
            setCurrent(2)
        } else {
            if (account?.verify?.image) {
                setCurrent(1)
            } else {
                setCurrent(0)
            }
        }
        if (account?.verify?.type) {
            const card = CARD_LIST.find(s => s.key == account?.verify?.type).card
            setCard(card)
            setSchool(account?.verify?.type)
        }
        const getVerifyImage = async () => {
            if (account?.verify?.image) {
                try {
                    const data = await get(`/image/get?id=${account?.verify?.image}`)
                    if (data?.data) {
                        dispatch(cameraSlice.actions.addSingleImage(data?.data))
                    }
                } catch { }
            }
        }
        getVerifyImage()
    }, []);

    const handleVerifyCard = async () => {
        isLoading(true)
        try {
            const data = await post(`/account/verify?school=${school}`, images[0])
            if (data?.status_code == 200) {
                successNotification("Xác thực thẻ thành công, hãy kiểm tra lại thông tin nhận diện được", "Hệ thống đã gửi đường link xác thực tài khoản về email sinh viên nhận diện được từ ảnh thẻ của bạn", "bottomRight")
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
        if (localStorage.getItem("guest")) {
            return
        }
        const socket = io(`ws://${env()?.host || HOST}:8001?client_id=${account.id}`, { path: "/ws/socket.io", transports: ['websocket'] })
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

    const handleOkCard = () => {
        setIsCardOpen(false);
    };

    const steps = [
        {
            title: 'Xác thực Thẻ sinh viên',
        },
        {
            title: 'Xác thực Email sinh viên',
        },
        {
            title: 'Hoàn tất',
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
            <Steps current={current} items={items} className='mb-4' />
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <Box
                        className="flex sm:min-h-[60vh] flex-col justify-center items-center p-0 sm:p-4 space-y-2"
                    >
                        <div className="flex flex-col justify-center items-center">
                            <Image className='max-w-full' src={card} />
                            <Typography>{school}</Typography>
                        </div>
                        <Button ref={ref1} className='w-fit' variant="outlined" onClick={() => { setIsCardOpen(true) }}>
                            Đổi loại thẻ sinh viên
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box
                        className="flex sm:min-h-[60vh] flex-col justify-center items-center p-0 sm:p-4 space-y-2"
                    >
                        <Image
                            src={images[0]?.url || IMAGE}
                            className='max-w-full max-h-[50vh] shadow-md'
                        />
                        <Typography>Ảnh thẻ sinh viên của bạn</Typography>
                        <Button ref={ref2} className='w-fit' variant="outlined" onClick={handleUploadImage}>
                            Đổi ảnh thẻ sinh viên
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={3} className='w-full flex justify-center'>
                    <List className='w-full grid grid-cols-1 '>
                        <ListItem>
                            <ListItemText primary="Trường học" secondary={account?.verify?.detail?.school} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Chuyên ngành" secondary={account?.verify?.detail?.major} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Họ và tên" secondary={account?.verify?.detail?.fullname} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Ngày sinh" secondary={account?.verify?.detail?.birth} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Ngày hết hạn xác thực" secondary={account?.verify?.detail?.expired_card} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Mã số sinh viên" secondary={account?.verify?.detail?.number} />
                        </ListItem>
                        <ListItem ref={ref4}>
                            <ListItemText primary="Email sinh viên" secondary={account?.verify?.detail?.email} />
                        </ListItem>
                        <ListItem>
                            <Chip ref={ref5} label={account?.verify?.status ? "Đã xác thực" : "Chưa xác thực"} color={account?.verify?.status ? "success" : "error"} variant="outlined" />
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
                    ref={ref3}
                >
                    Xác thực thẻ sinh viên
                </LoadingButton>

                <Modal centered title="Cập nhật ảnh thẻ sinh viên" width={1000} open={isModalOpen} onOk={handleOk} onCancel={handleOk} destroyOnClose={true}>
                    <Typography variant="body2">
                        Chụp ảnh trực tiếp từ điện thoại
                    </Typography>
                    <Camera />
                    <Typography variant="body2">
                        Tải ảnh lên từ thiết bị này
                    </Typography>
                    <ImagesReview />
                </Modal>
                <Modal centered width={1250} open={isCardOpen} onOk={handleOkCard} onCancel={handleOkCard} destroyOnClose={true}>
                    <FormControl className='w-full flex flex-col justify-center items-center space-y-5'>
                        <FormLabel id="card-controlled-radio-buttons-group">Mẫu thẻ sinh viên</FormLabel>
                        <RadioGroup
                            aria-labelledby="card-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={school}
                            row
                            onChange={(e) => {
                                const card = CARD_LIST.find(s => s.key == e.target.value).card
                                setCard(card)
                                setSchool(e.target.value)
                            }}
                            className='w-full flex justify-start'
                        >
                            <Grid container>
                                <Grid item xs={12} md={3}>
                                    <Anchor
                                        className='w-fit p-4 lg:fixed bg-white'
                                        items={
                                            STUDENT_CARD.map(e => {
                                                return {
                                                    key: e.school,
                                                    href: `#${e.school}`,
                                                    title: e.school,
                                                }
                                            })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} md={9}>
                                    {
                                        STUDENT_CARD.map(e => (
                                            <div id={e.school} className='w-full flex flex-col space-y-3' key={e.school}>
                                                <Typography variant='h6'>{e.school}</Typography>
                                                <div className='flex justify-center w-full flex-wrap'>
                                                    {
                                                        e.cards.map(c => (
                                                            <FormControlLabel key={c.key} className="w-fit" labelPlacement="top" value={c.key} control={<Radio />} label={
                                                                <div className="flex flex-col justify-center items-center">
                                                                    <Image className='w-full' preview={false} src={c.card} />
                                                                    <Typography>{c.key}</Typography>
                                                                </div>
                                                            } />
                                                        ))
                                                    }
                                                </div>
                                                <Divider />
                                            </div>
                                        ))
                                    }
                                </Grid>
                            </Grid>
                        </RadioGroup>
                    </FormControl>
                </Modal>
                <Tour open={isTourOpen} onClose={() => setIsTourOpen(false)} steps={tourSteps} />
                <FloatButton
                    icon={<QuestionCircleOutlined />}
                    type="primary"
                    onClick={() => setIsTourOpen(true)}
                    tooltip="Guide"
                    className='left-0'
                />
            </div>
        </>
    );
};
export default AccountVerify;