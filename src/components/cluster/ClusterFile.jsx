import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Steps } from 'antd';

import ExcelTable from './ExcelTable';
import UploadExcel from './UploadExcel';
import SetUpFile from './SetUpFile';
import { clusterSelector } from '../../redux/selectors';
import { errorNotification } from '../../utils/notification';

const ClusterFile = () => {
    const clusterData = useSelector(clusterSelector)
    const [current, setCurrent] = useState(0);

    const onChange = (value) => {
        console.log('onChange:', value);
        if (value == 1) {
            if (!clusterData.file[0]) {
                errorNotification("Empty Data", "You have upload excel file first", "bottomRight")
            } else {
                setCurrent(value)
            }
        } else {
            setCurrent(value)
        }
    };

    return (
        <Box className='flex items-center flex-col space-y-4 bg-white m-4 rounded-md p-4 min-h-[80vh]'>
            <Steps
                type="navigation"
                current={current}
                onChange={onChange}
                className="site-navigation-steps bg-gray-100"
                items={[
                    {
                        title: 'Upload Excel File',
                        description: 'Set up your dataset',
                    },
                    {
                        title: 'View Dataset',
                        description: 'Your file excel',
                    },
                    {
                        title: 'Step 3',
                        description: 'This is a description.',
                    },
                ]}
            />
            {current == 0 &&
                <Box className="w-full h-full flex flex-col items-center justify-center">
                    <UploadExcel />
                    {clusterData.file[0] &&
                        <SetUpFile />
                    }
                </Box>
            }
            {current == 1 &&
                <Box className="w-full h-full flex flex-col items-center justify-center">
                    <ExcelTable />
                </Box>
            }
        </Box>
    );
};
export default ClusterFile;