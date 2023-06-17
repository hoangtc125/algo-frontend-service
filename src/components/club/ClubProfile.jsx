import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Image, Modal, Tag, List as Listantd } from 'antd';
import { Avatar, AvatarGroup, Box, Button, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import LoginIcon from '@mui/icons-material/Login';
import { useSelector } from 'react-redux';

import { errorNotification } from '../../utils/notification';
import CLUB from '../../assets/images/club.jpg'
import WALL from '../../assets/images/club/wall.png'
import { del, get, post } from '../../utils/request';
import { CLUB_TYPE, COLOR_REAL } from '../../utils/constant';
import { accountSelector } from '../../redux/selectors';
import LoginPage from '../../pages/auth/LoginPage';
import UserList from './UserList';

const ClubProfile = ({ rawData }) => {
    const account = useSelector(accountSelector)
    const { clubId } = useParams()
    const [data, setData] = useState(rawData || {})
    const [isModalOpen, setIsModalOpen] = useState(false);

    const members = data?.groups ? data.groups.reduce((total, group) => [...total, ...group.members.map(e => ({...e.user, ...e}))], []) : []
    const followers = (data?.followers || []).map(e => e.user)
    const isFollow = followers.find(e => e.id == account?.id) ? true : false

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
        if (account?.id) {
            setIsModalOpen(false)
        }
    }, [account])

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


    const handleViewGroup = (group) => {
        Modal.info({
            title: group.name,
            className: "min-w-[70vw] max-w-[80vw]",
            centered: true,
            content: (
                <Box className="w-full max-h-[60vh] overflow-auto flex flex-col items-center justify-center space-y-2">
                    <Typography variant='h6'>{group.name}</Typography>
                    <Typography variant='body1'>{group.description}</Typography>
                    <Card title={`Danh sách thành viên (${group.members.length})`} className='w-full'>
                        <UserList data={group.members.map(e => e.user)} />
                    </Card>
                </Box>
            ),
            onOk() { },
            onCancel() { },
        });
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
                <Box className="w-full flex flex-col xl:flex-row items-center justify-between space-x-4">
                    <Box className="w-full flex-1"></Box>
                    <Box className="w-full flex-1 flex justify-center items-center">
                        <AvatarGroup max={4}>
                            {
                                (data?.followers || []).map((e, idx) => (
                                    <Avatar key={idx} alt={e.user.name} src={e.user.photo_url} />
                                ))
                            }
                        </AvatarGroup>
                        <Button type='secondary' color='success' startIcon={<StarIcon />}
                            onClick={() => {
                                Modal.info({
                                    title: "Quan tâm",
                                    className: "min-w-[70vw] max-w-[80vw]",
                                    centered: true,
                                    content: (
                                        <Box className="w-full max-h-[60vh] overflow-auto">
                                            <UserList data={followers} />
                                        </Box>
                                    ),
                                    onOk() { },
                                    onCancel() { },
                                });
                            }}
                        >
                            Đang quan tâm
                        </Button>
                    </Box>
                    <Box className="w-full flex-1 text-center xl:text-end space-x-2">
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
            <Card title="Giới thiệu" bordered={false}
                className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
            >
                <List className='w-full grid grid-cols-1 sm:grid-cols-2'>
                    <ListItem className=''>
                        {CLUB_TYPE[data?.type]}
                    </ListItem>
                    <ListItem className=''>
                        <ListItemText primary="Mô tả" secondary={data?.description} />
                    </ListItem>
                    <ListItem className=''>
                        <ListItemText primary="Địa chỉ Email" secondary={data?.email} />
                    </ListItem>
                    <ListItem className=''>
                        <ListItemText primary="Địa chỉ" secondary={data?.address} />
                    </ListItem>
                    <ListItem className=''>
                        <ListItemText primary="Slogan" secondary={data?.slogan} />
                    </ListItem>
                    <ListItem className=''>
                        <ListItemText primary="Thành viên" secondary={members?.length} />
                    </ListItem>
                </List>
            </Card>
            <Card title="Cơ cấu tổ chức" bordered={false}
                className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
            >
                <Grid container spacing={2}>
                    {
                        (data?.groups || []).map((group, idx) => (
                            <Grid item xs={12} md={6}
                                key={idx}
                            >
                                <Tag
                                    color={COLOR_REAL[idx % COLOR_REAL.length]}
                                    className='w-full rounded-lg'
                                    onClick={() => { handleViewGroup(group) }}
                                >
                                    <Card hoverable
                                        bordered={true}
                                        className='hover:cursor-pointer'
                                        title={
                                            <Typography className='text-base lg:text-2xl'>{group.name}</Typography>
                                        }
                                        extra={
                                            <Typography>{`${group.members.length} thành viên`}</Typography>
                                        }
                                    >
                                        <Card.Meta
                                            description={
                                                <Typography className='text-sm lg:text-base'>{group.description}</Typography>
                                            }
                                        />
                                    </Card>
                                </Tag>
                            </Grid>
                        ))
                    }
                </Grid>
            </Card>
            <Card title={`Danh sách thành viên (${members.length})`} bordered={false}
                className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
            >
                <Box className="w-full items-center max-h-[60vh] overflow-auto">
                    <UserList data={members} />
                </Box>
            </Card>
            <Card title={`Người theo dõi ${followers.length}`} bordered={false}
                className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
            >
                <Box className="w-full items-center max-h-[60vh] overflow-auto">
                    <UserList data={followers} />
                </Box>
            </Card>
            <Modal centered width={1500} open={isModalOpen} onOk={handleOk} onCancel={handleOk} destroyOnClose={true}>
                <LoginPage />
            </Modal>
        </Box>
    );
}

export default ClubProfile;
