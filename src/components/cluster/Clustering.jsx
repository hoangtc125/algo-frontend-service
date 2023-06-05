import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Card, Empty, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { v4 } from 'uuid';
const { Meta } = Card;

import { clusterSelector } from '../../redux/selectors';
import ClusterInfoHistory from './ClusterInfoHistory';
import CLUSTER from '../../assets/images/cluster.png'
import { successNotification } from '../../utils/notification';

const Clustering = () => {
    const clusterData = useSelector(clusterSelector)
    const [clusterHistory, setClusterHistory] = useState(JSON.parse(sessionStorage.getItem("clusterHistory")) || [])

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
            width:1000,
            content: (
                <ClusterInfoHistory data={record.data} />
            ),
            okText: "Cancel",
        });
    }

    return (
        <Box className="m-4 w-full space-y-12">
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
                        <Box className="p-4 w-full flex justify-start items-start flex-wrap">
                            {
                                clusterHistory.map(item => {
                                    return (
                                        <Card
                                            key={item.id}
                                            className='sm:w-52 w-72 shadow-lg m-4 lg:m-8'
                                            hoverable={true}
                                            cover={
                                                <img
                                                    alt="example"
                                                    src={CLUSTER}
                                                    className='p-2'
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
                        <Empty />
                }
            </Box>
            <Box>
                <Typography variant='h6'>
                    2. Phân cụm mới
                </Typography>
                <Box className="w-full min-h-[30vh] relative mt-2">
                    <Grid container spacing={2} className='h-full'>
                        <Grid item xs={6} className='pr-2 w-full border-r-2'>
                            <Box className="flex flex-col w-full items-center justify-center">
                                <Typography variant='body1'>
                                    Đầu vào
                                </Typography>
                                <ClusterInfoHistory data={clusterData} />
                            </Box>
                        </Grid>
                        <Grid item xs={6} className='p-2'>
                            <Box className="w-full flex flex-col items-center justify-start h-full space-y-4">
                                <Button variant='contained'>Tiến hành phân cụm</Button>
                                <Button variant='contained' onClick={handleClustering}>Lưu bản ghi</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}

export default Clustering;
