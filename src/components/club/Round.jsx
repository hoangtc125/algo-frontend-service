import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Card, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { COLOR_REAL, PROCESS_STATUS } from '../../utils/constant';
import FORM from '../../assets/images/form.png'
import { get, post, put } from '../../utils/request';
import { errorNotification, successNotification } from '../../utils/notification';
import { Link } from 'react-router-dom';
import FormStore from '../formStore/formStore';
import { useDispatch, useSelector } from 'react-redux';
import { selectedFormSelector } from '../../redux/selectors';
import FormCluster from '../cluster/FormCluster';
import clusterSlice from '../cluster/slice/clusterSlice';

const Round = ({ idRound, round, eventId, clubId }) => {
    const dispatch = useDispatch()
    const [data, setData] = useState(round)
    const [formQuestion, setFormQuestion] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const selected = useSelector(selectedFormSelector)
    console.log("re-render");

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

    const assignId = (data) => {
        const newData = data.map((e, id) => {
            if (id == 0) {
                return [{ title: "ID đánh tự động", disabled: true }, ...e]
            } else {
                return [id - 1, ...e]
            }
        })
        return newData
    }

    useEffect(() => {
        if (!formQuestion?.answers) {
            return
        }
        let filteredData = [[]]
        let types = ["text"]
        formQuestion.sections.map(s => s.data.map(e => {
            filteredData[0].push(e.value)
            if (["text", "textarea"].includes(e.type)) {
                types.push("text")
            } else if ("number" == e.type) {
                types.push("numerical")
            } else {
                types.push("categorical")
            }
            return 1
        }))
        for (let index = 0; index < formQuestion.answers.length; index++) {
            let answer = []
            formQuestion.answers[index].sections.map(s => s.data.map(e => {
                answer.push(e.answer)
                return 1
            }))
            filteredData.push(answer)
        }
        const formData = assignId(filteredData)
        const formHeader = formData[0].map((e, idx) => ({
            id: idx,
            title: e?.title || e,
            type: types[idx],
            disabled: e?.disabled || false,
            weight: 0,
        }))
        const formBody = formData.slice(1)
        console.log({formHeader, formBody});
        dispatch(clusterSlice.actions.setDataset(formBody));
        dispatch(clusterSlice.actions.setHeader(formHeader));
        dispatch(clusterSlice.actions.setVectorset({dataset: formBody.length, header: formHeader.length}))
        dispatch(clusterSlice.actions.setCollDiffData(
            formHeader.map((item, index) => Array.from(new Set(formBody.map(e => e[index] || ''))))
        ))
    }, [formQuestion])

    const handleCancel = () => {
        setIsModalOpen(false)
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

    const publicFormQuestion = async () => {
        try {
            const res = await put(`/recruit/form-question/update?form_question_id=${formQuestion.id}&event_id=${eventId}`, {
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

    useEffect(() => {
        if (data.form_question_id) {
            getFormQuestion(data.form_question_id)
        }
    }, [data])

    return (
        <Card title={
            <Box className="flex space-x-2 justify-between h-fit p-3">
                <Tag color={COLOR_REAL[idRound]} className='hover:cursor-pointer h-fit text-sm 2xl:text-base m-1 hover:text-lg' onClick={() => {
                }}>
                    {data.name}
                </Tag>
                <FormControl className='h-fit'>
                    <InputLabel id="el-status-event-label">Trạng thái</InputLabel>
                    <Select
                        labelId="el-status-event-label"
                        id="el-status-event"
                        label="Trạng thái"
                        defaultValue={round?.status || "NOT_BEGIN"}
                        onChange={(e) => { updataRoundStatus(e.target.value) }}
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
                        1. Quản lý đơn tuyển thành viên
                    </Typography>
                    {!formQuestion ?
                        <Box className="w-full items-center text-center flex space-x-4">
                            <Button onClick={(() => { createNewFormQuestion() })}>Tạo đơn tuyển thành viên mới</Button>
                            <Button onClick={() => { setIsModalOpen(true) }}>Chọn mẫu đơn có sẵn trong hệ thống</Button>
                        </Box> :
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
                            <Box className="w-full flex flex-col space-y-3 items-start">
                                {
                                    formQuestion.kind == "private" ?
                                        <Button onClick={publicFormQuestion}>Công khai biểu mẫu</Button> :
                                        <Typography>Kho đơn: <Link to={`/algo-frontend-service/event`} className='text-blue-500'>Đã công khai</Link></Typography>
                                }
                                <Typography>Đường link trả lời: <Link to={`/algo-frontend-service/form-store/${formQuestion.id}/preview`} className='text-blue-500'>{`${window.location.origin}/algo-frontend-service/form-store/${formQuestion.id}/preview`}</Link></Typography>
                                <Typography>Số lượng câu trả lời: <span className='text-blue-500'>{(formQuestion?.answers || []).length}</span></Typography>
                                <Typography>Trạng thái:
                                    <Tag color={PROCESS_STATUS[data?.status || "NOT_BEGIN"]?.color || "success"}>{PROCESS_STATUS[data?.status || "NOT_BEGIN"]?.description}</Tag>
                                </Typography>
                            </Box>
                        </Box>
                    }
                    <Typography variant='body1'>
                        2. Đánh giá ứng viên
                    </Typography>
                    <Box className="w-full">
                        <FormCluster />
                    </Box>
                </Box>
            </Box>
            <Modal centered width={1250} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
                <FormStore mode={"#select"} />
            </Modal>
        </Card>
    );
}

export default Round;
