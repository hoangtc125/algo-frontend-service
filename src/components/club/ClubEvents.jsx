import { Avatar, AvatarGroup, Badge, Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Modal, Table, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import { clubInfoSelector, eventsSelector } from '../../redux/selectors';
import { COLOR_REAL, EVENT_TYPE, PROCESS_STATUS } from '../../utils/constant';
import clubSlice, { updateEvent } from './clubSlice';
import CreateEvent from './CreateEvent';

const ClubEvents = () => {
    const dispatch = useDispatch()
    const info = useSelector(clubInfoSelector)
    const navigate = useNavigate()
    const { clubId } = useParams()
    const events = useSelector(eventsSelector)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dataset = events.map(e => [e.id, e.name, e.description, e.type, e.owners, e.rounds, e.status])

    useEffect(() => {
        setIsModalOpen(false)
    }, [events])

    const columns = [
        {
            title: "ID",
            dataIndex: 0,
            key: 0,
            ellipsis: true, // Giới hạn độ dài cột
            width: 50, // Độ rộng cột
            fixed: true,
            render: (text, record, index) => {
                return (
                    <Typography>{index + 1}</Typography>
                )
            }
        },
        {
            title: "Tên sự kiện",
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
            title: "Mô tả",
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
            title: "Loại sự kiện",
            dataIndex: 3,
            key: 3,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            render: (text, record, index) => {
                return (
                    <Typography>{EVENT_TYPE[text]}</Typography>
                )
            }
        },
        {
            title: "Đơn vị tổ chức",
            dataIndex: 4,
            key: 4,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            render: (text, record, index) => {
                return (
                    <Box className="w-full flex items-center text-center">
                        <AvatarGroup max={4}>
                            {
                                (text || []).map((e, idx) => (
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
                )
            }
        },
        {
            title: "Vòng loại",
            dataIndex: 5,
            key: 5,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            render: (text, record, index) => {
                return (text || []).map((round, idRound) => {
                    return (
                        <Box className="flex flex-col w-full" key={idRound}>
                            <Tag color={COLOR_REAL[idRound]} className='text-sm 2xl:text-base m-1 hover:text-lg' onClick={() => {
                            }}>
                                {round.name}
                            </Tag>
                            {
                                round.kind == "FORM" && round.form_question_id &&
                                <Box className="flex flex-col ">
                                    <Link to={`/algo-frontend-service/form-store/${round.form_question_id}/preview`}>Đơn tuyển thành viên tại đây</Link>
                                </Box>
                            }
                        </Box>
                    )
                })
            }
        },
        {
            title: "Trạng thái",
            dataIndex: 6,
            key: 6,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            render: (text, record, index) => {
                return (
                    <FormControl fullWidth>
                        <InputLabel id="el-status-event-label">Trạng thái</InputLabel>
                        <Select
                            labelId="el-status-event-label"
                            id="el-status-event"
                            label="Trạng thái"
                            defaultValue={text}
                            onChange={(e) => { dispatch(updateEvent({ event_id: record[0], payload: { "status": e.target.value } })) }}
                        >
                            {Object.keys(PROCESS_STATUS).map((e, idx) => (
                                <MenuItem key={idx} value={e}>
                                    <Tag color={PROCESS_STATUS[e]?.color || "success"}>{PROCESS_STATUS[e]?.label}</Tag>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )
            }
        }, {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            width: 100,
            render: (text, record, index) => (
                <Box className="space-x-2 items-center text-center">
                    <Button variant='outlined' color='info'
                        onClick={() => {
                            navigate(`${record[0]}`)
                        }}
                    >Xem</Button>
                </Box>
            ),
        },
    ]

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    return (
        <Box className="w-full flex items-start justify-center">
            <Table
                dataSource={dataset}
                columns={columns}
                size='small'
                title={() => (
                    <Box className="w-full flex items-center justify-between">
                        <Box className="flex-1">
                            <Button variant='outlined'
                                onClick={() => {
                                    dispatch(clubSlice.actions.setSelect("select"))
                                    setIsModalOpen(true)
                                }}
                            >Thêm sự kiện</Button>
                        </Box>
                        <Box className="flex-1 w-full flex flex-col text-center items-center justify-center">
                            <Typography className='text-black uppercase' variant='h6'>{info?.name}</Typography>
                            <Typography className='text-black uppercase' variant='body1'>{info?.nickname}</Typography>
                        </Box>
                        <Box className="flex-1"></Box>
                    </Box>
                )}
                className='w-full min-h-screen bg-gray-100 rounded-md shadow-lg p-3'
                rowKey={(record) => record[0]}
                scroll={{
                    x: 200,
                }}
                pagination={false}
            />
            <Modal centered width={1000} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
                <CreateEvent />
            </Modal>
        </Box>
    );
}

export default ClubEvents;
