import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Affix, Steps } from 'antd';

import UploadExcel from './UploadExcel';
import ClusterPrepare from './ClusterPrepare';
import Clustering from './Clustering';
import ClusterHistory from './ClusterHistory';
import { CLUSTER_FILE_PROCESS } from '../../utils/constant';
import clusterSlice from './slice/clusterSlice';
import clusterFileSlice from './slice/clusterFileSlice';
import clusteringSlice from './slice/clusteringSlice';
import clusterHistorySlice from './slice/clusterHistorySlice';

const steps = [
    {
        title: 'Tải lên File Excel',
        description: 'Chuẩn bị tập dữ liệu tuyển thành viên',
    },
    {
        title: 'Chuẩn bị phân cụm dữ liệu',
        description: 'Cấu hình thông số',
    },
    {
        title: 'Tiến hành phân cụm',
        description: 'Dựa trên dữ liệu ở bước 2',
    },
    {
        title: 'Lịch sử phân cụm',
        description: 'Các bản ghi phân cụm ở bước 3',
    },
]

const TryCluster = () => {
    const dispatch = useDispatch()
    const hash = String(window.location.hash)
    const [current, setCurrent] = useState(hash ? parseInt(hash.split("#")[1]) || 2 : 0);

    useEffect(() => {
        return () => {
            dispatch(clusterSlice.actions.clear())
            dispatch(clusterFileSlice.actions.clear())
            dispatch(clusteringSlice.actions.clear())
            dispatch(clusterHistorySlice.actions.clear())
            sessionStorage.removeItem("clusterData")
            sessionStorage.removeItem("clusterFile")
            sessionStorage.removeItem("clustering")
            sessionStorage.removeItem("clusterHistory")
        }
    }, [])

    const onChange = (value) => {
        window.location.hash = value
        setCurrent(value)
    };

    const next = () => {
        const value = current + 1
        window.location.hash = value
        setCurrent(value);
    };

    const prev = () => {
        const value = current - 1
        window.location.hash = value
        setCurrent(value);
    };

    return (
        <Box className='m-4 shadow-md flex items-center flex-col space-y-4 bg-white rounded-md p-4 min-h-[80vh]'>
            <Steps
                type="navigation"
                current={current}
                onChange={onChange}
                className="site-navigation-steps bg-white w-full shadow-md"
                items={steps}
            />
            <Grid container className='w-full'>
                {/* <Grid item xs={2}>
                    <Affix>
                        <Box className='h-screen p-8 pl-0 pt-4 flex flex-col justify-start space-y-4'>
                            <Typography variant='h6'>
                                Tiến độ thực hiện
                            </Typography>
                            <Steps
                                className='flex-1'
                                direction='vertical'
                                percent={100}
                                items={CLUSTER_FILE_PROCESS}
                            />
                        </Box>
                    </Affix>
                </Grid> */}
                <Grid item xs={12}>
                    <Box className="min-h-[60vh]">
                        {
                            current == 0 &&
                            <Box className={`w-full h-full flex flex-col items-center justify-center`}>
                                <UploadExcel />
                            </Box>
                        }
                        {
                            current == 1 &&
                            <Box className={`w-full h-full flex flex-col items-center justify-center`}>
                                <ClusterPrepare />
                            </Box>
                        }
                        {
                            current == 2 &&
                            <Box className={`w-full h-full flex flex-col items-center justify-center`}>
                                <Clustering />
                            </Box>
                        }
                        {
                            current == 3 &&
                            <Box className={`w-full h-full flex flex-col items-center justify-center`}>
                                <ClusterHistory />
                            </Box>
                        }
                    </Box>
                    <Box className="w-full flex items-center justify-center space-x-4">
                        {current > 0 && (
                            <Button
                                onClick={() => prev()}
                                variant='contained'
                            >
                                Quay lại
                            </Button>
                        )}
                        {current < steps.length - 1 && (
                            <Button variant='contained' onClick={() => next()}>
                                Tiếp tục
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
export default TryCluster;