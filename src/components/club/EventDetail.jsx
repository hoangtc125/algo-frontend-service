import { Avatar, AvatarGroup, Badge, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';

import { accountSelector } from '../../redux/selectors';
import { get } from '../../utils/request';
import { COLOR_REAL, EVENT_TYPE, PROCESS_STATUS } from '../../utils/constant';
import { Tag, Tooltip } from 'antd';

const EventDetail = () => {

    const { eventId } = useParams()
    const [event, setEvent] = useState({})
    const navigate = useNavigate()

    const getEvent = async () => {
        try {
            const res = await get(`/recruit/event/get?id=${eventId}`)
            if (res?.status_code == 200) {
                setEvent(res?.data)
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
        getEvent()
    }, [eventId])

    return (
        <Box className="w-full flex flex-col items-center justify-center space-y-4">
            <Box className="w-full flex space-x-2 justify-between">
                <Box className="flex-1 flex items-start text-start flex-col space-y-2 opacity-70">
                    <Typography variant='h6'>{event?.club?.name}</Typography>
                    <Typography variant='body1'>{event?.club?.description}</Typography>
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
                <Box className="flex-1 flex items-center text-center flex-col space-y-2">
                    <Typography variant='h6'>{event?.name}</Typography>
                    <Typography variant='body1'>{event?.description}</Typography>
                </Box>
                <Box className="flex-1 flex items-end text-end flex-col space-y-2">
                    <Typography variant='body1'>Loại sự kiện: {EVENT_TYPE[event?.type]}</Typography>
                    <Tag color={PROCESS_STATUS[event?.status]?.color}>
                        {PROCESS_STATUS[event?.status]?.label}
                    </Tag>
                </Box>
            </Box>
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
                                <Link to={`/algo-frontend-service/apply/${round.form_question_id}`}>Đơn tuyển thành viên tại đây</Link>
                            }
                        </Box>
                    )
                })
            }
        </Box>
    );
}

export default EventDetail;
