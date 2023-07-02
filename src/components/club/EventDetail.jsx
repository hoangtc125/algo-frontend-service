import { Avatar, AvatarGroup, Badge, Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';

import { get, post } from '../../utils/request';
import { COLOR_REAL, EVENT_TYPE, PROCESS_STATUS } from '../../utils/constant';
import { Collapse, Descriptions, Modal, Table, Tag, Tooltip } from 'antd';
import Round from './Round';
import { errorNotification } from '../../utils/notification';
import Interview from './Interview';

const EventDetail = () => {

    const { eventId } = useParams()
    const [event, setEvent] = useState({})
    const navigate = useNavigate()
    const [participant, setParticipant] = useState([])

    const getParticipant = async () => {
        try {
            const res = await post(`/recruit/participant/get-all`, { "event_id": eventId })
            if (res?.status_code == 200) {
                setParticipant(res?.data.map(e => [e.id, e.name, e.email, e.user, e.photo, '', '', e.approve]))
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    }

    const columns = [
        {
            title: "ID",
            dataIndex: 0,
            key: 0,
            ellipsis: true, // Giới hạn độ dài cột
            width: 50, // Độ rộng cột
            render: (text, record, index) => {
                return (
                    <Typography>{index + 1}</Typography>
                )
            }
        },
        {
            title: "Họ và tên",
            dataIndex: 1,
            key: 1,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            render: (text, record, index) => {
                return (
                    <Typography>{text}</Typography>
                )
            }
        },
        {
            title: "Email",
            dataIndex: 2,
            key: 2,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            render: (text, record, index) => {
                return (
                    <Typography>{text}</Typography>
                )
            }
        },
        {
            title: "Tài khoản",
            dataIndex: 3,
            key: 3,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            render: (text, record, index) => {
                if (text) {
                    const account = text
                    return (
                        <Box
                            sx={{ display: 'flex', '&:hover': { cursor: 'pointer' } }}
                            className="hover:text-blue-500"
                            onClick={() => { navigate(`/algo-frontend-service/account/${account.id}`) }}
                        >
                            <Typography className='hidden sm:inline-block text-base'>{account?.name}</Typography>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    account?.verify?.status ? <VerifiedIcon className='bg-white rounded-full' fontSize="small" color="primary" /> : <></>
                                }
                            >
                                <Avatar
                                    alt='avatar'
                                    src={account?.photo_url}
                                    sx={{ width: 24, height: 24, marginLeft: '6px' }}
                                />
                            </Badge>
                        </Box>
                    )
                } else {
                    return ""
                }
            },
        },
        {
            title: "Ảnh chân dung",
            dataIndex: 4,
            key: 4,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            render: (text, record, index) => {
                return (
                    <Typography>{text}</Typography>
                )
            }
        },
        {
            title: "Đơn ứng tuyển",
            dataIndex: 5,
            key: 5,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            render: (text, record, index) => {
                return (
                    <Box className="w-full space-x-1 flex justify-start items-center">
                        <Tag className='text-base' color={record[7][0] ? "success" : 'red'}>{record[7][0] ? "Chọn" : "Loại"}</Tag>
                        <Button variant='outlined' onClick={async () => {
                            try {
                                const res = await post(`/recruit/form-answer/get-all`, { "event_id": eventId, "round_id": event?.rounds[0]?.id, "participant_id": record[0] })
                                if (res?.status_code == 200 && res?.data.length == 1) {
                                    let record = []
                                    res?.data[0]?.sections.map(
                                        s => s.data.map(e => {
                                        record.push({value: e.value, answer: e.answer})
                                    }))
                                    Modal.info({
                                        title: "Chi tiết bản ghi",
                                        className: "min-w-[80vw] max-w-[90vw]",
                                        centered: true,
                                        content: (
                                            <Descriptions bordered className="w-full max-h-[80vh] overflow-auto">
                                                {
                                                    record.map((e, id) => (
                                                        <Descriptions.Item span={3} className='hover:bg-slate-100' label={e.value} key={id}>{e.answer}</Descriptions.Item>
                                                    ))
                                                }
                                            </Descriptions>
                                        ),
                                        onOk() { },
                                        onCancel() { },
                                    });
                                } else {
                                    errorNotification(res?.status_code, res?.msg, "bottomRight")
                                }
                            } catch (e) {
                                console.log({ e });
                                errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
                            }
                        }}>Xem</Button>
                    </Box>
                )
            }
        },
        {
            title: "Đơn phỏng vấn",
            dataIndex: 6,
            key: 6,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            render: (text, record, index) => {
                return (
                    <Box className="w-full space-x-1 flex justify-start items-center">
                        <Tag className='text-base' color={record[7][1] ? "success" : 'red'}>{record[7][1] ? "Chọn" : "Loại"}</Tag>
                        <Button variant='outlined' onClick={async () => {
                        }}>Xem</Button>
                    </Box>
                )
            }
        },
        {
            title: "Kết quả",
            dataIndex: 7,
            key: 7,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            render: (text, record, index) => {
                const res = (text || []).every((element) => element)
                return (
                    <Tag className='text-base' color={res ? "success" : 'red'}>{res ? "Chọn" : "Loại"}</Tag>
                )
            }
        },
    ]

    useEffect(() => {
        getParticipant()
    }, [])

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

    const items = (event?.rounds || []).map((round, idRound) => {
        if (round.kind == "FORM") {
            return {
                key: idRound + 1,
                label: round.name,
                children: <Round key={idRound} idRound={idRound} round={round} eventId={eventId} clubId={event.club_id} />,
            }
        } else {
            return {
                key: idRound + 1,
                label: round.name,
                children: <></>,
            }
        }
    })

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
            <Collapse className='w-full' defaultActiveKey={["participant"]}>
                <Collapse.Panel header="Danh sách ứng viên" key={"participant"}>
                    <Table
                        dataSource={participant}
                        columns={columns}
                        bordered
                        size='small'
                        className='cursor-pointer rounded-md w-full'
                        rowKey={(record) => record[0]}
                        scroll={{
                            x: 200,
                        }}
                    />
                </Collapse.Panel>
                {
                    (event?.rounds || []).map((round, idRound) => {
                        if (round.kind == "FORM") {
                            return (
                                <Collapse.Panel header={round.name} key={idRound}>
                                    <Round key={idRound} idRound={idRound} round={round} eventId={eventId} clubId={event.club_id} />
                                </Collapse.Panel>
                            )
                        } else {
                            return (
                                <Collapse.Panel header={round.name} key={idRound}>
                                    <Interview key={idRound} idRound={idRound} round={round} eventId={eventId} clubId={event.club_id} />
                                </Collapse.Panel>
                            )
                        }
                    })
                }
            </Collapse>
        </Box>
    );
}

export default EventDetail;
