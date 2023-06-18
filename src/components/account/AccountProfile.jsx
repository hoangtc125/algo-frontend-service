import { Typography, Avatar, List, ListItem, ListItemText, Box, Grid, Badge, Chip, Button } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, Divider, Empty, Image, Tag } from 'antd';
import moment from 'moment';

import { getProviderIcon } from '../../utils/kind';
import { get } from '../../utils/request';
import { errorNotification } from '../../utils/notification';
import { CLUB_ROLE, MEMBERSHIP_STATUS } from '../../utils/constant';
import CLUB1 from '../../assets/images/club/club1.png'
import CLUB2 from '../../assets/images/club/club2.png'
import CLUB3 from '../../assets/images/club/club3.png'
import CLUB4 from '../../assets/images/club/club4.png'
import CLUB5 from '../../assets/images/club/club5.png'
import { useSelector } from 'react-redux';
import { accountSelector } from '../../redux/selectors';
const CLUB = [CLUB1, CLUB2, CLUB3, CLUB4, CLUB5]

const AccountProfile = () => {
    const { account_id } = useParams()
    const navigate = useNavigate()
    const [account, setAccount] = useState({})
    const [member, setMember] = useState([])
    const [follow, setFollow] = useState([])
    const sAccount = useSelector(accountSelector)
    const isYou = account_id == sAccount?.id

    console.log("re-render");

    useEffect(() => {
        const getAccount = async () => {
            const data = await get(`/account/get?id=${account_id}`)
            if (data?.status_code == 200) {
                setAccount(data?.data.account)
                setMember(data?.data.member)
                setFollow(data?.data.follow)
            } else {
                errorNotification(data?.status_code, data?.msg, "bottomRight")
            }
        }

        if (localStorage.getItem("guest")) {
            const data = JSON.parse(localStorage.getItem("account"))
            setAccount(data?.account)
            setMember(data?.member || [])
            setFollow(data?.follow || [])
        } else {
            getAccount()
        }
    }, [account_id])

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
            className="p-0 sm:p-4 space-y-4"
        >

            <Card title="Thông tin cá nhân" bordered={false}
                className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Box className="flex flex-col items-center space-y-1 sm:space-y-3">
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    account?.verify?.status ? <VerifiedIcon className='bg-white rounded-full' fontSize="large" color="primary" /> : <></>
                                }
                            >
                                <Avatar
                                    alt='avatar'
                                    src={account?.photo_url}
                                    className='!w-24 !h-24 sm:!w-52 sm:!h-52'
                                />
                            </Badge>
                            <Typography variant="h6">{account?.name}</Typography>
                            <Typography variant="subtitle1">{account?.email}</Typography>
                            <Typography variant="subtitle1">{getProviderIcon(account?.provider)}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} className='w-full'>
                        <List className='w-full grid grid-cols-1 sm:grid-cols-2'>
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
                            <ListItem>
                                <ListItemText primary="Email sinh viên" secondary={account?.verify?.detail?.email} />
                            </ListItem>
                            <ListItem>
                                {
                                    account?.verify?.status
                                        ?
                                        <Chip label="Đã xác thực" color="success" variant="outlined" />
                                        :
                                        <Chip label="Chưa xác thực" color="error" variant="outlined" />
                                }
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </Card>
            <Card title={
                <Box className="w-full flex items-end justify-between">
                    <span>Tham gia</span>
                    {isYou &&
                        <Button variant='contained'
                            onClick={() => {
                                navigate("/algo-frontend-service/club/create")
                            }}
                        >
                            Tạo CLB của tôi
                        </Button>
                    }
                </Box>
            } bordered={false}
                className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
            >
                <Box className="w-full flex flex-wrap items-center justify-start">
                    {
                        member.map((item, idx) => (
                            <Link
                                key={idx}
                                to={`/algo-frontend-service/club/${item?.club?.id}`}
                            >
                                <Card
                                    hoverable
                                    className='m-4 w-[300px] 2xl:w-[450px]'
                                    cover={
                                        <Box className='relative text-center border'>
                                            <Image
                                                src={item?.club?.avatar?.url}
                                                fallback={CLUB[idx % CLUB.length]}
                                                preview={false}
                                                className='opacity-70 object-contain !h-52 lg:!h-72 xl:!h-96 text-center p-1'
                                            />
                                            <Box
                                                className="absolute top-0 left-0 right-0 w-full h-full flex flex-col items-start justify-start whitespace-pre-line text-base xl:text-lg space-y-1 p-2 opacity-60 hover:opacity-100"
                                            >
                                                <Typography className='bg-slate-50 p-1 rounded-md'>
                                                    {`Vai trò của ${account.name}`}
                                                </Typography>
                                                <Typography className='bg-slate-50 p-1 rounded-md'>
                                                    {`Chức vụ: ${CLUB_ROLE[item?.member?.role]}`}
                                                </Typography>
                                                <Typography className='bg-slate-50 p-1 rounded-md'>
                                                    {`Trạng thái: `} <Tag bordered={false} color={MEMBERSHIP_STATUS[item?.member?.status]?.color}>{MEMBERSHIP_STATUS[item?.member?.status]?.label}</Tag>
                                                </Typography>
                                                <Typography className='bg-slate-50 p-1 rounded-md'>
                                                    {`Ngày tham gia: ${moment(item?.member?.created_at * 1000).format('DD-MM-YYYY')}`}
                                                </Typography>
                                                <Typography className='bg-slate-50 p-1 rounded-md'>
                                                    {`Thế hệ: ${item?.member?.gen || 1}`}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    }
                                >
                                    <Box className="w-full flex flex-col items-center justify-center space-y-1">
                                        <Box className="w-full flex flex-col text-center items-center justify-center whitespace-pre-line">
                                            <strong className='text-xl 2xl:text-3xl uppercase mb-1'>
                                                {item?.club?.nickname}
                                            </strong>
                                            <p className='text-base 2xl:text-2xl mb-1'>
                                                {item?.club?.name}
                                            </p>
                                        </Box>
                                    </Box>
                                </Card>
                            </Link>
                        ))
                    }
                    {
                        member.length == 0 &&
                        <Empty
                            description={
                                <span>
                                    Chưa tham gia CLB nào
                                </span>
                            }
                            className='w-full items-center text-center'
                        />
                    }
                </Box>
            </Card>
            <Card title="Theo dõi" bordered={false}
                className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
            >
                <Box className="w-full flex flex-wrap items-center justify-start">
                    {
                        follow.map((item, idx) => (
                            <Link
                                key={idx}
                                to={`/algo-frontend-service/club/${item?.club?.id}`}
                            >
                                <Card
                                    hoverable
                                    style={{ width: 250 }}
                                    className='m-2 w-[200px] 2xl:w-[300px]'
                                    cover={
                                        <Box className="w-full border items-center text-center">
                                            <Image
                                                src={item?.club?.avatar?.url}
                                                fallback={CLUB[idx % CLUB.length]}
                                                preview={false}
                                                className='opacity-70 object-contain !h-48 text-center p-1'
                                            />
                                        </Box>
                                    }
                                >
                                    <Box className="w-full flex flex-col items-center justify-center space-y-1">
                                        <Box className="w-full flex flex-col text-center items-center justify-center whitespace-pre-line">
                                            <strong className='text-base 2xl:text-xl uppercase mb-1'>
                                                {item?.club?.nickname}
                                            </strong>
                                            <p className='text-sm 2xl:text-base mb-1'>
                                                {item?.club?.name}
                                            </p>
                                        </Box>
                                        <Divider />
                                        <Box
                                            className="w-full flex flex-col items-start justify-start whitespace-pre-line opacity-70"
                                        >
                                            <p className='text-sm mb-0'>
                                                {`Ngày theo dõi: ${moment(item?.follow?.created_at * 1000).format('DD-MM-YYYY')}`}
                                            </p>
                                        </Box>
                                    </Box>
                                </Card>
                            </Link>
                        ))
                    }
                    {
                        follow.length == 0 &&
                        <Empty
                            description={
                                <span>
                                    Chưa theo dõi CLB nào
                                </span>
                            }
                            className='w-full items-center text-center'
                        />
                    }
                </Box>
            </Card>
        </Box>
    );
};

export default AccountProfile;
