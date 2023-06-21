import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, Modal, Popconfirm, Tag, Tooltip } from 'antd';
import { Avatar, AvatarGroup, Badge, Box, Button, Chip, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
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
import UserListOrigin from './UserListOrigin';
import Camera from '../camera';
import ImagesReview from '../camera/imagesReview';
import cameraSlice from '../camera/cameraSlice';
import MapPicker from '../map/MapPicker';
import clubSlice from './clubSlice';
import mapSlice from '../map/mapSlice';

const ClubProfile = () => {
    const dispatch = useDispatch()
    const images = useSelector(imagesSelector)
    const account = useSelector(accountSelector)
    const { clubId } = useParams()
    const [data, setData] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const navigate = useNavigate()

    const members = useMemo(() => {
        if (data?.groups) {
            return data.groups.reduce((total, group) => [
                ...total,
                ...group.members
                    .filter(e => !total.map(t => t.id).includes(e.id))
                    .map(e => ({ ...e.user, member: { ...e, user: {} } }))
            ], []);
        }
        return [];
    }, [data]);
    const followers = useMemo(() => (data?.followers || []).map(e => e.user), [data]);
    const isFollow = useMemo(() => followers.find(e => e.id == account?.id) ? true : false, [followers, account]);
    const accountMember = useMemo(() => members.find(e => e.id == account?.id)?.member, [members, account]);
    const accountGroup = useMemo(() => {
        if (data?.groups && accountMember) {
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
                "image": images[0]
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
                dispatch(mapSlice.actions.setPosition(res?.data?.addressPosition))
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
                navigate("/algo-frontend-service/club")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
            navigate("/algo-frontend-service/club")
        }
    }

    useEffect(() => {
        if (account?.id) {
            setIsModalOpen(false)
        }
    }, [account])

    useEffect(() => {
        getClub()
    }, [clubId])

    useEffect(() => {
        dispatch(clubSlice.actions.setInfo({
            name: data?.name || "",
            email: data?.email || "",
            nickname: data?.nickname || "",
            address: data?.address || "",
            slogan: data?.slogan || "",
            description: data?.description || "",
            type: data?.type || "",
        }))
        dispatch(clubSlice.actions.setMember(members))
        dispatch(clubSlice.actions.setGroup((data?.groups || []).map(e => ({ ...e, members: [] }))))
    }, [data, members])

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

    const handleDelClub = async () => {
        const resp = await del(`/club/delete?club_id=${data.id}`)
        if (resp?.status_code == 200) {
            navigate("/algo-frontend-service/club")
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
                        <UserListOrigin data={group.members.map(e => e.user)} />
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
                                <CameraAltIcon className='bg-gray-200 rounded-full p-1 hover:cursor-pointer' fontSize="large" color="#ccc" />
                            </div>
                            : <></>
                    }
                >
                    <Avatar
                        alt='avatar'
                        src={data?.avatar?.url || CLUB}
                        className='!w-24 !h-24 sm:!w-52 sm:!h-52 shadow-xl border-4 border-white'
                    />
                </Badge>
                <p className='text-black uppercase text-3xl'>{data?.name}</p>
                <p className='text-black uppercase text-xl'>{data?.nickname}</p>
                <Box className="w-full flex flex-col xl:flex-row items-center justify-between space-x-4">
                    <Box className="w-full flex-1"></Box>
                    <Box className="w-full flex-1 flex justify-center items-center">
                        <AvatarGroup max={4}>
                            {
                                (data?.followers || []).map((e, idx) => (
                                    <Tooltip key={idx} placement='bottom' title={e.user.name}
                                        className='hover:cursor-pointer'
                                    >
                                        <Link to={`/algo-frontend-service/account/${e.user.id}`}>
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                badgeContent={
                                                    e.user?.verify?.status ? <VerifiedIcon className='bg-white rounded-full' fontSize="small" color="primary" /> : <></>
                                                }
                                            >
                                                <Avatar
                                                    alt={e.user.name} src={e.user.photo_url}
                                                    sx={{ marginLeft: '10px' }}
                                                />
                                            </Badge>
                                        </Link>
                                    </Tooltip>
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
                                            <UserListOrigin data={followers} />
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
                            !accountMember ?
                                <Button variant="outlined" startIcon={<LoginIcon />}>
                                    Xin gia nhập
                                </Button>
                                : <Chip color='success' variant='outlined' label="Đã tham gia" />
                        }
                        {
                            isFollow ?
                                <Popconfirm
                                    title="Hủy quan tâm?"
                                    onConfirm={handleUnFollow}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button variant="contained" color='error' startIcon={<StarBorderIcon />}>
                                        Hủy quan tâm
                                    </Button>
                                </Popconfirm>
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
                <Box className="w-full items-center space-x-2 flex justify-between">
                    <Box className="w-full items-center space-x-2 flex">

                        <Typography variant='h6'>Giới thiệu</Typography>
                        {
                            isEdit ?
                                <div onClick={() => {
                                    dispatch(mapSlice.actions.setPosition(data?.addressPosition))
                                    navigate(`/algo-frontend-service/club/${clubId}/edit`)
                                }}>
                                    <EditIcon className='bg-slate-100 rounded-lg p-1 hover:cursor-pointer' fontSize="large" color="#ccc" />
                                </div>
                                : <></>
                        }
                    </Box>
                    {
                        isEdit &&
                        <Popconfirm
                            title="Xóa CLB?"
                            onConfirm={handleDelClub}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button variant="contained" color='error' startIcon={<DeleteForeverIcon />}>
                                Xóa CLB
                            </Button>
                        </Popconfirm>
                    }
                </Box>
            } bordered={false}
                className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <MapPicker />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <List className='w-full grid grid-cols-1 xl:grid-cols-2'>
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
                                <Chip color='secondary' label={CLUB_TYPE[data?.type]} />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </Card>
            <Card title={
                <Box className="w-full items-center space-x-2 flex">
                    <Typography variant='h6'>Cơ cấu tổ chức</Typography>
                    {/* {
                        isEdit ?
                            <div onClick={() => { }}>
                                <EditIcon className='bg-slate-100 rounded-lg p-1' fontSize="large" color="#ccc" />
                            </div>
                            : <></>
                    } */}
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
                            <div onClick={() => {
                                navigate(`/algo-frontend-service/club/${clubId}/member`)
                            }}>
                                <EditIcon className='bg-slate-100 rounded-lg p-1 hover:cursor-pointer' fontSize="large" color="#ccc" />
                            </div>
                            : <></>
                    }
                </Box>
            } bordered={false}
                className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
            >
                <Box className="w-full items-center max-h-[60vh] overflow-auto">
                    <UserListOrigin data={members} />
                </Box>
            </Card>
            <Card title={<Typography variant='h6'>{`Người theo dõi (${followers.length})`}</Typography>} bordered={false}
                className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
            >
                <Box className="w-full items-center max-h-[60vh] overflow-auto">
                    <UserListOrigin data={followers} />
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
