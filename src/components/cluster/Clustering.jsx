import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { LoadingOutlined, PauseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Anchor, Button, Collapse, Empty, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
const { Panel } = Collapse;

import { clusterSelector, processSelector } from '../../redux/selectors';
import ClusterInfoHistory from './ClusterInfoHistory';
import { successNotification } from '../../utils/notification';
import DeploymentLog from './DeploymentLog';
import ClusteringLog from './ClusteringLog';
import clusteringSlice from './clusteringSlice';
import clusterHistorySlice from './clusterHistorySlice';

const Clustering = () => {
    const dispatch = useDispatch()
    const clusterData = useSelector(clusterSelector)
    const process = useSelector(processSelector)
    const error = clusterData.selectedRecord.length == 0 || clusterData.header.filter(item => item.weight).length == 0

    const handleClustering = () => {
        const id = v4()
        const newHistory = {
            id,
            title: `Bản ghi ${id.substring(0, 8)}`,
            data: clusterData
        }
        dispatch(clusterHistorySlice.actions.pushHistory(newHistory))
        successNotification("Lưu thành công", `Bản ghi ${id.substring(0, 8)}`, "bottomRight")
    }

    return (
        <Box className="m-4 w-full h-full flex flex-col items-center justify-start space-y-8">
            <Typography variant='body1' className='w-full items-center text-center'>
                Bản nháp được lưu 3 giây / lần
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <Box className="w-full mt-2 flex flex-col items-center justify-center space-y-12">
                        <Box id="clustering-1" className="w-full flex flex-col items-start space-y-4">
                            <Typography variant='h6' className='w-full items-center'>
                                1. Kiểm tra dữ liệu đầu vào
                            </Typography>
                            {error &&
                                <Typography variant='body1' component={"i"} className='text-red-500'>
                                    Không đủ thông tin đầu vào
                                </Typography>
                            }
                            <Collapse bordered={true} className="flex flex-col w-full items-center justify-center">
                                <Panel
                                    header={
                                        <Typography variant='body1'>
                                            Đầu vào
                                        </Typography>
                                    }
                                    key="clusterInput"
                                    className='w-full'
                                >
                                    <ClusterInfoHistory data={{ ...clusterData }} />
                                </Panel>
                            </Collapse>
                        </Box>
                        <Box id="clustering-2" className="w-full flex flex-col items-center justify-center h-full space-y-4">
                            <Typography variant='h6' className='w-full items-center'>
                                2. Quá trình phân cụm
                            </Typography>
                            <Button disabled={error} className='text-base' type='default' loading={process == 1 || process == 2} onClick={() => {
                                dispatch(clusteringSlice.actions.clear())
                                dispatch(clusteringSlice.actions.setProcess(1))
                            }}>Tiến hành phân cụm</Button>
                            <Collapse className='w-full' activeKey={process == 1 ? 1 : (process >= 2 ? [1, 2] : [])}>
                                <Panel
                                    showArrow={false}
                                    header={
                                        <Box className="w-full flex items-center justify-between">
                                            <Typography variant='body1'>Trích xuất đặc trưng dữ liệu</Typography>
                                            {process == 1 && <LoadingOutlined />}
                                            {process > 1 && <CheckCircleOutlined />}
                                        </Box>
                                    }
                                    key="1"
                                >
                                    <DeploymentLog />
                                </Panel>
                                <Panel
                                    showArrow={false}
                                    header={
                                        <Box className="w-full flex items-center justify-between">
                                            <Typography variant='body1'>Phân cụm mờ bán giám sát sSMC-FCM</Typography>
                                            {process == 1 && <PauseCircleOutlined />}
                                            {process == 2 && <LoadingOutlined />}
                                            {process == 3 && <CheckCircleOutlined />}
                                        </Box>
                                    }
                                    key="2"
                                >
                                    <ClusteringLog />
                                </Panel>
                            </Collapse>
                        </Box>
                        <Box id="clustering-3" className="w-full flex flex-col items-center justify-center h-full space-y-4">
                            <Typography variant='h6' className='w-full items-center'>
                                3. Kết quả phân cụm
                            </Typography>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='w-full' />
                            <Button className='text-base' type='default' onClick={handleClustering} disabled={process != 3}>Lưu bản ghi</Button>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Anchor
                        items={[
                            {
                                key: 'clustering-1',
                                href: '#clustering-1',
                                title: '1. Kiểm tra dữ liệu đầu vào',
                            },
                            {
                                key: 'clustering-2',
                                href: '#clustering-2',
                                title: '2. Quá trình phân cụm',
                            },
                            {
                                key: 'clustering-3',
                                href: '#clustering-3',
                                title: '3. Kết quả phân cụm',
                            },
                        ]}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default Clustering;
