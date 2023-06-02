import React from 'react';
import { useSelector } from 'react-redux';
import { Table, Modal, Descriptions } from 'antd';

import {clusterSelector} from '../../redux/selectors'
import { Box } from '@mui/material';

const ExcelTable = () => {
    const clusterData = useSelector(clusterSelector)
    const dataset =  clusterData.dataset
    const header = clusterData.header

    const handleRowClick = (record) => {
        Modal.info({
            title: "Data Detail",
            className: "min-w-[80vw] max-w-[90vw]",
            centered: true,
            content: (
                <Descriptions bordered className="w-full max-h-[80vh] overflow-auto" column={1}>
                    {
                        record.map((e, id) => (
                            <Descriptions.Item label={header[id]} key={id}>{e}</Descriptions.Item>
                        ))
                    }
                </Descriptions>
            ),
            onOk() { },
            onCancel() { },
        });
    };

    const columns = header.map((column, index) => ({
        title: column,
        dataIndex: index.toString(),
        key: index.toString(),
        ellipsis: true, // Giới hạn độ dài cột
        width: 200, // Độ rộng cột
        fixed: 'left' ? index == 0 : "",
        sorter: (a, b) => {
            if (!a[index]) {
                return false
            }
            if (!b[index]) {
                return true
            }
            return JSON.stringify(a[index]).localeCompare(JSON.stringify(b[index]))
        },
    }));

    return (
        <Box className="p-4 w-full max-w-[90vw]">
            <Table
                dataSource={dataset}
                columns={columns}
                className='cursor-pointer'
                rowKey={(record) => record[0]}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
                scroll={{
                    x: 200,
                }}
            />
        </Box>
    );
};

export default ExcelTable;
