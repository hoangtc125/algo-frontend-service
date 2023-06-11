import { Descriptions, Modal, Table, Tag, Tooltip } from 'antd';
import { Box, Grid } from '@mui/material';
import React from 'react';

import { COLOR } from '../../utils/constant';
import { useSelector } from 'react-redux';
import { clusterDatasetSelector, clusteringSelector } from '../../redux/selectors';

const ClusterPredLabel = ({ data }) => {
    const selectedRecord = data.selectedRecord
    const supervisedOptions = data.supervisedOptions
    const supervisedSet = data.supervisedSet
    const header = data.header
    // .map(e => {
    //     if (e.weight > 0 || e.id == 0) {
    //         return e
    //     }
    // })
    // .filter(e => e)
    const predLabels = useSelector(clusteringSelector).predLabels
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

    return (
        <Box className="p-2 w-full flex flex-col space-y-4">
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
                    const dataChart = dataset.map(e => ({
                        id: e[0],
                        value: e[id + 1]
                    }))
                    return (
                        <Grid key={id} container className='w-full'>
                            <Grid item xs={1} className='flex w-full items-center text-center justify-center'>
                                {
                                    isLongTag ? (
                                        <Tooltip title={tag.value} key={tag.id} placement="bottom">
                                            {tagElem}
                                        </Tooltip>
                                    ) : (
                                        tagElem
                                    )
                                }
                            </Grid>
                            <Grid item xs={11} className='w-full flex items-center justify-center'>
                                <Table
                                    dataSource={dataset[id]}
                                    columns={columns}
                                    bordered
                                    size='small'
                                    className='w-full cursor-pointer rounded-md shadow-md p-2'
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
                            </Grid>
                        </Grid>
                    )
                })
            }
        </Box>
    );
}

export default ClusterPredLabel;
