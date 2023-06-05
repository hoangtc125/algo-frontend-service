import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { LoadingOutlined, PauseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Empty, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
const { Meta } = Card;
const { Panel } = Collapse;

import { clusterSelector, processSelector } from '../../redux/selectors';
import ClusterInfoHistory from './ClusterInfoHistory';
import CLUSTER from '../../assets/images/cluster.png'
import { successNotification } from '../../utils/notification';
import DeploymentLog from './DeploymentLog';
import ClusteringLog from './ClusteringLog';
import clusteringSlice from './clusteringSlice';

const Clustering = () => {
    const dispatch = useDispatch()
    const clusterData = useSelector(clusterSelector)
    const [clusterHistory, setClusterHistory] = useState(JSON.parse(sessionStorage.getItem("clusterHistory")) || [])
    const [isShowInput, setIsShowInput] = useState(false)
    const process = useSelector(processSelector)
    const error = clusterData.selectedRecord.length == 0 || clusterData.header.filter(item => item.weight).length == 0

    const handleClustering = () => {
        const id = v4()
        const newHistory = [
            ...clusterHistory,
            {
                id,
                title: `Bản ghi ${id.substring(0, 8)}`,
                data: clusterData
            }
        ]
        setClusterHistory(newHistory)
        sessionStorage.setItem("clusterHistory", JSON.stringify(newHistory))
        successNotification("Lưu thành công", `Bản ghi ${id.substring(0, 8)}`, "bottomRight")
    }

    const handleViewHistory = (id) => {
        const record = clusterHistory.find(e => e.id == id)
        Modal.info({
            closable: true,
            title: record.title,
            centered: true,
            width: 1000,
            content: (
                <ClusterInfoHistory data={record.data} />
            ),
            okText: "Cancel",
        });
    }

    return (
        <Box className="m-4 w-full space-y-8">
            <Typography variant='body1' className='w-full items-center text-center'>
                Bản nháp được lưu 3 giây / lần
            </Typography>
            <Box className="w-full">
                <Typography variant='h6'>
                    1. Lịch sử phân cụm
                </Typography>
                {
                    clusterHistory.length > 0
                        ?
                        <Box className="p-4 w-full flex justify-center items-center flex-wrap">
                            {
                                clusterHistory.map(item => {
                                    return (
                                        <Card
                                            key={item.id}
                                            className='sm:w-52 w-72 shadow-lg m-2 lg:m-4'
                                            hoverable={true}
                                            cover={
                                                <img
                                                    alt="example"
                                                    src={CLUSTER}
                                                    className='p-2 shadow-md'
                                                />
                                            }
                                            onClick={() => { handleViewHistory(item.id) }}
                                        >
                                            <Meta
                                                className='h-6'
                                                title={item.title}
                                            />
                                        </Card>
                                    )
                                })
                            }
                        </Box>
                        :
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }
            </Box>
            <Box>
                <Typography variant='h6'>
                    2. Phân cụm mới
                </Typography>
                <Box className="w-full mt-2">
                    <Grid container spacing={2} className='min-h-[30vh]'>
                        <Grid item xs={isShowInput ? 4 : 2} className='w-full pr-2 border-r-2'>
                            {error &&
                                <Typography variant='body2' component={"i"} className='text-red-500'>
                                    Không đủ thông tin đầu vào
                                </Typography>
                            }
                            <Collapse bordered={true} className="flex flex-col w-full items-center justify-center" onChange={(key) => {
                                if (key && key.length) {
                                    setIsShowInput(true)
                                } else {
                                    setIsShowInput(false)
                                }
                            }}>
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
                        </Grid>
                        <Grid item xs={isShowInput ? 4 : 5} className='p-2 border-r-2'>
                            <Box className="w-full flex flex-col items-center justify-start h-full space-y-4">
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
                        </Grid>
                        <Grid item xs={isShowInput ? 4 : 5} className='p-2'>
                            <Box className="w-full flex flex-col items-center justify-start h-full space-y-4">
                                <Button className='text-base' type='default' onClick={handleClustering} disabled={process != 3}>Lưu bản ghi</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}

export default Clustering;
