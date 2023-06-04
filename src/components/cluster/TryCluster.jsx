import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Steps } from 'antd';

import UploadExcel from './UploadExcel';
import ClusterPrepare from './ClusterPrepare';

const TryCluster = () => {
    const hash = String(window.location.hash)
    const [current, setCurrent] = useState(hash ? parseInt(hash.split("#")[1]) : 0);

    const onChange = (value) => {
        window.location.hash = value
        setCurrent(value)
    };

    return (
        <Box className='flex items-center flex-col space-y-4 bg-white m-4 rounded-md p-4 min-h-[80vh]'>
            <Steps
                type="navigation"
                current={current}
                onChange={onChange}
                className="site-navigation-steps"
                items={[
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
                        description: '',
                    },
                ]}
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
        </Box>
    );
};
export default TryCluster;