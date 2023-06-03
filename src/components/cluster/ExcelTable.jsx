import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Modal, Descriptions } from 'antd';
import { Box, Button, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';

import { clusterSelector } from '../../redux/selectors'

const ExcelTable = () => {
    const clusterData = useSelector(clusterSelector)
    const header = clusterData.header.map((e, idx) => ({...e, index: idx})).filter((e, idx) => {
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
            title: "Data Detail",
            className: "min-w-[80vw] max-w-[90vw]",
            centered: true,
            content: (
                <Descriptions bordered className="w-full max-h-[80vh] overflow-auto" column={1}>
                    {
                        record.map((e, id) => (
                            <Descriptions.Item className='hover:bg-slate-100' label={header[id].title} key={id}>{e}</Descriptions.Item>
                        ))
                    }
                </Descriptions>
            ),
            onOk() { },
            onCancel() { },
        });
    };

    const columns = header && header.map((item, index) => {
        const colData = Array.from(new Set(dataset.map(e => e[index])))
        return {
            title: `${item.title} (${item.type} | ${item.weight})`,
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
                if (type == "numerical") {
                    return a[index] - b[index]
                } else {
                    return String(a[index]).localeCompare(String(b[index]))
                }
            },
        }
    });

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
                    Chọn dữ liệu phân cụm
                </Typography>
                <Box className="w-full flex items-center justify-between">
                    <Typography variant='body1'>
                        {`Selected ${selectedRowKeys.length} items`}
                    </Typography>
                    <Button variant='contained' startIcon={<DownloadIcon />} onClick={handleDownload}>
                        Download
                    </Button>
                </Box>
                <Table
                    dataSource={dataset}
                    columns={columns}
                    bordered
                    className='cursor-pointer rounded-md shadow-lg'
                    rowSelection={rowSelection}
                    rowKey={(record) => record[0]}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                    })}
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
