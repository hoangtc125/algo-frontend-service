import React, { useState } from 'react';
import { Card, Tag } from 'antd';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

import InterviewSchedule from './InterviewSchedule';
import { COLOR_REAL, PROCESS_STATUS } from '../../utils/constant';
import { put } from '../../utils/request';
import { errorNotification } from '../../utils/notification';

const Interview = ({ idRound, round, eventId, clubId }) => {
    const [data, setData] = useState(round)

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
                        1. Quản lý kíp phỏng vấn
                    </Typography>
                    <InterviewSchedule idRound={round.id} round={data} eventId={eventId} clubId={clubId} />
                </Box>
                <Box className="w-full flex flex-col space-y-1">
                    <Typography variant='body1'>
                        2. 
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
}

export default Interview;
