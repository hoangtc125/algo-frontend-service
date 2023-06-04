import React, { useMemo } from 'react';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Badge, Descriptions } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { clusterSelector } from '../../redux/selectors';
import HeaderSetting from './HeaderSetting';
import { formatFileSize, isEmailListValid } from '../../utils/file';
import clusterSlice from './clusterSlice';
import { errorNotification } from '../../utils/notification';

const SetUpFile = () => {
    const dispatch = useDispatch()
    const clusterData = useSelector(clusterSelector)
    const header = clusterData.header
    const file = clusterData.file[0]
    const dataset = clusterData.dataset
    const nameCol = clusterData.nameCol
    const emailCol = clusterData.emailCol

    const collDiffDatas = useMemo(() => {
        console.log("re-compute");
        return header.map((item, index) => Array.from(new Set(dataset.map(e => e[index] || ''))))
    }, [clusterData.file])

    console.log("re-render");

    return (
        <Box className="m-4 w-full space-y-8">
            <Box>
                <Typography variant='h6'>
                    1. Thông tin file excel
                </Typography>
                <Descriptions bordered className='shadow-md rounded-lg'>
                    <Descriptions.Item className='hover:bg-slate-100' label="Tên file">{file.name}</Descriptions.Item>
                    <Descriptions.Item className='hover:bg-slate-100' label="Số hàng">{dataset.length}</Descriptions.Item>
                    <Descriptions.Item className='hover:bg-slate-100' label="Số cột">{header.length}</Descriptions.Item>
                    <Descriptions.Item className='hover:bg-slate-100' label="Kích cỡ file">{formatFileSize(file.size)}</Descriptions.Item>
                    <Descriptions.Item className='hover:bg-slate-100' label="Loại file">{file.type}</Descriptions.Item>
                    <Descriptions.Item className='hover:bg-slate-100' label="Trạng thái">
                        <Badge status="processing" text={file.status} />
                    </Descriptions.Item>
                    <Descriptions.Item span={3} className='hover:bg-slate-100' label="Cột họ tên">
                        <Grid container>
                            <Grid item className='items-center flex justify-center p-2' xs={12} md={6}>
                                <FormControl className='w-full'>
                                    <InputLabel id="el-name-label">Cột</InputLabel>
                                    <Select
                                        labelId="el-name-label"
                                        label="Cột"
                                        onChange={(e) => { dispatch(clusterSlice.actions.setNameCol(e.target.value)) }}
                                        value={nameCol || ``}
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

                                </Typography>
                            </Grid>
                        </Grid>
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
                                            if (isEmailListValid(collDiffDatas[header.findIndex(c => c.id == e.target.value)])) {
                                                dispatch(clusterSlice.actions.setEmailCol(e.target.value))
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
            <Box>
                <Typography variant='h6'>
                    2. Cập nhật loại dữ liệu
                </Typography>
                <Box className="w-full shadow-md rounded-xl">
                    <div className='w-full flex flex-col justify-center items-center bg-slate-200 rounded-t-xl'>
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
                            <Grid item className='items-center flex justify-center p-2' xs={2}>
                                <Typography variant='h6'>
                                    Loại dữ liệu
                                </Typography>
                            </Grid>
                            <Grid item className='items-center flex justify-center p-2' xs={3}>
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
                                    <HeaderSetting item={item} colDiffData={collDiffDatas[index]} />
                                </div>
                            )
                        })}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default SetUpFile;
