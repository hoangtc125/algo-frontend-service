import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Descriptions, Empty, Modal, Space, Table, Tag, Tooltip } from 'antd';
import DownloadIcon from '@mui/icons-material/Download';

import { COLOR } from '../../utils/constant';
import { handleDownload } from '../../utils/excel';
import { useSelector } from 'react-redux';
import { clusterDatasetSelector } from '../../redux/selectors';

const ClusterInfoHistory = ({ data }) => {
    const clusterDataset = useSelector(clusterDatasetSelector)
    const header = data.header
    const supervisedOptions = data.supervisedOptions
    const dataset = data.selectedRecord.map(e => clusterDataset.find(d => d[0] == e))
    const supervisedSet = data.selectedRecord.map(e => data.supervisedSet[clusterDataset.findIndex(d => d[0] == e)])

    console.log("re-render");

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

    const columns = [{
        title: 'Tập giám sát',
        key: 'supervisedSet',
        fixed: 'left',
        width: 120,
        render: (text, record, index) => {
            const idx = supervisedOptions.findIndex(e => e.id == supervisedSet[dataset.findIndex(e => e == record)])
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
    }, ...header.map((item, index) => {
        const colData = Array.from(new Set(dataset.map(e => e[index])))
        return {
            title: item.title,
            dataIndex: index.toString(),
            key: index.toString(),
            ellipsis: true, // Giới hạn độ dài cột
            width: 120, // Độ rộng cột
        }
    })]

    return (
        <Box className="p-2 w-full space-y-4">
            <Box className="w-full space-y-2">
                <Typography variant='body1'>
                    {`a. Số lượng trường thông tin (${header.filter(item => item.weight).length})`}
                </Typography>
                <Box className="w-full shadow-md rounded-xl mt-2">
                    <div className='w-full flex flex-col justify-center items-center bg-slate-200 rounded-t-xl pr-4'>
                        <Grid container>
                            <Grid item className='items-center flex justify-center p-2' xs={6}>
                                <Typography variant='body1'>
                                    Tên cột
                                </Typography>
                            </Grid>
                            <Grid item className='items-center flex justify-center p-2' xs={3}>
                                <Typography variant='body1'>
                                    Loại
                                </Typography>
                            </Grid>
                            <Grid item className='items-center flex justify-center p-2' xs={3}>
                                <Typography variant='body1'>
                                    Trọng số
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                    <Box className="w-full max-h-[40vh] overflow-auto">
                        {header
                            .filter(item => item.weight)
                            .map((item, index) => {
                                return (
                                    <div key={index} className='hover:bg-slate-100 border-b-2'>
                                        <Grid container>
                                            <Grid item className='items-center flex justify-center p-2' xs={6}>
                                                <Typography variant='body1'>
                                                    {item.title}
                                                </Typography>
                                            </Grid>
                                            <Grid item className='items-center flex justify-center p-2' xs={3}>
                                                <Typography variant='body1'>
                                                    {item.type}
                                                </Typography>
                                            </Grid>
                                            <Grid item className='items-center flex justify-center p-2' xs={3}>
                                                <Typography variant='body1'>
                                                    {item.weight}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </div>
                                )
                            })}
                        {header.filter(item => item.weight).length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='p-4' />}
                    </Box>
                </Box>
            </Box>
            <Box className="w-full space-y-2">
                <Typography variant='body1'>
                    {`b. Số lượng cụm (${supervisedOptions.length})`}
                </Typography>
                <Space wrap size={10}>
                    {supervisedOptions.map((tag, idx) => {
                        const isLongTag = tag.value.length > 20;
                        const tagElem = (
                            <Tag
                                key={tag.id}
                                className='text-base'
                                color={COLOR[idx]}
                            >
                                {isLongTag ? `${tag.value.slice(0, 20)}...` : tag.value}
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
                    })}
                </Space>
            </Box>
            <Box className="w-full space-y-2">
                <Typography variant='body1'>
                    {`c. Số lượng bản ghi (${dataset.length})`}
                </Typography>
                <Box className="w-full flex items-center justify-end">
                    <Button variant='contained' startIcon={<DownloadIcon />} onClick={() => { handleDownload(header.map(e => e.title), dataset, "ClusterDataset.xlsx") }}>
                        Tải xuống
                    </Button>
                </Box>
                <Table
                    dataSource={dataset}
                    columns={columns}
                    bordered
                    size='small'
                    className='cursor-pointer rounded-md shadow-lg'
                    rowKey={(record) => record[0]}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => { handleRowClick(record) }
                        };
                    }}
                    scroll={{
                        x: 120,
                    }}
                />
            </Box>
        </Box>
    );
}

export default ClusterInfoHistory;
