import React, { useState } from 'react';
import { Button, Form, InputNumber, Table } from 'antd';
import { Box, Typography } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import Shift from './Shift';


const SplitInterview = () => {
    const [mode, setMode] = useState('trial');
    const [participantCount, setParticipantCount] = useState(50);
    const [shiftCount, setShiftCount] = useState(3);
    const [shiftCapacities, setShiftCapacities] = useState([])
    const [data, setData] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [shifts, setShifts] = useState([]);

    const handleModeChange = () => {
        setMode(mode === 'trial' ? 'real' : 'trial');
    };

    const generateFakeData = () => {
        const options = Array.from({ length: shiftCount }, (v, idx) => ({
            id: `option-${idx}`,
            value: `Kíp ${idx + 1} | B1 604 | 03-07-2023 06:00 - 03-07-2023 07:00`,
        }));

        const fakeData = {
            sections: [
                {
                    data: [
                        {
                            options,
                        },
                    ],
                },
            ],
            answers: Array.from({ length: participantCount }, (v, idx) => ({
                id: idx,
                participant: {
                    id: idx,
                    name: `Người dùng ${idx + 1}`,
                    email: `user${idx + 1}@example.com`,
                },
                data: [
                    {
                        answer: getRandomShifts(options),
                    },
                ],
            })),
        };
        setData(fakeData);
        let capacities = []
        for (let index = 0; index < shiftCount; index++) {
            capacities.push(Math.ceil(participantCount / shiftCount))
        }
        setShiftCapacities(capacities)
        setCandidates(fakeData.answers.map((answer) => answer.participant));
        let newShifts = options.map((option) => ({ id: option.id, title: option.value, candidates: [] }))
        newShifts.push({ id: 'unassigned', title: 'Chưa phân kíp', candidates: fakeData.answers.map((answer) => answer.participant) })
        setShifts(newShifts)
    };

    const getRandomShifts = (options) => {
        const availableShifts = options.map((option) => option.id);
        const shiftCount = getRandomInt(0, availableShifts.length);
        const selectedShifts = [];
        while (selectedShifts.length < shiftCount) {
            const randomIndex = getRandomInt(0, availableShifts.length);
            const selectedShift = availableShifts[randomIndex];
            if (!selectedShifts.includes(selectedShift)) {
                selectedShifts.push(selectedShift);
            }
        }
        return selectedShifts;
    };

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    const handleCandidateDrop = (candidateId, currentId, shiftId) => {
        console.log(candidateId, currentId, shiftId);
        const updatedShifts = shifts.map((shift) => {
            if (shift.id == shiftId) {
                return {
                    ...shift,
                    candidates: [...shift.candidates, candidates.find((candidate) => candidate.id == candidateId)],
                };
            } else if (shift.id == currentId || "unassigned" == currentId) {
                return {
                    ...shift,
                    candidates: shift.candidates.filter(e => e.id != candidateId)
                }
            }
            return shift;
        });
        setShifts(updatedShifts);
    };
    
    const columns = [
        {
            title: 'Tên',
            dataIndex: ['participant', 'name'],
            key: 'name',
            width: 200,
        },
        {
            title: 'Email ứng viên',
            dataIndex: ['participant', 'email'],
            key: 'email',
            width: 200,
        },
        ...(data?.sections[0]?.data[0]?.options || []).map((e, idx) => {
            const shiftName = e.value.split('|')[0].trim();
            return {
                title: (
                    <div className='w-full items-center text-center flex flex-col'>
                        <div>{shiftName}</div>
                        <Box className='items-center text-center flex space-x-2'>
                            <Typography>Max:</Typography>
                            <InputNumber min={2} max={100} value={shiftCapacities[idx]}
                                onChange={(e) => {
                                    let newCapacities = [...shiftCapacities]
                                    newCapacities[idx] = e
                                    setShiftCapacities(newCapacities)
                                }}
                            />
                        </Box>
                    </div>
                ),
                dataIndex: ['data', 0, 'answer'],
                key: e.id,
                width: 200,
                render: (text, record, index) => {
                    return (
                        <p className='w-full items-center text-center m-0'>
                            {text?.includes(e.id) ? 'x' : ' '}
                        </p>
                    );
                },
            };
        }),
    ];

    return (
        <Box className="m-4 p-4 bg-white rounded-lg">
            <div className='w-full items-end text-end'>
                <Button onClick={handleModeChange}>
                    Chế độ: {mode === 'trial' ? 'Dùng thử' : 'Thực tế'}
                </Button>
            </div>
            {mode === 'trial' && (
                <Box className='w-full flex space-x-20'>
                    <Form layout='horizontal' className='flex space-x-10'>
                        <Form.Item label='Số lượng ứng viên'>
                            <InputNumber min={2} max={100} value={participantCount}
                                onChange={(e) => setParticipantCount(e)}
                            />
                        </Form.Item>
                        <Form.Item label='Số lượng kíp phỏng vấn'>
                            <InputNumber min={1} max={10} value={shiftCount}
                                onChange={(e) => setShiftCount(e)}
                            />
                        </Form.Item>
                    </Form>
                    <Button onClick={generateFakeData}>Tạo dữ liệu giả</Button>
                </Box>
            )}
            <Table bordered={true} dataSource={data?.answers} columns={columns} rowKey={(record) => record?.id} className='w-full' />

            <DndProvider backend={HTML5Backend}>
                {shifts.map((shift) => (
                    <Shift
                        key={shift.id}
                        id={shift.id}
                        title={shift.title}
                        candidates={shift.candidates}
                        onCandidateDrop={handleCandidateDrop}
                    />
                ))}
            </DndProvider>
        </Box>
    );
};

export default SplitInterview;
