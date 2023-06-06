import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Button, Steps } from 'antd';

import UploadExcel from './UploadExcel';
import ClusterPrepare from './ClusterPrepare';
import Clustering from './Clustering';
import ClusterHistory from './ClusterHistory';

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
    const hash = String(window.location.hash)
    const [current, setCurrent] = useState(hash ? parseInt(hash.split("#")[1]) : 0);

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
        <Box className='flex items-center flex-col space-y-4 bg-white m-4 rounded-md p-4 min-h-[80vh]'>
            <Steps
                type="navigation"
                current={current}
                onChange={onChange}
                className="site-navigation-steps"
                items={steps}
            />
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
            <Box className="w-full flex items-center justify-center space-x-4">
                {current > 0 && (
                    <Button
                        onClick={() => prev()}
                        type='primary'
                    >
                        Quay lại
                    </Button>
                )}
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        Tiếp tục
                    </Button>
                )}
            </Box>
        </Box>
    );
};
export default TryCluster;