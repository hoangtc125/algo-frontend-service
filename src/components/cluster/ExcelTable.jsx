import React from 'react';
import { useSelector } from 'react-redux';
import { Table, Modal, Descriptions } from 'antd';
import { Box, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';

import { clusterSelector } from '../../redux/selectors'

const ExcelTable = () => {
    const clusterData = useSelector(clusterSelector)
    const dataset = clusterData.dataset
    const header = clusterData.header

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

    const columns = header && header.map(({ title, type }, index) => {
        const colData = Array.from(new Set(dataset.map(e => e[index])))
        return {
            title: `${title} (${type})`,
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

    return (
        <Box className="m-2 w-full max-w-[90vw] space-y-4">
            <Box className="w-full flex items-center justify-end">
                <Button variant='contained' startIcon={<DownloadIcon />} onClick={handleDownload}>
                    Download
                </Button>
            </Box>
            <Table
                dataSource={dataset}
                columns={columns}
                bordered
                className='cursor-pointer rounded-md shadow-lg'
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
    );
};

export default ExcelTable;
