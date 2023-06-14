import React, { useEffect, useRef, useState } from 'react';
import { Descriptions, Empty, FloatButton, Modal, Table, Tag, Tooltip, Tour } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch, useSelector } from 'react-redux';

import { clusterSelector } from '../../redux/selectors';
import HeaderSetting from './HeaderSetting';
import ClusterSupervised from './ClusterSupervised';
import clusterSlice from './slice/clusterSlice'
import { CLUSTER_TYPE } from '../../utils/constant';
import { handleDownload } from '../../utils/excel';
import { COLOR } from '../../utils/constant';

const ClusterPrepare = () => {
    const dispatch = useDispatch()
    const clusterData = useSelector(clusterSelector)
    const header = clusterData.header
    const dataset = clusterData.dataset
    const supervisedSet = clusterData.supervisedSet
    const supervisedOptions = clusterData.supervisedOptions
    const selectedRecord = clusterData.selectedRecord
    const collDiffData = clusterData.collDiffData
    const [isTourOpen, setIsTourOpen] = useState(false);
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);
    const ref5 = useRef(null);
    const ref6 = useRef(null);

    console.log("re-render");

    const tourSteps = [
        {
            title: 'Cập nhật loại dữ liệu của từng cột',
            description: 'Bạn cần chọn kiểu giá trị của từng cột thuộc tính và đánh trọng số cho những thuộc tính sẽ dùng để phân cụm',
            target: () => ref1.current,
        },
        {
            title: 'Loại dữ liệu của cột',
            description: 'Chọn 1 trong 3 loại tương ứng',
            target: () => ref2.current,
        },
        {
            title: 'Đánh trọng số cho thuộc tính',
            description: 'Các trường thuộc tính có trọng số lớn hơn 0 sẽ được dùng để phân cụm theo độ lớn',
            target: () => ref3.current,
        },
        {
            title: 'Tạo tập giám sát',
            description: 'Người dùng định nghĩa số lượng phân cụm và tên của cụm',
            target: () => ref4.current,
        },
        {
            title: 'Chọn các bản ghi để phân cụm',
            description: 'Các bản ghi được chọn có thể đưa vào các tập giám sát',
            target: () => ref5.current,
        },
        {
            title: 'Chọn tập giám sát cho các bản ghi',
            description: 'Các bản ghi có cùng độ tương đồng có thể giám sát trước khi đặt chúng vào cùng 1 cụm',
            target: () => ref6.current,
        },
    ];

    // useEffect(() => {
    //     const saveInterval = setInterval(() => {
    //         sessionStorage.setItem("clusterData", JSON.stringify(clusterData))
    //         console.log("auto-save clusterData");
    //     }, 3000);
    //     return () => {
    //         clearInterval(saveInterval)
    //     }
    // }, [clusterData])

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
            title: <div className='w-full flex flex-col space-y-2'>
                <p>{item.title}</p>
                <p>{`(${CLUSTER_TYPE.find(e => e.value == item.type).label} / ${item.weight})`}</p>
            </div>,
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
        title: <p ref={ref6} className='items-center m-0'>Tập giám sát</p>,
        key: 'supervisedSet',
        fixed: 'right',
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
            return (
                <FormControl fullWidth>
                    <InputLabel id="el-supervised-set-label">Tập giám sát</InputLabel>
                    <Select
                        labelId="el-supervised-set-label"
                        id="el-supervised-set"
                        label="Tập giám sát"
                        value={supervisedSet[record[0]] || ``}
                        onChange={(e) => {
                            e.stopPropagation()
                            dispatch(clusterSlice.actions.setSupervisedSet({ index: record[0], supervisedSet: e.target.value }))
                        }}
                    >
                        <MenuItem key={""} value={``}>
                            Không
                        </MenuItem>
                        {supervisedOptions.map((tag, idx) => {
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
                                <MenuItem key={tag.id} value={tag.id}>
                                    {
                                        isLongTag ? (
                                            <Tooltip title={tag.value} key={tag.id}>
                                                {tagElem}
                                            </Tooltip>
                                        ) : (
                                            tagElem
                                        )
                                    }
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            )
        },
    }, {
        title: 'Thao tác',
        key: 'action',
        fixed: 'right',
        width: 100,
        render: (text, record, index) => (
            <Button variant='outlined' onClick={() => handleRowClick(record)}>Xem</Button>
        ),
    }]

    const onSelectChange = (values) => {
        dispatch(clusterSlice.actions.setSelectedRecord(values))
    };

    const rowSelection = {
        selectedRowKeys: selectedRecord,
        onChange: onSelectChange,
        columnWidth: 100,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_NONE,
        ],
        fixed: true,
    };

    return (
        <Box className="m-4 w-full space-y-12">
            <Typography variant='body1' className='w-full items-center text-center'>
                Bản nháp được lưu 3 giây / lần
            </Typography>
            <Box>
                <Typography variant='h6' ref={ref1}>
                    1. Cập nhật loại dữ liệu
                </Typography>
                <Typography variant='body1'>
                    {`Đã đánh trọng số ${header.filter(e => e.weight).length} bản ghi`}
                </Typography>
                <Box className="w-full shadow-md rounded-xl mt-2">
                    <div className='w-full flex flex-col justify-center items-center bg-slate-200 rounded-t-xl pr-4'>
                        <Grid container>
                            <Grid item className='items-center flex justify-center p-2' xs={6}>
                                <Typography variant='h6'>
                                    Tên cột
                                </Typography>
                            </Grid>
                            <Grid item className='items-center flex justify-center p-2' xs={1}>
                                <Typography variant='h6'>
                                    Giá trị
                                </Typography>
                            </Grid>
                            <Grid ref={ref2} item className='items-center flex justify-center p-2' xs={2}>
                                <Typography variant='h6'>
                                    Loại dữ liệu
                                </Typography>
                            </Grid>
                            <Grid ref={ref3} item className='items-center flex justify-center p-2' xs={3}>
                                <Typography variant='h6'>
                                    Trọng số phân cụm
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                    <Box className="w-full max-h-[60vh] overflow-auto">
                        {header.map((item, index) => {
                            return (
                                <div key={index} className='hover:bg-slate-100 border-b-2'>
                                    <HeaderSetting item={item} colDiffData={collDiffData[index]} />
                                </div>
                            )
                        })}
                        {header.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='p-4' />}
                    </Box>
                </Box>
            </Box>
            <Box className="w-full">
                <Typography variant='h6' ref={ref4}>
                    2. Tạo tập giám sát
                </Typography>
                <Typography variant='body1'>
                    (Tối thiểu 2, tối đa 10)
                </Typography>
                <ClusterSupervised />
                <Typography variant='body1' component="i">
                    Nhấn đúp để đổi tên
                </Typography>
            </Box>
            <Box className="w-full">
                <Typography variant='h6' ref={ref5}>
                    3. Chọn dữ liệu phân cụm
                </Typography>
                <Box className="w-full flex items-center justify-between">
                    <Typography variant='body1'>
                        {`Đã chọn ${selectedRecord.length} bản ghi (Giám sát ${selectedRecord.filter(e => supervisedSet[e]).length} bản ghi - Tỷ lệ ${selectedRecord.length > 0 ? 100 * Math.floor(selectedRecord.filter(e => supervisedSet[e]).length / selectedRecord.length * 100) / 100: 0}%)`}
                    </Typography>
                    <Button variant='contained' startIcon={<DownloadIcon />} onClick={() => { handleDownload(header.map(e => e.title), dataset, "PrepareDataset.xlsx") }}>
                        Tải xuống
                    </Button>
                </Box>
                <Table
                    dataSource={dataset}
                    columns={columns}
                    bordered
                    size='small'
                    className='cursor-pointer rounded-md shadow-lg'
                    rowSelection={rowSelection}
                    rowKey={(record) => record[0]}
                    scroll={{
                        x: 200,
                    }}
                />
            </Box>
            <Tour open={isTourOpen} onClose={() => setIsTourOpen(false)} steps={tourSteps} />
            <FloatButton
                icon={<QuestionCircleOutlined />}
                type="primary"
                onClick={() => setIsTourOpen(true)}
                tooltip="Guide"
                className='left-5'
            />
        </Box>
    );
}

export default ClusterPrepare;
