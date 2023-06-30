import { Box, Button, Typography } from '@mui/material';
import { Card, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { COLOR_REAL } from '../../utils/constant';
import FORM from '../../assets/images/form.png'
import { get, post } from '../../utils/request';
import { errorNotification } from '../../utils/notification';
import { Link } from 'react-router-dom';

const Round = ({ idRound, round, eventId, clubId }) => {
    const [data, setData] = useState(round)
    const [formQuestion, setFormQuestion] = useState(null)
    console.log("re-render");

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

    useEffect(() => {
        if (data.form_question_id) {
            getFormQuestion(data.form_question_id)
        }
    }, [data])

    return (
        <Card title={
            <Box className="flex space-x-2">
                <Tag color={COLOR_REAL[idRound]} className='hover:cursor-pointer text-sm 2xl:text-base m-1 hover:text-lg' onClick={() => {
                }}>
                    {data.name}
                </Tag>
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
                            <Button>Chọn mẫu đơn có sẵn trong hệ thống</Button>
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
                        </Box>
                    }
                </Box>
            </Box>
        </Card>
    );
}

export default Round;
