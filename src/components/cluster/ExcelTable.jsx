import React from 'react';
import { useSelector } from 'react-redux';
import { Table, Modal, Descriptions, Pagination } from 'antd';

import { clusterSelector } from '../../redux/selectors'
import { Box } from '@mui/material';

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

    const columns = header && header.map(({title, type}, index) => {
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

    return (
        <Box className="w-full max-w-[90vw] shadow-md">
            <Table
                dataSource={dataset}
                columns={columns}
                bordered
                className='m-4 cursor-pointer rounded-md'
                rowKey={(record) => record[0]}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
                scroll={{
                    x: 200,
                }}
                pagination={{
                    pageSize: 12,
                }}
            />
        </Box>
    );
};

export default ExcelTable;
