import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import * as XLSX from 'xlsx';

import { errorNotification } from '../../utils/notification';
import clusterSlice from './clusterSlice';
import { clusterSelector } from '../../redux/selectors';
import { Box, Typography } from '@mui/material';


const UploadExcel = () => {
    const dispatch = useDispatch()
    const clusterData = useSelector(clusterSelector)
    const clusterFiles = clusterData.file

    console.log("re-render");

    const assignId = (data) => {
        const newData = data.map((e, id) => {
            if (id == 0) {
                return [{ title: "ID đánh tự động", disabled: true }, ...e]
            } else {
                return [v4(), ...e]
            }
        })
        return newData
    }

    const handleDataset = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const workbook = XLSX.read(event.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const headerRow = jsonData[0];
            const filteredData = jsonData.filter((row) => {
                return row.some((cell) => cell != '');
            }).map((row) => {
                let newRow = []
                for (let index = 0; index < row.length; index++) {
                    const element = row[index];
                    if (headerRow[index]) {
                        newRow.push(element)
                    }
                }
                return newRow
            });
            const formData = assignId(filteredData)
            dispatch(clusterSlice.actions.setDataset(formData.slice(1)));
            dispatch(clusterSlice.actions.setHeader(formData[0].map(e => ({
                id: v4(),
                title: e?.title || e,
                type: "text",
                disabled: e?.disabled || false,
                weight: 0,
            }))));
        };
        reader.readAsBinaryString(file);
    }

    const handleChange = ({ file }) => {
        if (![".xlsx", ".xls"].some(e => String(file.type).endsWith(e))) {
            errorNotification("Wrong type file", `You couldn't upload ${file.type} file`, "bottomRight")
            return
        }
        if (file.status == "removed") {
            dispatch(clusterSlice.actions.clear())
            return
        }
        dispatch(clusterSlice.actions.setFile({
            uid: v4(),
            name: file.name,
            status: 'uploading',
            size: file.size,
            type: file.type,
        }))
        handleDataset(file.originFileObj)
    };

    return (
        <Box className="flex flex-col items-center justify-center space-y-4">
            <Upload
                action={null}
                onChange={handleChange}
                maxCount={1}
                fileList={clusterFiles}
            >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <Typography variant='body1' component="i">
                (Lưu ý: Hệ thống tự động bỏ qua các dòng không có dữ liệu và các cột không có tiêu đề)
            </Typography>
        </Box>
    )
};
export default UploadExcel;