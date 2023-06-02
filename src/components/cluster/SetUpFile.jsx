import React from 'react';
import { useSelector } from 'react-redux';

import { clusterSelector } from '../../redux/selectors';
import { List, Modal } from 'antd';
import { Box, Button, Grid, Typography } from '@mui/material';

const SetUpFile = () => {
    const clusterData = useSelector(clusterSelector)
    const dataset = clusterData.dataset
    const header = clusterData.header

    const handleDetailView = (data) => {
        console.log({data});
        Modal.info({
            title: "Column Data",
            className: "min-w-[80vw] max-w-[90vw]",
            centered: true,
            content: (
                <List
                    itemLayout="horizontal"
                    className='w-full max-h-[80vh] overflow-auto'
                    dataSource={data}
                    header={
                        <div className='w-full flex flex-col justify-center items-center'>
                            <Grid container>
                                <Grid item className='items-center flex justify-center p-2' xs={2}>
                                    <Typography variant='h6'>
                                        STT
                                    </Typography>
                                </Grid>
                                <Grid item className='items-center flex justify-center p-2' xs={10}>
                                    <Typography variant='h6'>
                                        Data
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    }
                    renderItem={(item, index) => (
                        <List.Item key={index}>
                            <Grid container>
                                <Grid item className='items-center flex justify-center p-2' xs={2}>
                                    <Typography variant='body1'>
                                        {index}
                                    </Typography>
                                </Grid>
                                <Grid item className='items-center flex justify-center p-2' xs={10}>
                                    <Typography variant='body1'>
                                        {item}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </List.Item>
                    )}
                />
            ),
            onOk() { },
            onCancel() { },
        });
    }

    return (
        <Box className="m-4 w-full">
            <List
                itemLayout="horizontal"
                dataSource={header}
                header={
                    <div className='w-full flex flex-col justify-center items-center'>
                        <Grid container>
                            <Grid item className='items-center p-2' xs={6}>
                                <Typography variant='h6'>
                                    Tên cột
                                </Typography>
                            </Grid>
                            <Grid item className='items-center flex justify-center p-2' xs={3}>
                                <Typography variant='h6'>
                                    Loại dữ liệu của cột
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
                }
                renderItem={({ title, type }, index) => {
                    const colDiffData = Array.from(new Set(dataset.map(e => e[index] || '')))
                    return (
                        <List.Item>
                            <Grid container>
                                <Grid item className='items-center p-2' xs={6}>
                                    <Typography variant='body1'>
                                        {title}
                                    </Typography>
                                </Grid>
                                <Grid item className='items-center flex justify-center p-2' xs={3}>
                                    {type}
                                </Grid>
                                <Grid item className='items-center flex justify-center p-2' xs={3}>
                                    <Button variant='outlined' onClick={() => handleDetailView(colDiffData)}>
                                        {colDiffData.length}
                                    </Button>
                                </Grid>
                            </Grid>
                        </List.Item>
                    )
                }}
            />
        </Box>
    );
}

export default SetUpFile;
