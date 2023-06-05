import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import clusteringSlice from './clusteringSlice';
import { clusterLogSelector, processSelector } from '../../redux/selectors';
import { getCurrentTime } from '../../utils/time';

const ClusteringLog = () => {
    const dispatch = useDispatch()
    const clusteringLog = useSelector(clusterLogSelector)
    const process = useSelector(processSelector)

    console.log("re-render");

    useEffect(() => {
        if (process == 2) {
            const interval = setInterval(() => {
                if (clusteringLog.length < 10) {
                    const newLog = {
                        time: getCurrentTime(),
                        content: "abc",
                    };
                    dispatch(clusteringSlice.actions.setClusteringLog([...clusteringLog, newLog]))
                } else {
                    clearInterval(interval);
                    dispatch(clusteringSlice.actions.setProcess(3))
                }
            }, 250);

            return () => {
                clearInterval(interval);
            };
        }
    }, [clusteringLog, process]);

    return (
        <Box className="w-full">
            {clusteringLog.map((e, idx) => (
                <Grid key={idx} container spacing={2} className="w-full items-center hover:bg-slate-100">
                    <Grid item xs={3}>
                        {e.time}
                    </Grid>
                    <Grid item xs={9}>
                        {e.content}
                    </Grid>
                </Grid>
            ))}
        </Box>
    );
}

export default ClusteringLog;
