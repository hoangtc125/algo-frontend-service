import React from 'react';
import { Button, Table } from 'antd';
import { Box, Typography } from '@mui/material';

const InterviewScheduleTable = ({ data }) => {

    const columns = [
        {
            title: 'Tên',
            dataIndex: ['participant', 'name'],
            key: 'name'
        },
        {
            title: 'Email ứng viên',
            dataIndex: ['participant', 'email'],
            key: 'email'
        },
        ...(data?.sections[0]?.data[0]?.options || []).map((e, idx) => {
            const shiftName = e.value.split('|')[0].trim();
            const shiftPlace = e.value.split('|')[1].trim();
            const shiftTime = e.value.split('|')[2].trim();
            return {
                title: (
                    <div>
                        <div>{shiftName}</div>
                        <div>{shiftPlace}</div>
                        <div>{shiftTime}</div>
                    </div>
                ),
                dataIndex: ['sections', 0, 'data', 0, 'answer'],
                key: e.id,
                render: (text, record, index) => {
                    return (
                        <Typography className='w-full items-center text-center'>{(text || []).includes(e.id) ? "x" : ""}</Typography>
                    )
                }
            }
        })
    ];

    return (
        <Box className='w-full flex flex-col items-end text-end'>
            <Button type='primary'>Phân chia kíp tự động</Button>
            <Table dataSource={data.answers} columns={columns} rowKey={(record) => record?.id} className='w-full'/>
        </Box>
    )
};

export default InterviewScheduleTable;
