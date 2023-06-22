import React, { useState } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import { LoadingOutlined, PauseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Anchor, Collapse, Empty, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
const { Panel } = Collapse;

import { clusterSelector, processSelector } from '../../redux/selectors';
import ClusterInfoHistory from './ClusterInfoHistory';
import DeploymentLog from './DeploymentLog';
import ClusteringLog from './ClusteringLog';
import clusteringSlice from './slice/clusteringSlice';
import ClusteringMembership from './ClusteringMembership';
import ClusterChart from './ClusterChart';
import { LoadingButton } from '@mui/lab';
import ClusterPredLabel from './ClusterPredLabels';
import { checkDistinctElements } from '../../utils/cluster';

const Clustering = () => {
    const dispatch = useDispatch()
    const clusterData = useSelector(clusterSelector)
    const process = useSelector(processSelector)
    const error = clusterData.selectedRecord.length == 0 || clusterData.header.filter(item => item.weight).length == 0 || !checkDistinctElements(
        clusterData.selectedRecord.map(item => String(clusterData.dataset[item].filter((e, idx) => clusterData.header[idx].weight > 0)))
    )

    return (
        <Box className="m-4 w-full h-full flex flex-col items-center justify-start space-y-8">
            {/* <Typography variant='body1' className='w-full items-center text-center'>
                Bản nháp được lưu 3 giây / lần
            </Typography> */}
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <Box className="w-full mt-2 flex flex-col items-center justify-center space-y-12">
                        <Box id="clustering-1" className="w-full flex flex-col items-start space-y-4">
                            <Typography variant='h6' className='w-full items-center'>
                                1. Kiểm tra dữ liệu đầu vào
                            </Typography>
                            {error &&
                                <Typography variant='body1' component={"i"} className='text-red-500'>
                                    Không đủ thông tin đầu vào hoặc các bản ghi đầu vào không có giá trị khác nhau
                                </Typography>
                            }
                            <Collapse bordered={true} className="flex flex-col w-full items-center justify-center" defaultActiveKey={["clusterInput"]}>
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
                            <LoadingButton disabled={error} className='text-base' variant='contained' loading={process == 1 || process == 2} onClick={() => {
                                dispatch(clusteringSlice.actions.clear())
                                dispatch(clusteringSlice.actions.setProcess(1))
                            }}>Tiến hành phân cụm</LoadingButton>
                            <Collapse className='w-full' activeKey={[1, 2]}>
                                <Panel
                                    showArrow={false}
                                    header={
                                        <Box className="w-full flex items-center justify-between">
                                            <Typography variant='body1'>Trích xuất đặc trưng dữ liệu</Typography>
                                            {process == 1 && <LoadingOutlined className='text-blue-500 text-2xl' />}
                                            {process > 1 && <CheckCircleOutlined className='text-green-500 text-2xl' />}
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
                                            {process == 1 && <PauseCircleOutlined className='text-red-500 text-2xl' />}
                                            {process == 2 && <LoadingOutlined className='text-blue-500 text-2xl' />}
                                            {process == 3 && <CheckCircleOutlined className='text-green-500 text-2xl' />}
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
                            {
                                process == 3
                                    ?
                                    <ClusterPredLabel data={{ ...clusterData }} />
                                    :
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='w-full' />
                            }
                        </Box>
                        <Box id="clustering-4" className="w-full flex flex-col items-center justify-center h-full space-y-4">
                            <Typography variant='h6' className='w-full items-center'>
                                4. Thống kê kết quả
                            </Typography>
                            {
                                process == 3
                                    ?
                                    <>
                                        <ClusteringMembership data={{ ...clusterData }} />
                                        <ClusterChart data={{ ...clusterData }} />
                                    </>
                                    :
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='w-full' />
                            }
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
                            {
                                key: 'clustering-4',
                                href: '#clustering-4',
                                title: '4. Thống kê kết quả',
                            },
                        ]}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default Clustering;
