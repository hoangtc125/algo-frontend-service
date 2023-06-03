import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Steps } from 'antd';

import ExcelTable from './ExcelTable';
import UploadExcel from './UploadExcel';
import SetUpFile from './SetUpFile';
import { clusterSelector } from '../../redux/selectors';
import { errorNotification } from '../../utils/notification';

const ClusterFile = () => {
    const hash = String(window.location.hash)
    const clusterData = useSelector(clusterSelector)
    const [current, setCurrent] = useState(hash ? parseInt(hash.split("#")[1]) : 0);

    useEffect(() => {
        const saveInterval = setInterval(() => {
            sessionStorage.setItem("clusterFile", JSON.stringify(clusterData))
            console.log("auto-save cluster file");
        }, 3000);
        return () => {
            clearInterval(saveInterval)
        }
    }, [clusterData])

    const onChange = (value) => {
        window.location.hash = value
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
                className="site-navigation-steps"
                items={[
                    {
                        title: 'Upload Excel File',
                        description: 'Set up your dataset',
                    },
                    {
                        title: 'Prepare clustering',
                        description: 'Configure dataset',
                    },
                    {
                        title: 'Clustering',
                        description: '',
                    },
                ]}
            />
            <Box className={`w-full h-full flex flex-col items-center justify-center ${current == 0 ? "block" : "hidden"}`}>
                <UploadExcel />
                {clusterData.file[0] &&
                    <SetUpFile />
                }
            </Box>
            <Box className={`w-full h-full flex flex-col items-center justify-center ${current == 1 ? "block" : "hidden"}`}>
                <ExcelTable />
            </Box>
        </Box>
    );
};
export default ClusterFile;