import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, Table, Modal } from 'antd';
import { useFormik } from 'formik';
import moment from 'moment';
import { Box } from '@mui/material';
import { del, post, put } from '../../utils/request';
import { errorNotification } from '../../utils/notification';

const { confirm } = Modal;

const InterviewSchedule = ({ idRound, eventId, clubId }) => {
    const [interviews, setInterviews] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const getShift = async () => {
        try {
            const res = await post(`/recruit/shift/get-all`, {club_id: clubId, event_id: eventId, round_id: idRound})
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

    useEffect(() => {
        getShift()
    }, [])

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
                const res = await put(`/recruit/shift/update?shift_id=${interviews[editIndex]?.id}&event_id=${eventId}`, {...values, club_id: clubId, event_id: eventId, round_id: idRound})
                if (res?.status_code == 200) {
                    const updatedInterviews = [...interviews];
                    updatedInterviews[editIndex] = {...(interviews[editIndex]), ...values};
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
                const res = await post(`/recruit/shift/create`, {...values, club_id: clubId, event_id: eventId, round_id: idRound})
                if (res?.status_code == 200) {
                    setInterviews([...interviews, {id: res?.data, ...values}]);
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
        </div>
    );
};

export default InterviewSchedule;
