import React, { useMemo } from 'react';
import { List } from 'antd';
import { Box, Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import { clusterSelector } from '../../redux/selectors';
import HeaderSetting from './HeaderSetting';


const SetUpFile = () => {
    const clusterData = useSelector(clusterSelector)
    const header = clusterData.header

    const collDiffDatas = useMemo(() => {
        console.log("re-compute");
        return header.map((item, index) => Array.from(new Set(clusterData.dataset.map(e => e[index] || ''))))
    }, [clusterData.file])

    console.log("re-render");

    return (
        <Box className="m-4 w-full">
            <div className='w-full flex flex-col justify-center items-center sticky'>
                <Grid container>
                    <Grid item className='items-center p-2' xs={6}>
                        <Typography variant='h6'>
                            Tên cột
                        </Typography>
                    </Grid>
                    <Grid item className='items-center flex justify-center p-2' xs={3}>
                        <Typography variant='h6'>
                            Loại dữ liệu
                        </Typography>
                    </Grid>
                    <Grid item className='items-center flex justify-center p-2' xs={3}>
                        <div className='w-full flex flex-col justify-center items-center'>
                            <Typography variant='h6'>
                                Số giá trị khác nhau
                            </Typography>
                            <Typography variant='body2'>
                                (Nhấn để xem chi tiết)
                            </Typography>
                        </div>
                    </Grid>
                </Grid>
            </div>
            <Box className="m-4 w-full max-h-[80vh] overflow-auto">

                <List
                    itemLayout="horizontal"
                    dataSource={header}
                    renderItem={(item, index) => {
                        return (
                            <List.Item>
                                <HeaderSetting item={item} colDiffData={collDiffDatas[index]} />
                            </List.Item>
                        )
                    }}
                />
            </Box>
        </Box>
    );
}

export default SetUpFile;
