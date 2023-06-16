import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Image, Modal } from 'antd';
import { Avatar, AvatarGroup, Box, Button, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import LoginIcon from '@mui/icons-material/Login';
import { useSelector } from 'react-redux';

import { errorNotification } from '../../utils/notification';
import CLUB from '../../assets/images/club.jpg'
import WALL from '../../assets/images/club/wall.png'
import { del, get, post } from '../../utils/request';
import { CLUB_TYPE } from '../../utils/constant';
import { accountSelector } from '../../redux/selectors';
import Login from '../auth/Login';

const ClubProfile = ({ rawData }) => {
    const account = useSelector(accountSelector)
    const { clubId } = useParams()
    const [data, setData] = useState(rawData || {})
    const [isModalOpen, setIsModalOpen] = useState(false);

    const members = data?.groups ? data.groups.reduce((total, group) => [...total, ...group.members.map(e => e.user)], []) : []
    const isFollow = (data?.followers || []).find(e => e.user.id == account?.id) ? true : false

    console.log("re-render");

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const getClub = async () => {
        try {
            const res = await get(`/club/get?id=${clubId}`)
            if (res?.status_code == 200) {
                setData(res?.data)
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    }

    useEffect(() => {
        if (!rawData) {
            getClub()
        }
    }, [clubId])

    const handleFollow = async () => {
        if (!account?.id) {
            setIsModalOpen(true)
            localStorage.setItem("redirect", window.location.pathname)
        } else {
            const resp = await post(`/club/follow/create?club_id=${data.id}`)
            if (resp?.status_code == 200) {
                await getClub()
            } else {
                errorNotification(resp.status_code, resp.msg, "bottomRight")
            }
        }
    }

    const handleUnFollow = async () => {
        const resp = await del(`/club/follow/delete?club_id=${data.id}`)
        if (resp?.status_code == 200) {
            await getClub()
        } else {
            errorNotification(resp.status_code, resp.msg, "bottomRight")
        }
    }


    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
            className="p-0 sm:p-4 space-y-4"
        >
            <Box className="w-full flex flex-col items-center space-y-1 sm:space-y-3 p-4"
                style={{
                    backgroundImage: `url(${WALL})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Image
                    alt='avatar'
                    src={data?.photo_url}
                    fallback={CLUB}
                    className='!w-24 !h-24 sm:!w-52 sm:!h-52 rounded-full shadow-xl'
                />
                <Typography variant="h3" className='text-black uppercase'>{data?.name}</Typography>
                <Typography variant="h6" className='text-black uppercase'>{data?.nickname}</Typography>
                <Box className="w-full flex items-center justify-between space-x-4">
                    <Box className="w-full flex-1"></Box>
                    <Box className="w-full flex-1 flex justify-center items-center">
                        <AvatarGroup max={4}>
                            {
                                (data?.followers || []).map((e, idx) => (
                                    <Avatar key={idx} alt={e.user.name} src={e.user.photo_url} />
                                ))
                            }
                        </AvatarGroup>
                        <Button type='secondary' color='success' startIcon={<StarIcon />}>
                            Đang quan tâm
                        </Button>
                    </Box>
                    <Box className="w-full flex-1 text-end space-x-2">
                        <Button variant="outlined" startIcon={<LoginIcon />}>
                            Xin gia nhập
                        </Button>
                        {
                            isFollow ?
                                <Button variant="contained" color='error' startIcon={<StarBorderIcon />}
                                    onClick={handleUnFollow}
                                >
                                    Hủy quan tâm
                                </Button>
                                :
                                <Button variant="outlined" startIcon={<StarBorderIcon />}
                                    onClick={handleFollow}
                                >
                                    Quan tâm
                                </Button>
                        }
                    </Box>
                </Box>
            </Box>
            <Card title="Thông tin chung" bordered={false}
                className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <List className='w-full grid grid-cols-1 sm:grid-cols-2'>
                            <ListItem className='border'>
                                <ListItemText primary="Loại hình" secondary={CLUB_TYPE[data?.type]} />
                            </ListItem>
                            <ListItem className='border'>
                                <ListItemText primary="Mô tả" secondary={data?.description} />
                            </ListItem>
                            <ListItem className='border'>
                                <ListItemText primary="Địa chỉ Email" secondary={data?.email} />
                            </ListItem>
                            <ListItem className='border'>
                                <ListItemText primary="Địa chỉ" secondary={data?.address} />
                            </ListItem>
                            <ListItem className='border'>
                                <ListItemText primary="Slogan" secondary={data?.slogan} />
                            </ListItem>
                            <ListItem className='border'>
                                <ListItemText primary="Thành viên" secondary={members?.length} />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={6} className='w-full'>
                        <List className='w-full grid grid-cols-1 sm:grid-cols-2'>
                            <ListItem>
                                <ListItemText primary="Loại hình" secondary={CLUB_TYPE[data?.type]} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Mô tả" secondary={data?.description} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Địa chỉ Email" secondary={data?.email} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Địa chỉ" secondary={data?.address} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Slogan" secondary={data?.slogan} />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </Card>
            <Card title="Tham gia" bordered={false}
                className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
            >
            </Card>
            <Modal centered width={1000} open={isModalOpen} onOk={handleOk} onCancel={handleOk} destroyOnClose={true}>
                <Login />
            </Modal>
        </Box>
    );
}

export default ClubProfile;
