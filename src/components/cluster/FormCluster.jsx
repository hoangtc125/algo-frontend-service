import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Affix, Steps } from 'antd';

import UploadExcel from './UploadExcel';
import ClusterPrepare from './ClusterPrepare';
import Clustering from './Clustering';
import ClusterHistory from './ClusterHistory';
import clusterSlice from './slice/clusterSlice';
import clusterFileSlice from './slice/clusterFileSlice';
import clusteringSlice from './slice/clusteringSlice';
import clusterHistorySlice from './slice/clusterHistorySlice';

const steps = [
    {
        title: 'Dữ liệu ',
        description: 'Đơn tuyển thành viên',
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
        title: 'Đánh giá ứng viên',
        description: 'Lịch sử phân cụm',
    },
]

const FormCluster = ({ idRound, eventId, clubId }) => {
    const dispatch = useDispatch()
    const hash = String(window.location.hash)
    const [current, setCurrent] = useState(hash ? parseInt(hash.split("#")[1]) || 2 : 1);

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
                <Grid item xs={12}>
                    <Box className="min-h-[60vh]">
                        {
                            current == 1 &&
                            <Box className={`w-full h-full flex flex-col items-center justify-center`}>
                                <ClusterPrepare idRound={idRound} eventId={eventId} clubId={clubId} />
                            </Box>
                        }
                        {
                            current == 2 &&
                            <Box className={`w-full h-full flex flex-col items-center justify-center`}>
                                <Clustering idRound={idRound} eventId={eventId} clubId={clubId} />
                            </Box>
                        }
                        {
                            current == 3 &&
                            <Box className={`w-full h-full flex flex-col items-center justify-center`}>
                                <ClusterHistory idRound={idRound} eventId={eventId} clubId={clubId} />
                            </Box>
                        }
                    </Box>
                    <Box className="w-full flex items-center justify-center space-x-4">
                        {current > 1 && (
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
export default FormCluster;