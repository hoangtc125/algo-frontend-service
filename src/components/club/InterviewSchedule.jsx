import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, Table, Modal, Card, Tag } from 'antd';
import { useFormik } from 'formik';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import FORM from '../../assets/images/form.png'
import { del, get, post, put } from '../../utils/request';
import { errorNotification, successNotification } from '../../utils/notification';
import clubSlice from './clubSlice';
import { PROCESS_STATUS } from '../../utils/constant';
import InterviewScheduleTable from './InterviewScheduleTable';

const { confirm } = Modal;

const InterviewSchedule = ({ idRound, round, eventId, clubId }) => {
    const dispatch = useDispatch()
    const [interviews, setInterviews] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formQuestion, setFormQuestion] = useState(null)
    const [editIndex, setEditIndex] = useState(null);

    const getShift = async () => {
        try {
            const res = await post(`/recruit/shift/get-all`, { club_id: clubId, event_id: eventId, round_id: idRound })
            if (res?.status_code == 200) {
                setInterviews(res?.data)
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    }

    const getFormQuestion = async () => {
        try {
            const res = await get(`/recruit/form-question/get?id=${round.form_question_id}`)
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

    const updateFormQuestion = async (payload) => {
        let updateQuestion = { ...formQuestion }
        updateQuestion.sections[0].data[0].options = payload
        try {
            const res = await put(`/recruit/form-question/update?form_question_id=${round.form_question_id}&event_id=${eventId}`, {
                sections: updateQuestion.sections
            })
            if (res?.status_code == 200) {
                successNotification("Cập nhật thành công", "Biểu mẫu thu thập đã được cập nhật theo", "bottomRight")
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    }

    useEffect(() => {
        dispatch(clubSlice.actions.setShifts(interviews))
        if (formQuestion) {
            updateFormQuestion(interviews.map(e => ({ id: e?.id, to: "", value: `${e?.name} | ${e?.place} | ${moment(e.start_time).format('DD-MM-YYYY HH:mm')} - ${moment(e.end_time).format('DD-MM-YYYY HH:mm')}` })))
        }
    }, [interviews])

    useEffect(() => {
        getShift()
        getFormQuestion()
    }, [round])

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditIndex(null);
        formik.resetForm()
    };

    const handleEdit = (index, record) => {
        setEditIndex(index);
        formik.setValues(interviews[index])
        showModal();
    };

    const handleSendMailShift = async () => {
        try {
            const res = await put(`/recruit/shift/mail?form_question_id=${round.form_question_id}&event_id=${eventId}`)
            if (res?.status_code == 200) {
                successNotification("Thành công", "Biểu mẫu thu thập đã được send", "bottomRight")
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    }

    const handleDelete = (index, record) => {
        confirm({
            title: 'Xóa kíp phỏng vấn',
            content: 'Bạn có chắc chắn muốn xóa kíp phỏng vấn này?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const res = await del(`/recruit/shift/delete?shift_id=${record?.id}&event_id=${eventId}`)
                    if (res?.status_code == 200) {
                        const updatedInterviews = [...interviews];
                        updatedInterviews.splice(index, 1);
                        setInterviews(updatedInterviews);
                    } else {
                        errorNotification(res?.status_code, res?.msg, "bottomRight")
                    }
                } catch (e) {
                    console.log({ e });
                    errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
                }
            },
        });
    };

    const handleSubmit = async (values) => {
        if (editIndex != null) {
            try {
                const res = await put(`/recruit/shift/update?shift_id=${interviews[editIndex]?.id}&event_id=${eventId}`, { ...values, club_id: clubId, event_id: eventId, round_id: idRound })
                if (res?.status_code == 200) {
                    const updatedInterviews = [...interviews];
                    updatedInterviews[editIndex] = { ...(interviews[editIndex]), ...values };
                    setInterviews(updatedInterviews);
                } else {
                    errorNotification(res?.status_code, res?.msg, "bottomRight")
                }
            } catch (e) {
                console.log({ e });
                errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
            }
        } else {
            try {
                const res = await post(`/recruit/shift/create`, { ...values, club_id: clubId, event_id: eventId, round_id: idRound })
                if (res?.status_code == 200) {
                    setInterviews([...interviews, { id: res?.data, ...values }]);
                } else {
                    errorNotification(res?.status_code, res?.msg, "bottomRight")
                }
            } catch (e) {
                console.log({ e });
                errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
            }
        }
        handleCancel();
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            start_time: null,
            end_time: null,
            place: '',
            capacity: 0,
        },
        validate: (values) => {
            const errors = {};
            if (!values.name) {
                errors.name = 'Vui lòng nhập tên';
            }
            if (!values.start_time) {
                errors.start_time = 'Vui lòng chọn thời gian bắt đầu';
            }
            if (!values.end_time) {
                errors.end_time = 'Vui lòng chọn thời gian kết thúc';
            }
            if (!values.place) {
                errors.place = 'Vui lòng nhập địa điểm';
            }
            if (!values.capacity) {
                errors.capacity = 'Vui lòng nhập số lượng';
            } else if (values.capacity <= 0) {
                errors.capacity = 'Số lượng phải lớn hơn 0';
            }
            return errors;
        },
        onSubmit: handleSubmit,
    });

    const columns = [
        {
            title: 'Kíp phỏng vấn ứng viên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Thời gian',
            dataIndex: 'time_range',
            key: 'time_range',
            render: (_, record) => (
                <>
                    {moment(record.start_time).format('DD-MM-YYYY HH:mm')}
                    {' - '}
                    {moment(record.end_time).format('DD-MM-YYYY HH:mm')}
                </>
            ),
        },
        {
            title: 'Địa điểm',
            dataIndex: 'place',
            key: 'place',
        },
        {
            title: 'Số lượng',
            dataIndex: 'capacity',
            key: 'capacity',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record, index) => (
                <span>
                    <Button type="link" onClick={() => handleEdit(index, record)}>
                        Chỉnh sửa
                    </Button>
                    <Button type="link" onClick={() => handleDelete(index, record)}>
                        Xóa
                    </Button>
                </span>
            ),
        },
    ];

    return (
        <div>
            <Box className="w-full text-end">
                <Button type="primary" onClick={showModal}>
                    Tạo mới
                </Button>
            </Box>
            <Table columns={columns} dataSource={interviews} rowKey="id" />
            <Modal
                title={editIndex !== null ? 'Chỉnh sửa kíp phỏng vấn' : 'Tạo mới kíp phỏng vấn'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form layout="vertical" onFinish={formik.handleSubmit}>
                    <Form.Item label="Tên" required>
                        <Input
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div style={{ color: 'red' }}>{formik.errors.name}</div>
                        )}
                    </Form.Item>
                    <Form.Item label="Thời gian bắt đầu" required>
                        <DatePicker
                            showTime
                            format="DD-MM-YYYY HH:mm"
                            disabled={formik.values.start_time ? true : false}
                            name="start_time"
                            value={formik.values.start_time ? moment(formik.values.start_time) : null}
                            onChange={(date) => formik.setFieldValue('start_time', date ? date.valueOf() : null)}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.start_time && formik.errors.start_time && (
                            <div style={{ color: 'red' }}>{formik.errors.start_time}</div>
                        )}
                    </Form.Item>
                    <Form.Item label="Thời gian kết thúc" required>
                        <DatePicker
                            showTime
                            format="DD-MM-YYYY HH:mm"
                            disabled={formik.values.end_time ? true : false}
                            name="end_time"
                            value={formik.values.end_time ? moment(formik.values.end_time) : null}
                            onChange={(date) => formik.setFieldValue('end_time', date ? date.valueOf() : null)}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.end_time && formik.errors.end_time && (
                            <div style={{ color: 'red' }}>{formik.errors.end_time}</div>
                        )}
                    </Form.Item>
                    <Form.Item label="Địa điểm" required>
                        <Input
                            name="place"
                            value={formik.values.place}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.place && formik.errors.place && (
                            <div style={{ color: 'red' }}>{formik.errors.place}</div>
                        )}
                    </Form.Item>
                    <Form.Item label="Số lượng" required>
                        <Input
                            type="number"
                            name="capacity"
                            value={formik.values.capacity}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.capacity && formik.errors.capacity && (
                            <div style={{ color: 'red' }}>{formik.errors.capacity}</div>
                        )}
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        {editIndex !== null ? 'Lưu chỉnh sửa' : 'Tạo mới'}
                    </Button>
                </Form>
            </Modal>
            <Box className="w-full h-fit flex space-x-2 p-2">
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
                <Box className="w-full h-full flex flex-col justify-between space-y-10">
                    <Box className="w-full h-full flex flex-col space-y-3 items-start">
                        <Typography>Đường link trả lời: <Link to={`/algo-frontend-service/form-store/${formQuestion?.id}/preview`} className='text-blue-500'>{`${window.location.origin}/algo-frontend-service/form-store/${formQuestion?.id}/preview`}</Link></Typography>
                        <Typography>Số lượng câu trả lời: <span className='text-blue-500'>{(formQuestion?.answers || []).length}</span></Typography>
                        <Typography>Trạng thái:
                            <Tag color={PROCESS_STATUS[round?.status || "NOT_BEGIN"]?.color || "success"}>{PROCESS_STATUS[round?.status || "NOT_BEGIN"]?.description}</Tag>
                        </Typography>
                    </Box>
                    <Box>
                        <Button type='primary' onClick={handleSendMailShift}>Gửi mail thu thập</Button>
                    </Box>
                </Box>
            </Box>
            {formQuestion &&
                <InterviewScheduleTable data={formQuestion} />
            }
        </div>
    );
};

export default InterviewSchedule;
