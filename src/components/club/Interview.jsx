import React, { useEffect, useState } from 'react';
import { Card, Image, Modal, Table, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

import InterviewSchedule from './InterviewSchedule';
import { COLOR_REAL, IMAGE, PROCESS_STATUS } from '../../utils/constant';
import { get, post, put } from '../../utils/request';
import { errorNotification } from '../../utils/notification';
import { imagesSelector, selectedFormSelector } from '../../redux/selectors';
import FORM from '../../assets/images/form.png'
import FormStore from '../formStore/formStore';
import Camera from '../camera';
import ImagesReview from '../camera/imagesReview';
import cameraSlice from '../camera/cameraSlice';
import FormViewerPage from '../../pages/form/formViewerPage';

const Interview = ({ idRound, round, eventId, clubId }) => {
    const dispatch = useDispatch()
    const [data, setData] = useState(round)
    const [formQuestion, setFormQuestion] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [participants, setParticipants] = useState([])
    const [selectedParticipant, setSelectedParticipant] = useState(null)
    const selected = useSelector(selectedFormSelector)
    const images = useSelector(imagesSelector)

    const handleOk = async () => {
        try {
            const res = await post(`/recruit/form-question/create?club_id=${clubId}&event_id=${eventId}&round_id=${data.id}`, selected)
            if (res?.status_code == 200) {
                setData({ ...data, form_question_id: res?.data })
                setFormQuestion(selected)
                setIsModalOpen(false);
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    };

    const handleOk1 = async () => {
        try {
            const res = await put(`/recruit/participant/update?event_id=${eventId}&participant_id=${selectedParticipant}`, {
                "photo_url": images[0]?.url
            })
            if (res?.status_code == 200) {
                setIsModalOpen1(false);
                setParticipants(participants.map(e => {
                    if (e.id == selectedParticipant) {
                        return {...e, photo_url: images[0]?.url}
                    } else {
                        return e
                    }
                }))
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const handleCancel1 = () => {
        setIsModalOpen1(false)
    }

    const handleCancel2 = () => {
        setIsModalOpen2(false)
    }

    const getFormQuestion = async (id) => {
        try {
            const res = await get(`/recruit/form-question/get?id=${id}`)
            if (res?.status_code == 200) {
                setFormQuestion(res?.data)
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    }

    const createNewFormQuestion = async () => {
        try {
            const res = await post(`/recruit/form-question/create?club_id=${clubId}&event_id=${eventId}&round_id=${data.id}`)
            if (res?.status_code == 200) {
                setData({ ...data, form_question_id: res?.data })
                await getFormQuestion(res?.data)
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    }


    const updataRoundStatus = async (status) => {
        try {
            const res = await put(`/recruit/round/update?event_id=${eventId}&round_id=${data.id}`, { status })
            if (res?.status_code == 200) {
                setData({ ...data, status })
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    }

    const endFormRound = async () => {
        try {
            const res = await put(`/recruit/round/form/end?event_id=${eventId}&round_id=${data.id}`)
            if (res?.status_code == 200) {
                setData({ ...data, status: "FINISHED" })
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    }

    const publicFormQuestion = async () => {
        try {
            const res = await put(`/recruit/form-question/update?form_question_id=${formQuestion?.id}&event_id=${eventId}`, {
                kind: "public"
            })
            if (res?.status_code == 200) {
                successNotification("Successfull", "", "bottomRight")
                setFormQuestion({ ...formQuestion, kind: "public" })
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    }

    const getParticipant = async () => {
        try {
            const res = await post(`/recruit/participant/get-all`, { "event_id": eventId })
            if (res?.status_code == 200) {
                setParticipants(res?.data.filter(e => e.approve[0]))
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    }

    useEffect(() => {
        if (data.form_question_id) {
            getFormQuestion(data.form_question_id)
        }
        getParticipant()
    }, [data.form_question_id])

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
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
            dataIndex: "name",
            key: "name",
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
            dataIndex: "email",
            key: "email",
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            render: (text, record, index) => {
                return (
                    <Typography>{text}</Typography>
                )
            }
        },
        {
            title: "Ảnh chân dung",
            dataIndex: "photo_url",
            key: "photo_url",
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            render: (text, record, index) => {
                return (
                    <Box className="w-full flex space-x-1 justify-between items-center">
                        <Image
                            src={text}
                            fallback={IMAGE}
                            className='!h-20'
                        />
                        <Button onClick={() => {
                            setSelectedParticipant(record.id)
                            dispatch(cameraSlice.actions.setSingle(true))
                            setIsModalOpen1(true);
                        }}>Chụp mới</Button>
                    </Box>
                )
            }
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            render: (text, record, index) => {
                return (
                    <Box className="w-full flex space-x-1 items-center">
                        <Button onClick={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.set('participant_id', record.id);
                            window.history.pushState(null, null, url.toString());
                            setSelectedParticipant(record.id)
                            setIsModalOpen2(true)
                        }}>Phỏng vấn</Button>
                    </Box>
                )
            }
        }, {
            title: 'Đánh giá',
            dataIndex: "approve",
            key: "approve",
            fixed: 'right',
            width: 200,
            render: (text, record, index) => (
                <FormControl fullWidth>
                    <InputLabel id="el-approve-end-label">Đánh giá</InputLabel>
                    <Select
                        labelId="el-approve-end-label"
                        id="el-approve-end"
                        label="Đánh giá"
                        defaultValue={text[1]}
                        onChange={async (e) => {
                            try {
                                const res = await put(`/recruit/participant/update?participant_id=${record.id}&event_id=${eventId}`, {
                                    approve: [true, e.target.value]
                                })
                                if (res?.status_code == 200) {
                                } else {
                                    errorNotification(res?.status_code, res?.msg, "bottomRight")
                                }
                            } catch (e) {
                                console.log({ e });
                                errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
                            }
                        }}
                    >
                        <MenuItem key={false} value={false}>
                            <Tag className='text-base' color='red'>Loại</Tag>
                        </MenuItem>
                        <MenuItem key={true} value={true}>
                            <Tag className='text-base' color='green'>Chọn</Tag>
                        </MenuItem>
                    </Select>
                </FormControl>
            ),
        }]

    return (
        <Card title={
            <Box className="flex space-x-2 justify-between h-fit p-3">
                <Tag color={COLOR_REAL[idRound]} className='hover:cursor-pointer h-fit text-sm 2xl:text-base m-1 hover:text-lg' onClick={() => {
                }}>
                    {data.name}
                </Tag>
                <FormControl className='h-fit'>
                    <InputLabel id="el-status-interview-label">Trạng thái</InputLabel>
                    <Select
                        labelId="el-status-interview-label"
                        id="el-status-interview"
                        label="Trạng thái"
                        defaultValue={round?.status || "NOT_BEGIN"}
                        onChange={(e) => {
                            if (e.target.value == "FINISHED") {
                                endFormRound()
                            } else {
                                updataRoundStatus(e.target.value)
                            }
                        }}
                    >
                        {Object.keys(PROCESS_STATUS).map((e, idx) => (
                            <MenuItem key={idx} value={e}>
                                <Tag color={PROCESS_STATUS[e]?.color || "success"}>{PROCESS_STATUS[e]?.label}</Tag>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        } bordered={true}
            className="p-8 sm:p-4 bg-white w-full shadow-md rounded-md"
        >
            <Box className="w-full flex flex-col space-y-3">
                <Box className="w-full flex flex-col space-y-1">
                    <Typography variant='body1'>
                        1. Quản lý kíp phỏng vấn
                    </Typography>
                    <InterviewSchedule idRound={round.id} round={data} eventId={eventId} clubId={clubId} />
                </Box>
                <Box className="w-full flex flex-col space-y-1">
                    <Typography variant='body1'>
                        2. Phỏng vấn ứng viên
                    </Typography>
                    {!formQuestion ?
                        <Box className="w-full items-center text-center flex space-x-4">
                            <Button onClick={(() => { createNewFormQuestion() })}>Tạo đơn tuyển thành viên mới</Button>
                            <Button onClick={() => { setIsModalOpen(true) }}>Chọn mẫu đơn có sẵn trong hệ thống</Button>
                        </Box> :
                        <Box className="w-full flex flex-col justify-center space-y-2">
                            <Box className="w-full flex space-x-2">
                                <Card
                                    className='sm:w-72 w-96 shadow-lg m-4 lg:m-8'
                                    hoverable={true}
                                    cover={
                                        <Link to={`/algo-frontend-service/form-store/${formQuestion?.id}/builder`}>
                                            <img
                                                alt="example"
                                                src={FORM}
                                            />
                                        </Link>
                                    }
                                    actions={[
                                    ]}
                                >
                                    <Link to={`/algo-frontend-service/form-store/${formQuestion?.id}/builder`}>
                                        <Card.Meta
                                            className='h-24'
                                            title={(formQuestion?.sections || [])[0]?.title}
                                            description={(formQuestion?.sections || [])[0]?.description}
                                        />
                                    </Link>
                                </Card>
                                <Box className="w-full flex flex-col space-y-3 items-start justify-center">
                                    {
                                        formQuestion?.kind == "private" ?
                                            <Button onClick={publicFormQuestion}>Công khai biểu mẫu</Button> :
                                            <Typography>Kho đơn: <Link to={`/algo-frontend-service/form-store`} className='text-blue-500'>Đã công khai</Link></Typography>
                                    }
                                    <Typography>Trạng thái:
                                        <Tag color={PROCESS_STATUS[data?.status || "NOT_BEGIN"]?.color || "success"}>{PROCESS_STATUS[data?.status || "NOT_BEGIN"]?.description}</Tag>
                                    </Typography>
                                </Box>
                            </Box>
                            <Table
                                dataSource={participants}
                                columns={columns}
                                bordered
                                size='small'
                                className='cursor-pointer rounded-md shadow-lg w-full'
                                rowKey={(record) => record?.id}
                                scroll={{
                                    x: 200,
                                }}
                            />
                        </Box>
                    }
                </Box>
            </Box>
            <Modal centered width={1500} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
                <FormStore mode={"#select"} />
            </Modal>
            <Modal centered title="Cập nhật ảnh thẻ sinh viên" width={1000} open={isModalOpen1} onOk={handleOk1} onCancel={handleCancel1} destroyOnClose={true}>
                <Typography variant="body2">
                    Chụp ảnh trực tiếp từ điện thoại
                </Typography>
                <Camera />
                <Typography variant="body2">
                    Tải ảnh lên từ thiết bị này
                </Typography>
                <ImagesReview />
            </Modal>
            <Modal centered width={1500} open={isModalOpen2} onOk={handleCancel2} onCancel={handleCancel2} destroyOnClose={true}>
                <FormViewerPage form_id={data?.form_question_id} selectedParticipant={selectedParticipant}/>
            </Modal>
        </Card>
    );
}

export default Interview;
