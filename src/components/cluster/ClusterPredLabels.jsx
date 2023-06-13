import { Descriptions, Modal, Table, Tag, Tooltip } from 'antd';
import { Box, Button, Grid, Typography } from '@mui/material';
import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useDispatch, useSelector } from 'react-redux';

import { COLOR } from '../../utils/constant';
import { clusterDatasetSelector, clusteringSelector } from '../../redux/selectors';
import { handleDownloadMany } from '../../utils/excel';
import clusterSlice from './slice/clusterSlice';
import clusterHistorySlice from './slice/clusterHistorySlice';
import { successNotification } from '../../utils/notification';
import { v4 } from 'uuid';

const ClusterPredLabel = ({ data }) => {
    const hash = window.location.hash
    const dispatch = useDispatch()
    const supervisedOptions = data.supervisedOptions
    const supervisedSet = data.supervisedSet
    const header = data.header
    const selectedRecord = data.selectedRecord
    const clusteringData = useSelector(clusteringSelector)
    const predLabels = hash == "#3" ? data.predLabels : clusteringData.predLabels
    const membership = hash == "#3" ? data.membership : clusteringData.membership
    const clusterDataset = useSelector(clusterDatasetSelector)
    const dataset = predLabels.map(items => {
        return items.map(item => clusterDataset[item].filter((e, idx) => header[idx].weight > 0 || idx == 0))
    })

    const columns = [
        {
            title: 'Tập giám sát',
            key: 'supervisedSet',
            fixed: 'left',
            width: 200,
            filterSearch: true,
            filters: supervisedOptions.map((tag, idx) => {
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
                return {
                    text: (
                        isLongTag ? (
                            <Tooltip title={tag.value} key={tag.id}>
                                {tagElem}
                            </Tooltip>
                        ) : (
                            tagElem
                        )
                    ),
                    value: tag.id,
                }
            }),
            onFilter: (value, record) => value == supervisedSet[record[0]],
            sorter: (a, b) => {
                return String(supervisedSet[a[0]]).localeCompare(supervisedSet[b[0]])
            },
            render: (text, record, index) => {
                const idx = supervisedOptions.findIndex(e => e.id == supervisedSet[clusterDataset.findIndex(e => e[0] == record[0])])
                if (idx == -1) {
                    return <></>
                }
                const tag = supervisedOptions[idx]
                const isLongTag = tag.value.length > 10;
                const tagElem = (
                    <Tag
                        key={tag.id}
                        className='text-sm'
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
        }, ...header.filter((e, idx) => e.weight > 0 || idx == 0).map((item, index) => {
            return {
                title: item.title,
                dataIndex: index.toString(),
                key: index.toString(),
                ellipsis: true, // Giới hạn độ dài cột
                width: 200, // Độ rộng cột
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
        })
    ]

    const handleRowClick = (record) => {
        Modal.info({
            title: `Bản ghi ${record[0]}`,
            className: "min-w-[80vw] max-w-[90vw]",
            centered: true,
            content: (
                <Descriptions bordered className="w-full max-h-[80vh] overflow-auto">
                    {
                        clusterDataset[record[0]].map((e, id) => (
                            <Descriptions.Item span={3} className='hover:bg-slate-100' label={header[id]?.title || "Tập giám sát"} key={id}>{e}</Descriptions.Item>
                        ))
                    }
                </Descriptions>
            ),
            onOk() { },
            onCancel() { },
        });
    };

    const handleDownload = () => {
        handleDownloadMany(
            supervisedOptions.map((tag, id) => ({
                header: header.filter((e, idx) => e.weight > 0 || idx == 0).map(e => e.title),
                dataset: dataset[id],
                sheetName: tag.value,
            }))
        )
    }

    const handleReClustering = (records) => {
        dispatch(clusterSlice.actions.setSelectedRecord(records))
        window.scrollTo(0, 0);
        successNotification("Đã chọn các bản ghi này", "Nhấn Tiến hành phân cụm hoặc trở lại bước 2 để chuẩn bị lại dữ liệu", "bottomRight")
    }

    const handleSaveHistory = () => {
        const id = v4()
        const newHistory = {
            id,
            title: `Bản ghi ${id.substring(0, 8)}`,
            data: {
                header: header,
                supervisedOptions: supervisedOptions,
                supervisedSet: supervisedSet,
                selectedRecord: selectedRecord,
                predLabels: predLabels,
                membership: membership,
            }
        }
        dispatch(clusterHistorySlice.actions.pushHistory(newHistory))
        successNotification("Lưu thành công", `Bản ghi ${id.substring(0, 8)}`, "bottomRight")
    }

    return (
        <Box className="p-2 w-full flex flex-col space-y-4">
            <Box className="w-full flex justify-end items-center pr-2 space-x-2">
                <Button variant='contained' startIcon={<DownloadIcon />} onClick={handleDownload}>Tải xuống</Button>
                {
                    hash != "#3" &&
                    <Button variant='contained' onClick={handleSaveHistory} >Lưu bản ghi</Button>
                }
            </Box>
            {
                supervisedOptions.map((tag, id) => {
                    const isLongTag = tag.value.length > 10;
                    const tagElem = (
                        <Tag
                            key={tag.id}
                            className='text-sm'
                            color={COLOR[id]}
                        >
                            {isLongTag ? `${tag.value.slice(0, 10)}...` : tag.value}
                        </Tag>
                    )
                    return (
                        <Grid key={id} container className='w-full'>
                            <Grid item xs={2} className='w-full flex items-center text-center p-2'>
                                <Box className='flex flex-col w-full items-center text-center justify-center space-y-2'>
                                    {
                                        isLongTag ? (
                                            <Tooltip title={tag.value} key={tag.id} placement="bottom">
                                                {tagElem}
                                            </Tooltip>
                                        ) : (
                                            tagElem
                                        )
                                    }
                                    <Typography>
                                        {`(${dataset[id]?.length} ứng viên)`}
                                    </Typography>
                                    <Button variant='outlined' startIcon={<AutorenewIcon />} onClick={
                                        () => { handleReClustering(dataset[id].map(e => e[0])) }
                                    }>Phân cụm tiếp</Button>
                                </Box>
                            </Grid>
                            <Grid item xs={10} className='w-full flex items-center justify-center'>
                                <Tag
                                    className='w-full rounded-md px-1'
                                    color={COLOR[id]}
                                >
                                    <Table
                                        dataSource={dataset[id]}
                                        columns={columns}
                                        bordered
                                        size='small'
                                        className="w-full cursor-pointer rounded-md shadow-md bg-white"
                                        rowKey={(record) => record[0]}
                                        onRow={(record, rowIndex) => {
                                            return {
                                                onClick: (event) => { handleRowClick(record) }
                                            };
                                        }}
                                        scroll={{
                                            x: 200,
                                        }}
                                    />
                                </Tag>
                            </Grid>
                        </Grid>
                    )
                })
            }
        </Box>
    );
}

export default ClusterPredLabel;
