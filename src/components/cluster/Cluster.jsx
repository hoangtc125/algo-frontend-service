import React from 'react';
import { Box, Typography } from '@mui/material';
import ExcelTable from './ExcelTable';

const Cluster = () => {
    return (
        <Box className='flex items-center flex-col space-y-4 bg-white m-4 rounded-md p-4 min-h-[70vh]'>
            <Typography variant='h4'>Clustering</Typography>
            <ExcelTable />
        </Box>
    );
}

export default Cluster;
