import { Avatar, AvatarGroup, Badge, Box, Typography } from '@mui/material';
import { Card, Empty, Image, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';

import CLUB1 from '../../assets/images/club/club1.png'
import CLUB2 from '../../assets/images/club/club2.png'
import CLUB3 from '../../assets/images/club/club3.png'
import CLUB4 from '../../assets/images/club/club4.png'
import CLUB5 from '../../assets/images/club/club5.png'
const CLUB = [CLUB1, CLUB2, CLUB3, CLUB4, CLUB5]
import { get, post } from '../../utils/request';
import { errorNotification } from '../../utils/notification';
import { COLOR_REAL, PROCESS_STATUS } from '../../utils/constant';
import { accountSelector } from '../../redux/selectors';
import clubSlice from './clubSlice';

const ClubEventList = () => {
    const dispatch = useDispatch()
    const { clubId } = useParams()
    const account = useSelector(accountSelector)
    const [data, setData] = useState([])
    const navigate = useNavigate()

    console.log("re-render");

    const getEvent = async () => {
        try {
            const res = await post(`/recruit/event/get-all?page_size=20&orderby=created_at&sort=-1`, { club_id: clubId })
            if (res?.status_code == 200) {
                setData(res?.data)
                dispatch(clubSlice.actions.setEvents(res?.data))
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
        }
    }

    useEffect(() => {
        getEvent()
    }, [clubId])

    return (
        <Box className="w-full flex items-center max-h-[60vh] overflow-auto">
            {
                data.map((event, idx) => {
                    return (
                        <Card
                            hoverable
                            key={idx}
                            className='m-4 w-[250px] xl:w-[350px] hover:cursor-default'
                            cover={
                                <Box
                                    className='relative h-96 text-center border'
                                >
                                    <Box className="w-full h-full items-center text-center">
                                        <Box className="w-full h-full flex flex-col text-center items-center justify-center whitespace-pre-line">
                                            <strong className='text-xl 2xl:text-3xl uppercase mb-1'>
                                                {event?.name}
                                            </strong>
                                            <p className='text-base 2xl:text-2xl mb-1'>
                                                {event?.description}
                                            </p>
                                        </Box>
                                    </Box>
                                    <Box className='absolute w-full flex items-center justify-between top-2 right-2 left-2'>
                                        <Box className="w-full text-start items-start flex flex-col pl-2">
                                            <Typography>Đơn vị tổ chức</Typography>
                                            <AvatarGroup max={4}>
                                                {
                                                    (event?.owners || []).map((e, idx) => (
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
                                        </Box>
                                        <Tag color={PROCESS_STATUS[event?.status]?.color}>
                                            {PROCESS_STATUS[event?.status]?.label}
                                        </Tag>
                                    </Box>
                                    <Box className='absolute bottom-2 left-2 right-2 flex flex-col lg:flex-row flex-wrap items-start justify-start p-2'>

                                        {
                                            (event?.rounds || []).map((round, idRound) => {
                                                return (
                                                    <Box className="flex" key={idRound}>
                                                        <Tag color={COLOR_REAL[idRound]} className='hover:cursor-pointer text-sm 2xl:text-base m-1 hover:text-lg' onClick={() => {
                                                        }}>
                                                            {round.name}
                                                        </Tag>
                                                        {
                                                            round.kind == "FORM" && round.form_question_id &&
                                                            <Link to={`/algo-frontend-service/form-store/${round.form_question_id}/preview`}>Đơn tuyển thành viên tại đây</Link>
                                                        }
                                                    </Box>
                                                )
                                            })
                                        }
                                    </Box>
                                </Box>
                            }
                        >
                            <Typography variant='body1'>
                                {`Diễn ra từ ${moment(parseInt(event?.start_time) * 1000).format('DD-MM-YYYY')} đến ${moment(parseInt(event?.end_time) * 1000).format('DD-MM-YYYY')}`}
                            </Typography>
                            {event?.owners.map(e => e?.user?.id).includes(account?.id) ?
                                <div className='w-full items-center text-center' onClick={() => {
                                    navigate(`events/${event?.id}`)
                                }}>
                                    <EditIcon className='bg-slate-100 rounded-lg p-1 hover:cursor-pointer' fontSize="large" color="#ccc" />
                                </div>
                                : <></>
                            }
                        </Card>
                    )
                })
            }
            {
                data.length == 0 &&
                <Empty
                    className='w-full items-center text-center'
                />
            }
        </Box>
    );
}

export default ClubEventList;
