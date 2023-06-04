import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Modal, Descriptions } from 'antd';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';

import { clusterSelector } from '../../redux/selectors'
import { CLUSTER_TYPE } from '../../utils/constant';
import ClusterSupervised from './clusterSupervised';
import clusterSlice from './clusterSlice';

const ExcelTable = () => {
    const dispatch = useDispatch()
    const clusterData = useSelector(clusterSelector)
    const header = clusterData.header.map((e, idx) => ({ ...e, index: idx })).filter((e, idx) => {
        if (idx == 0) {
            return true
        }
        return e.weight > 0
    })
    const dataset = clusterData.dataset.map(e => {
        let row = []
        for (let index = 0; index < header.length; index++) {
            const element = header[index];
            row.push(e[element.index])
        }
        return row
    })
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
                            <Descriptions.Item span={3} className='hover:bg-slate-100' label={header[id]?.title || "Tập quan sát"} key={id}>{e}</Descriptions.Item>
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
        title: 'Tập quan sát',
        key: 'supervisedSet',
        fixed: 'right',
        width: 200,
        render: (text, record, index) => (
            <FormControl fullWidth>
                <InputLabel id="el-supervised-set-label">Tập quan sát</InputLabel>
                <Select
                    labelId="el-supervised-set-label"
                    id="el-supervised-set"
                    label="Type"
                    value={clusterData.supervisedSet[index] || ``}
                    onChange={(e) => {
                        e.stopPropagation()
                        dispatch(clusterSlice.actions.setSupervisedSet({index: index, supervisedSet: e.target.value}))
                        console.log(e.target.value);
                    }}
                >
                    <MenuItem key={""} value={``}>
                        Không
                    </MenuItem>
                    {clusterData.supervisedOptions.map((el, key) => (
                        <MenuItem key={key} value={el}>
                            {el}
                        </MenuItem>
                    ))}
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

    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }

    const handleDownload = () => {
        const newWorkbook = XLSX.utils.book_new();
        const newWorksheet = XLSX.utils.aoa_to_sheet([header.map(e => e.title), ...dataset]);
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet 1');
        const excelData = XLSX.write(newWorkbook, { type: 'binary', bookType: 'xlsx' });
        const blobData = new Blob([s2ab(excelData)], { type: 'application/octet-stream' });
        const downloadUrl = URL.createObjectURL(blobData);
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = 'dataset.xlsx';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        columnWidth: 100,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_NONE,
        ],
        fixed: true,
    };

    return (
        <Box className="m-4 w-full flex flex-col items-center justify-center max-w-[90vw] space-y-8">
            <Box className="w-full">
                <Typography variant='h6'>
                    1. Tạo tập quan sát
                </Typography>
                <ClusterSupervised />
            </Box>
            <Box className="w-full">
                <Typography variant='h6'>
                    2. Chọn dữ liệu phân cụm
                </Typography>
                <Box className="w-full flex items-center justify-between">
                    <Typography variant='body1'>
                        {`Đã chọn ${selectedRowKeys.length} bản ghi`}
                    </Typography>
                    <Typography variant='body1'>
                        Bảng chỉ hiện thị các cột có trọng số khi phân cụm
                    </Typography>
                    <Button variant='contained' startIcon={<DownloadIcon />} onClick={handleDownload}>
                        Tải xuống
                    </Button>
                </Box>
                <Table
                    dataSource={dataset}
                    columns={columns}
                    bordered
                    className='cursor-pointer rounded-md shadow-lg'
                    rowSelection={rowSelection}
                    rowKey={(record) => record[0]}
                    scroll={{
                        x: 200,
                    }}
                    pagination={{
                        pageSize: 10,
                    }}
                />
            </Box>
        </Box>
    );
};

export default ExcelTable;
