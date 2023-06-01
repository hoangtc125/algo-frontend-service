import React, { useState } from 'react';
import { v4 } from 'uuid';
import { Table, Modal, Descriptions } from 'antd';
import * as XLSX from 'xlsx';

const ExcelTable = () => {
    const [data, setData] = useState(null);

    const assignId = (data) => {
        const newData = data.map((e, id) => {
            if (id == 0) {
                return ["STT", "ID", ...e]
            } else {
                return [id, v4(), ...e]
            }
        })
        return newData
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const workbook = XLSX.read(event.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setData(assignId(jsonData));
        };

        reader.readAsBinaryString(file);
    };

    const handleRowClick = (record) => {
        console.log({ record });
        Modal.info({
            title: "Data Detail",
            className: "min-w-[80vw] max-w-[90vw]",
            centered: true,
            content: (
                <Descriptions bordered className="w-full max-h-[80vh] overflow-auto">
                    {
                        record.map((e, id) => (
                            <Descriptions.Item span={3} label={data[0][id]} key={id}>{e}</Descriptions.Item>
                        ))
                    }
                </Descriptions>
            ),
            onOk() { },
            onCancel() { },
        });
    };

    const columns = data && data[0] && data[0].map((column, index) => ({
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
        <div>
            <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" />
            {data &&
                <Table
                    dataSource={data.slice(1)}
                    columns={columns}
                    className='max-w-[90vw] cursor-pointer'
                    rowKey={(record) => record[0]}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                    })}
                    scroll={{
                        x: 200,
                    }}
                />
            }
        </div>
    );
};

export default ExcelTable;
