import { useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Button, Descriptions, Upload, Badge } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import * as XLSX from 'xlsx';

import { errorNotification } from '../../utils/notification';
import clusterSlice from './slice/clusterSlice';
import clusterFileSlice from './slice/clusterFileSlice';
import { clusterSelector, clusterFileSelector } from '../../redux/selectors';
import { formatFileSize, isEmailListValid } from '../../utils/file';
import clusteringSlice from './slice/clusteringSlice';
import clusterHistorySlice from './slice/clusterHistorySlice';


const UploadExcel = () => {
    const dispatch = useDispatch()
    const clusterFile = useSelector(clusterFileSelector)
    const files = clusterFile.file
    const file = files[0]
    const emailCol = clusterFile.emailCol
    const clusterData = useSelector(clusterSelector)
    const header = clusterData.header
    const collDiffData = clusterData.collDiffData

    console.log("re-render");

    // useEffect(() => {
    //     const saveInterval = setInterval(() => {
    //         sessionStorage.setItem("clusterFile", JSON.stringify(clusterFile))
    //         console.log("auto-save clusterFile");
    //     }, 3000);
    //     return () => {
    //         clearInterval(saveInterval)
    //     }
    // }, [clusterFile])

    const assignId = (data) => {
        const newData = data.map((e, id) => {
            if (id == 0) {
                return [{ title: "ID đánh tự động", disabled: true }, ...e]
            } else {
                return [id - 1, ...e]
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
            const formHeader = formData[0].map((e, idx) => ({
                id: idx,
                title: e?.title || e,
                type: "text",
                disabled: e?.disabled || false,
                weight: 0,
            }))
            const formBody = formData.slice(1)
            dispatch(clusterSlice.actions.setDataset(formBody));
            dispatch(clusterSlice.actions.setHeader(formHeader));
            dispatch(clusterSlice.actions.setVectorset({dataset: formBody.length, header: formHeader.length}))
            dispatch(clusterSlice.actions.setCollDiffData(
                formHeader.map((item, index) => Array.from(new Set(formBody.map(e => e[index] || ''))))
            ))
            dispatch(clusterFileSlice.actions.setFile({
                uid: v4(),
                name: file.name,
                status: 'done',
                size: file.size,
                type: file.type,
                numRow: formData.length - 1,
                numCol: formHeader.length
            }))
        };
        reader.readAsBinaryString(file.originFileObj);
    }

    const handleChange = ({ file }) => {
        if (![".xlsx", ".xls", ".sheet", "csv"].some(e => String(file.type).endsWith(e))) {
            errorNotification("Sai loại tệp", `Bạn không thể tải lên ${file.type} file`, "bottomRight")
            return
        }
        dispatch(clusterSlice.actions.clear())
        dispatch(clusterFileSlice.actions.clear())
        dispatch(clusteringSlice.actions.clear())
        dispatch(clusterHistorySlice.actions.clear())
        sessionStorage.removeItem("clusterData")
        sessionStorage.removeItem("clusterFile")
        sessionStorage.removeItem("clustering")
        sessionStorage.removeItem("clusterHistory")
        if (file.status == "removed") {
            return
        }
        handleDataset(file)
    };

    return (
        <Box className="m-4 flex w-full min-h-[50vh] flex-col items-center justify-center space-y-12">
            <Typography variant='body1'>
                Bản nháp được lưu 3 giây / lần
            </Typography>
            <Upload
                action={null}
                onChange={handleChange}
                maxCount={1}
                fileList={files}
            >
                <Button icon={<UploadOutlined />}>Nhấn để tải lên</Button>
            </Upload>
            {file &&
                <Box className="w-full">
                    <Typography variant='h6'>
                        Thông tin file excel
                    </Typography>
                    <Descriptions bordered className='shadow-md rounded-lg'>
                        <Descriptions.Item className='hover:bg-slate-100' label="Tên file">{file.name}</Descriptions.Item>
                        <Descriptions.Item className='hover:bg-slate-100' label="Số hàng">{file.numRow}</Descriptions.Item>
                        <Descriptions.Item className='hover:bg-slate-100' label="Số cột">{file.numCol}</Descriptions.Item>
                        <Descriptions.Item className='hover:bg-slate-100' label="Kích cỡ file">{formatFileSize(file.size)}</Descriptions.Item>
                        <Descriptions.Item className='hover:bg-slate-100' label="Loại file">{file.type}</Descriptions.Item>
                        <Descriptions.Item className='hover:bg-slate-100' label="Trạng thái">
                            <Badge status="processing" text={file.status} />
                        </Descriptions.Item>
                        <Descriptions.Item span={3} className='hover:bg-slate-100' label="Cột email liên lạc">
                            <Grid container>
                                <Grid item className='items-center flex justify-center p-2' xs={12} md={6}>
                                    <FormControl className='w-full'>
                                        <InputLabel id="el-email-label">Cột</InputLabel>
                                        <Select
                                            labelId="el-email-label"
                                            label="Cột"
                                            onChange={(e) => {
                                                if (isEmailListValid(collDiffData[header.findIndex(c => c.id == e.target.value)])) {
                                                    dispatch(clusterFileSlice.actions.setEmailCol(e.target.value))
                                                } else {
                                                    errorNotification("Cột không hợp lệ", "Cột chứa dữ liệu có định dạng khác email, hãy kiểm tra lại dữ liệu", "bottomRight")
                                                }
                                            }}
                                            value={emailCol || ``}
                                        >
                                            {header.map((el, key) => (
                                                <MenuItem key={key} value={el.id}>
                                                    {String(el.title).substring(0, 100)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item className='items-center flex p-2' xs={12} md={6}>
                                    <Typography variant='body2'>
                                        Cập nhật email để thực hiện chức năng gửi mail thông báo kết quả tự động (Không áp dụng trong khi dùng thử)
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Descriptions.Item>
                    </Descriptions>
                </Box>
            }
            <Typography variant='body1' component="i">
                (Lưu ý: Hệ thống tự động bỏ qua các dòng không có dữ liệu và các cột không có tiêu đề)
            </Typography>
        </Box>
    )
};
export default UploadExcel;