import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Modal, Tag } from 'antd';
import { Avatar, AvatarGroup, Badge, Box, Button, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LoginIcon from '@mui/icons-material/Login';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';

import { errorNotification, successNotification } from '../../utils/notification';
import CLUB from '../../assets/images/club.jpg'
import WALL from '../../assets/images/club/wall.png'
import { del, get, post, put } from '../../utils/request';
import { CLUB_TYPE, COLOR_REAL } from '../../utils/constant';
import { accountSelector, imagesSelector } from '../../redux/selectors';
import LoginPage from '../../pages/auth/LoginPage';
import UserList from './UserList';
import Camera from '../camera';
import ImagesReview from '../camera/imagesReview';
import cameraSlice from '../camera/cameraSlice';

const ClubProfile = ({ rawData }) => {
    const dispatch = useDispatch()
    const images = useSelector(imagesSelector)
    const account = useSelector(accountSelector)
    const { clubId } = useParams()
    const [data, setData] = useState(rawData || {})
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const members = useMemo(() => {
        if (data?.groups) {
            return data.groups.reduce((total, group) => [
                ...total,
                ...group.members.map(e => ({ ...e.user, member: { ...e } }))
            ], []);
        }
        return [];
    }, [data]);
    const followers = useMemo(() => (data?.followers || []).map(e => e.user), [data]);
    const isFollow = useMemo(() => followers.find(e => e.id == account?.id) ? true : false, [followers, account]);
    const accountMember = useMemo(() => members.find(e => e.id == account?.id)?.member, [members, account]);
    const accountGroup = useMemo(() => {
        if (data?.groups) {
            return data.groups.filter(e => accountMember.group_id.includes(e.id));
        }
        return [];
    }, [data, accountMember]);
    const isEdit = useMemo(() => accountGroup.find(e => e.is_remove == false && e.type == "PERMANANT") ? true : false, [accountGroup]);


    console.log("re-render");

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleOkCamera = async () => {
        if (images.length == 0) {
            errorNotification("Không có ảnh", "", "bottomRight")
            return
        }
        try {
            const res = await put(`/club/update?club_id=${clubId}`, {
                "image": images[0]?.url
            })
            if (res?.status_code == 200) {
                successNotification("Cập nhật thành công", "", "bottomRight")
                await getClub()
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch {
            errorNotification("Cập nhật thất bại", "", "bottomRight")
        } finally {
            setIsCameraOpen(false);
        }
    };

    const handleCancelCamera = () => {
        setIsCameraOpen(false);
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
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        isEdit ?
                            <div onClick={() => {
                                dispatch(cameraSlice.actions.setSingle(true))
                                setIsCameraOpen(true);
                            }}>
                                <CameraAltIcon className='bg-slate-100 rounded-full p-1 hover:cursor-pointer' fontSize="large" color="#ccc" />
                            </div>
                            : <></>
                    }
                >
                    <Avatar
                        alt='avatar'
                        src={(data?.image && data?.image != "string") ? data?.image : CLUB}
                        className='!w-24 !h-24 sm:!w-52 sm:!h-52 shadow-xl'
                    />
                </Badge>
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
                        {
                            !accountMember &&
                            <Button variant="outlined" startIcon={<LoginIcon />}>
                                Xin gia nhập
                            </Button>
                        }
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
            <Card title={
                <Box className="w-full items-center space-x-2 flex">
                    <Typography variant='h6'>Giới thiệu</Typography>
                    {
                        isEdit ?
                            <div onClick={() => { }}>
                                <EditIcon className='bg-slate-100 rounded-lg p-1 hover:cursor-pointer' fontSize="large" color="#ccc" />
                            </div>
                            : <></>
                    }
                </Box>
            } bordered={false}
                className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
            >
                <List className='w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'>
                    <ListItem className=''>
                        <ListItemText primary="Tên gọi" secondary={data?.name} />
                    </ListItem>
                    <ListItem className=''>
                        <ListItemText primary="Viết tắt" secondary={data?.nickname} />
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
                    <ListItem className=''>
                        {CLUB_TYPE[data?.type]}
                    </ListItem>
                </List>
            </Card>
            <Card title={
                <Box className="w-full items-center space-x-2 flex">
                    <Typography variant='h6'>Cơ cấu tổ chức</Typography>
                    {
                        isEdit ?
                            <div onClick={() => { }}>
                                <EditIcon className='bg-slate-100 rounded-lg p-1 hover:cursor-pointer' fontSize="large" color="#ccc" />
                            </div>
                            : <></>
                    }
                </Box>
            } bordered={false}
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
            <Card title={
                <Box className="w-full items-center space-x-2 flex">
                    <Typography variant='h6'>{`Danh sách thành viên (${members.length})`}</Typography>
                    {
                        isEdit ?
                            <div onClick={() => { }}>
                                <EditIcon className='bg-slate-100 rounded-lg p-1 hover:cursor-pointer' fontSize="large" color="#ccc" />
                            </div>
                            : <></>
                    }
                </Box>
            } bordered={false}
                className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
            >
                <Box className="w-full items-center max-h-[60vh] overflow-auto">
                    <UserList data={members} />
                </Box>
            </Card>
            <Card title={`Người theo dõi (${followers.length})`} bordered={false}
                className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
            >
                <Box className="w-full items-center max-h-[60vh] overflow-auto">
                    <UserList data={followers} />
                </Box>
            </Card>
            <Modal centered width={1500} open={isModalOpen} onOk={handleOk} onCancel={handleOk} destroyOnClose={true}>
                <LoginPage />
            </Modal>
            <Modal centered title="Cập nhật ảnh đại diện" width={1000} open={isCameraOpen} onOk={handleOkCamera} onCancel={handleCancelCamera} destroyOnClose={true}>
                <Typography variant="body2">
                    Chụp ảnh trực tiếp từ điện thoại
                </Typography>
                <Camera />
                <Typography variant="body2">
                    Tải ảnh lên từ thiết bị này
                </Typography>
                <ImagesReview />
            </Modal>
        </Box>
    );
}

export default ClubProfile;
