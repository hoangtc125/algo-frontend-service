import React, { useEffect, useState } from 'react';
import { Card, Modal, Descriptions, Empty, FloatButton, Table, Tag, Tooltip } from 'antd';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import ClusterInfoHistory from './ClusterInfoHistory';
import { useDispatch, useSelector } from 'react-redux';
const { Meta } = Card;

import CLUSTER from '../../assets/images/cluster.png'
import { clusterHistorySelector, clusterSelector } from '../../redux/selectors';
import ClusteringMembership from './ClusteringMembership';
import ClusterChart from './ClusterChart';
import ClusterPredLabel from './ClusterPredLabels';
import { CLUSTER_TYPE, COLOR } from '../../utils/constant';
import clusterHistorySlice, { getAllCluster } from './slice/clusterHistorySlice';
import { errorNotification } from '../../utils/notification';
import { put } from '../../utils/request';

const ClusterHistory = ({ idRound, eventId, clubId }) => {
    const dispatch = useDispatch()
    const clusterData = useSelector(clusterSelector)
    const header = clusterData.header
    const dataset = clusterData.dataset
    const supervisedSet = clusterData.supervisedSet
    const supervisedOptions = clusterData.supervisedOptions
    const selectedRecord = clusterData.selectedRecord
    const collDiffData = clusterData.collDiffData
    const roundResults = clusterData.roundResults
    const clusterHistory = useSelector(clusterHistorySelector)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [record, setRecord] = useState()

    console.log(roundResults);

    useEffect(() => {
        if (idRound && eventId && clubId) {
            dispatch(getAllCluster({ idRound, eventId, clubId }))
        }

        return () => {
            dispatch(clusterHistorySlice.actions.clear())
        }
    }, [])

    const predRecords = dataset.map(e => {
        if (!record?.data?.predLabels) {
            return -1
        } else {
            const cluster = record?.data?.predLabels[record?.data?.predLoop] || []
            return cluster.findIndex(c => c.includes(String(e[0])))
        }
    })

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleViewHistory = (id) => {
        const record = clusterHistory.find(e => e.id == id)
        setRecord(record)
        setIsModalOpen(true);
    }

    const handleRowClick = (record) => {
        Modal.info({
            title: "Chi tiết bản ghi",
            className: "min-w-[80vw] max-w-[90vw]",
            centered: true,
            content: (
                <Descriptions bordered className="w-full max-h-[80vh] overflow-auto">
                    {
                        record.map((e, id) => (
                            <Descriptions.Item span={3} className='hover:bg-slate-100' label={header[id]?.title || "Tập giám sát"} key={id}>{e}</Descriptions.Item>
                        ))
                    }
                </Descriptions>
            ),
            onOk() { },
            onCancel() { },
        });
    };

    const columns = [...header.map((item, index) => {
        const colData = Array.from(new Set(dataset.map(e => e[index])))
        return {
            title: item.title,
            dataIndex: index.toString(),
            key: index.toString(),
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            filterSearch: true,
            filters: colData.map(e => (
                {
                    text: e,
                    value: e,
                }
            )),
            onFilter: (value, record) => String(record[index]).startsWith(value),
            sorter: (a, b) => {
                if (!a[index]) {
                    return false
                }
                if (!b[index]) {
                    return true
                }
                if (item.type == "numerical") {
                    return a[index] - b[index]
                } else {
                    return String(a[index]).localeCompare(String(b[index]))
                }
            },
        }
    }), {
        title: (
            <FormControl fullWidth>
                <InputLabel id="el-cluster_res-label">Kết quả phân cụm</InputLabel>
                <Select
                    labelId="el-cluster_res-label"
                    id="el-cluster_res"
                    label="Kết quả phân cụm"
                    value={record?.id || ``}
                    onChange={(e) => {
                        const record = clusterHistory.find(c => c.id == e.target.value)
                        console.log({ record });
                        setRecord(record)
                    }}
                >
                    <MenuItem key={""} value={``}>
                        Không
                    </MenuItem>
                    {clusterHistory.map((item, idx) => {
                        return (
                            <MenuItem key={item.id} value={item.id}>
                                {item.title}
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        ),
        key: 'clusteringResult',
        fixed: 'right',
        width: 200,
        render: (text, recordrow, index) => {
            const idx = predRecords[recordrow[0]]
            if (idx == -1) {
                return <></>
            }
            const tag = record?.data?.supervisedOptions[idx]
            const isLongTag = tag.value.length > 10;
            const tagElem = (
                <Tag
                    key={tag.id}
                    className='text-base'
                    color={COLOR[idx]}
                >
                    {isLongTag ? `${tag.value.slice(0, 10)}...` : tag.value}
                </Tag>
            )
            return (
                isLongTag ? (
                    <Tooltip title={tag.value} key={tag.id}>
                        {tagElem}
                    </Tooltip>
                ) : (
                    tagElem
                )
            )
        },
    }, {
        title: 'Đánh giá',
        key: 'approve',
        fixed: 'right',
        width: 200,
        render: (text, record, index) => (
            <FormControl fullWidth>
                <InputLabel id="el-approve-label">Đánh giá</InputLabel>
                <Select
                    labelId="el-approve-label"
                    id="el-approve"
                    label="Đánh giá"
                    defaultValue={roundResults[index]?.result}
                    onChange={async (e) => {
                        try {
                            const res = await put(`/recruit/participant/update?participant_id=${roundResults[index]?.id}&event_id=${eventId}`, {
                                approve: [e.target.value, false]
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
    }, {
        title: 'Thao tác',
        key: 'action',
        fixed: 'right',
        width: 100,
        render: (text, record, index) => (
            <Button variant='outlined' onClick={() => handleRowClick(record)}>Xem</Button>
        ),
    }]

    return (
        <Box className="w-full flex flex-col items-center justify-center min-h-[50vh]">
            <Typography variant='h6' className='w-full text-start'>
                Lịch sử phân cụm
            </Typography>
            {
                clusterHistory.length > 0
                    ?
                    <Box className="p-4 w-full flex justify-center items-center flex-wrap">
                        {
                            clusterHistory.map(item => {
                                return (
                                    <Card
                                        key={item.id}
                                        className='sm:w-52 w-72 shadow-lg m-2 lg:m-4'
                                        hoverable={true}
                                        cover={
                                            <img
                                                alt="example"
                                                src={CLUSTER}
                                                className='p-2 shadow-md'
                                            />
                                        }
                                        onClick={() => { handleViewHistory(item.id) }}
                                    >
                                        <Meta
                                            className='h-6'
                                            title={item.title}
                                        />
                                    </Card>
                                )
                            })
                        }
                    </Box>
                    :
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
            <Typography variant='h6' className='w-full text-start'>
                Đánh giá ứng viên
            </Typography>
            <Table
                dataSource={dataset}
                columns={columns}
                bordered
                size='small'
                className='cursor-pointer rounded-md shadow-lg w-full'
                rowKey={(record) => record[0]}
                scroll={{
                    x: 200,
                }}
            />
            <Modal centered width={1500} open={isModalOpen} onOk={handleOk} onCancel={handleOk} destroyOnClose={true}>
                <Box className="w-full flex flex-col items-center justify-center space-y-8">
                    <Box className="w-full flex flex-col items-start space-y-2 p-2">
                        <Typography variant='h6'>
                            Thông tin đầu vào
                        </Typography>
                        {
                            record &&
                            <ClusterInfoHistory data={record.data} />
                        }
                    </Box>
                    <Box className="w-full flex flex-col items-start space-y-2 p-2">
                        <Typography variant='h6'>
                            Kết quả phân cụm
                        </Typography>
                        {
                            record &&
                            <ClusterPredLabel data={record.data} />
                        }
                    </Box>
                    <Box className="w-full flex flex-col items-start space-y-2 p-2">
                        <Typography variant='h6'>
                            Thống kê phân cụm
                        </Typography>
                        {
                            record &&
                            <>
                                <ClusteringMembership data={record.data} />
                                <ClusterChart data={record.data} />
                            </>
                        }
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default ClusterHistory;
