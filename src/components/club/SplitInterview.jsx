import React, { useEffect, useState } from 'react';
import { Button, Form, InputNumber, Table, Tag } from 'antd';
import { Box, Switch, Typography } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Shift from './Shift';
import { COLOR_REAL } from '../../utils/constant';
import { post } from '../../utils/request';

const SplitInterview = ({ m, rawData, rawShift }) => {
    const [mode, setMode] = useState(m || 'trial');
    const [participantCount, setParticipantCount] = useState(rawData ? (rawData?.answers || []).length : 50);
    const [shiftCount, setShiftCount] = useState(rawShift ? (rawShift || []).length : 3);
    const [shiftCapacities, setShiftCapacities] = useState([])
    const [data, setData] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [isAutoAdjust, setIsAutoAdjust] = useState(true)

    console.log("re-render");

    useEffect(() => {
        if (mode != 'trial' && rawData) {
            setData(rawData);
            let capacities = []
            for (let index = 0; index < shiftCount; index++) {
                capacities.push(Math.ceil(participantCount / shiftCount))
            }
            setShiftCapacities(capacities)
            setCandidates(rawData.answers.map((e) => ({ ...e.participant, answer: e.sections[0].data[0].answer })));
            let newShifts = rawShift.map((option) => ({
                id: option.id, title: option.name, candidates: (option.candidates || []).map(e => {
                    const temp = rawData.answers.find(p => p.participant_id == e)
                    return { ...temp.participant, answer: temp.sections[0].data[0].answer }
                })
            }))
            let unassignedCandidates = rawData.answers
                .map((answer) => answer.participant)
                .filter((e) => {
                    const a = newShifts.some((subArray) => {
                        return (subArray.candidates || []).includes(e.id)
                    })
                    return a
                });
            newShifts.push({ id: 'unassigned', title: 'Chưa phân kíp', candidates: unassignedCandidates })
            setShifts(newShifts)
            setShiftCapacities(rawShift.map(e => e.capacity))
        }
    }, [mode, rawData, rawShift])

    const generateFakeData = () => {
        const options = Array.from({ length: shiftCount }, (v, idx) => ({
            id: `option-${idx}`,
            value: `Kíp ${idx + 1}`,
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
                sections: [
                    {
                        data: [
                            {
                                answer: getRandomShifts(options),
                            },
                        ],
                    }
                ]
            })),
        };
        setData(fakeData);
        let capacities = []
        for (let index = 0; index < shiftCount; index++) {
            capacities.push(Math.ceil(participantCount / (shiftCount + 1)))
        }
        setShiftCapacities(capacities)
        setCandidates(fakeData.answers.map((e) => ({ ...e.participant, answer: e.sections[0].data[0].answer })));
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
        max = Math.floor(max + 1);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    const handleCandidateDrop = (candidateId, currentId, shiftId) => {
        const updatedShifts = shifts.map((shift) => {
            if (currentId == shiftId) {
                return shift
            }
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
                    <div className='w-full items-center justify-center text-center flex space-x-2'>
                        <Tag color={COLOR_REAL[idx % COLOR_REAL.length]}>{shiftName}</Tag>
                        {
                            mode == 'trial' ?
                                <Box className="w-fit flex items-center text-center space-x-2">
                                    <Typography>Max:</Typography>
                                    <InputNumber min={0} max={100} value={shiftCapacities[idx]}
                                        onChange={(e) => {
                                            let newCapacities = [...shiftCapacities]
                                            newCapacities[idx] = e
                                            setShiftCapacities(newCapacities)
                                        }}
                                    />
                                </Box> :
                                <Box>
                                    <Typography>Max: {shiftCapacities[idx]}</Typography>
                                </Box>
                        }
                    </div>
                ),
                dataIndex: ['sections', 0, 'data', 0, 'answer'],
                key: e.id,
                width: 200,
                render: (text, record, index) => {
                    return (
                        <Box className="w-full items-center text-center !h-[22px]">
                            {
                                text?.includes(e.id) ? <Tag className='items-center text-center' color={COLOR_REAL[idx % COLOR_REAL.length]}>x</Tag> : ' '
                            }
                        </Box>
                    );
                },
            };
        }),
    ];

    function convertData() {
        const o_shifts = shifts.slice(0, shifts.length - 1)
        const result = {};

        candidates.forEach((user) => {
            const binaryList = new Array(o_shifts.length).fill(0);

            user.answer.forEach((answer) => {
                const index = o_shifts.findIndex((ele) => ele.id === answer);
                if (index !== -1) {
                    binaryList[index] = 1;
                }
            });

            result[user.id] = binaryList;
        });

        return result;
    }

    const handleSplitInterview = async () => {
        const payload = convertData()
        try {
            const res = await post(`/recruit/interview/split?is_test=${mode == "trial" ? true : false}&auto_adjust=${isAutoAdjust}`, {
                n_per_shift: shiftCapacities,
                appointments_dict: payload,
                shifts: shifts.slice(0, shifts.length - 1),
            })
            if (res?.status_code == 200) {
                const updatedShifts = shifts.map((shift, idx) => ({
                    ...shift,
                    candidates: res?.data[idx].map(e => candidates.find(c => c.id == e))
                }));
                setShifts(updatedShifts);
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
        }
    }


    return (
        <Box className="m-4 p-4 bg-white rounded-lg">
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
                    <Button type='primary' onClick={generateFakeData}>Tạo dữ liệu giả</Button>
                </Box>
            )}
            <Table bordered={true} dataSource={data?.answers} columns={columns} rowKey={(record) => record?.id} className='w-full' />

            <Box className="my-2 w-full flex space-x-10 items-center">
                <Box className="flex items-center">
                    <Typography className=''>Tự động lấp đầy:</Typography>
                    <Switch
                        inputProps={{ 'aria-label': 'controlled' }}
                        checked={isAutoAdjust} onChange={(e) => setIsAutoAdjust(e.target.checked)}
                    />
                </Box>
                <Button type='primary' onClick={handleSplitInterview}>Phân kíp tự động</Button>
            </Box>
            <DndProvider backend={HTML5Backend}>
                <Box className="w-full flex">
                    {shifts.map((shift, idx) => (
                        <Shift
                            key={shift.id}
                            color={idx}
                            id={shift.id}
                            capacity={shiftCapacities[idx]}
                            title={shift.title}
                            candidates={shift.candidates}
                            onCandidateDrop={handleCandidateDrop}
                        />
                    ))}
                </Box>
            </DndProvider>
        </Box>
    );
};

export default SplitInterview;
