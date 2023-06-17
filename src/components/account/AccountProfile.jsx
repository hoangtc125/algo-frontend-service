import { Typography, Avatar, List, ListItem, ListItemText, Box, Grid, Badge, Chip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, Divider, Empty, Image } from 'antd';
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
const CLUB = [CLUB1, CLUB2, CLUB3, CLUB4, CLUB5]

const AccountProfile = () => {
    const { account_id } = useParams()
    const [account, setAccount] = useState({})
    const [member, setMember] = useState([])
    const [follow, setFollow] = useState([])
    console.log("re-render");

    useEffect(() => {
        const getAccount = async () => {
            const url = account_id ? `/account/get?id=${account_id}` : "/account/me"
            const data = await get(url)
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
            <Card title="Tham gia" bordered={false}
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
                                    className='m-4 w-[300px] 2xl:w-[500px]'
                                    cover={
                                        <Box className='relative'>
                                            <Image
                                                src={item?.club?.image}
                                                fallback={CLUB[idx % CLUB.length]}
                                                preview={false}
                                                className='opacity-70'
                                            />
                                            <Box
                                                className="absolute top-2 left-2 right-2 w-fit flex flex-col items-start justify-start whitespace-pre-line text-base space-y-1 p-2 shadow-sm rounded-sm bg-slate-50 opacity-80"
                                            >
                                                <Typography variant='body2'>
                                                    {`Vai trò của ${account.name}`}
                                                </Typography>
                                                <Typography variant='body2'>
                                                    {`Chức vụ: ${CLUB_ROLE[item?.member?.role]}`}
                                                </Typography>
                                                <Typography variant='body2'>
                                                    {`Trạng thái: `}{MEMBERSHIP_STATUS[item?.member?.status]}
                                                </Typography>
                                                <Typography variant='body2'>
                                                    {`Ngày tham gia: ${moment(item?.member?.created_at * 1000).format('DD-MM-YYYY')}`}
                                                </Typography>
                                                <Typography variant='body2'>
                                                    {`Thế hệ: ${item?.member?.gen || 1}`}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    }
                                >
                                    <Box className="w-full flex flex-col items-center justify-center space-y-1">
                                        <Box className="w-full flex flex-col items-center justify-center whitespace-pre-line">
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
                                    className='m-2'
                                    cover={
                                        <Image
                                            src={item?.club?.image}
                                            fallback={CLUB[idx % CLUB.length]}
                                            preview={false}
                                            className='h-48'
                                        />
                                    }
                                >
                                    <Box className="w-full flex flex-col items-center justify-center space-y-1">
                                        <Box className="w-full flex flex-col items-center justify-center whitespace-pre-line">
                                            <strong className='text-xl 2xl:text-3xl uppercase mb-1'>
                                                {item?.club?.nickname}
                                            </strong>
                                            <p className='text-base 2xl:text-2xl mb-1'>
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
