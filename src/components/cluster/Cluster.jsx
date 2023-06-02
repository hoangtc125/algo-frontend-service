import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import ExcelTable from './ExcelTable';
import UploadExcel from './UploadExcel';
import SetUpFile from './SetUpFile';
import { clusterSelector } from '../../redux/selectors';

const Cluster = () => {
    const clusterData = useSelector(clusterSelector)
    const header = clusterData.header

    console.log("re-render");

    return (
        <Box className='flex items-center flex-col space-y-4 bg-white m-4 rounded-md p-4 min-h-[70vh]'>
            <Typography variant='h4'>Clustering</Typography>
            <UploadExcel />
            {
                header && header[0] && (
                    <>
                        <SetUpFile />
                        <ExcelTable />
                    </>
                )
            }
        </Box>
    );
}

export default Cluster;
