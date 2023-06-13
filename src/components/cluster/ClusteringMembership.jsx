import { Descriptions, Modal, Table, Tag, Tooltip } from 'antd';
import { Box, Typography } from '@mui/material';
import React from 'react';

import { COLOR } from '../../utils/constant';
import { useSelector } from 'react-redux';
import { clusterDatasetSelector, clusteringSelector } from '../../redux/selectors';

const ClusteringMembership = ({ data }) => {
    const hash = window.location.hash
    const selectedRecord = data.selectedRecord
    const supervisedOptions = data.supervisedOptions
    const supervisedSet = data.supervisedSet
    const dataset = hash == "#3" ? data.membership : useSelector(clusteringSelector).membership
    const clusterDataset = useSelector(clusterDatasetSelector)

    const columns = [{
        title: "Dữ liệu đầu vào",
        children: [
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
            }, {
                title: "ID của bản ghi",
                dataIndex: 0,
                key: 'selectedRecordId',
                fixed: 'left',
                width: 200,
                filterSearch: true,
                filters: selectedRecord.map(e => ({
                    text: e,
                    value: e,
                })),
                onFilter: (value, record) => value == record[0],
                sorter: (a, b) => {
                    return String(a[0]).localeCompare(b[0])
                }
            }
        ]
    }, {
        title: "Tỉ lệ phần trăm",
        children: supervisedOptions.map((tag, idx) => {
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
            return {
                title: (
                    isLongTag ? (
                        <Tooltip title={tag.value} key={tag.id} placement="bottom">
                            {tagElem}
                        </Tooltip>
                    ) : (
                        tagElem
                    )
                ),
                dataIndex: idx + 1,
                key: tag.id,
                ellipsis: true, // Giới hạn độ dài cột
                width: 200, // Độ rộng cột
                filterSearch: true,
                sorter: (a, b) => a[idx + 1] - b[idx + 1]
            }
        })
    }]

    const handleRowClick = (record) => {
        Modal.info({
            title: `Kết quả bản ghi ${record[0]}`,
            className: "min-w-[80vw] max-w-[90vw]",
            centered: true,
            content: (
                <Descriptions bordered className="w-full max-h-[80vh] overflow-auto">
                    {
                        record.map((e, id) => {
                            if (id == 0) {
                                return (
                                    <Descriptions.Item span={3} className='hover:bg-slate-100' label={columns[id]?.title} key={id}>{e}</Descriptions.Item>
                                )
                            } else {
                                const tag = supervisedOptions[id - 1]
                                const isLongTag = tag.value.length > 10;
                                const tagElem = (
                                    <Tag
                                        key={tag.id}
                                        className='text-sm'
                                        color={COLOR[id - 1]}
                                    >
                                        {isLongTag ? `${tag.value.slice(0, 10)}...` : tag.value}
                                    </Tag>
                                )
                                return (
                                    <Descriptions.Item span={3} className='hover:bg-slate-100' label={
                                        <Box className="w-full flex items-center space-x-4">
                                            <p className='m-0'>{columns[1]?.title}</p>
                                            {
                                                isLongTag ? (
                                                    <Tooltip title={tag.value} key={tag.id} placement="bottom">
                                                        {tagElem}
                                                    </Tooltip>
                                                ) : (
                                                    tagElem
                                                )
                                            }
                                        </Box>
                                    } key={id}>
                                        {e}
                                    </Descriptions.Item>
                                )
                            }
                        })
                    }
                </Descriptions>
            ),
            onOk() { },
            onCancel() { },
        });
    };

    return (
        <Box className="p-2 w-full space-y-4">
            <Box className="w-full space-y-2 flex flex-col items-center justify-center">
                <Typography variant='body1'>
                    Tỉ lệ thuộc các cụm của các bản ghi
                </Typography>
                <Table
                    dataSource={dataset}
                    columns={columns}
                    bordered
                    size='small'
                    className='w-full cursor-pointer rounded-md shadow-md'
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
            </Box>
        </Box>
    );
}

export default ClusteringMembership;
