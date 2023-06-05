import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import clusteringSlice from './clusteringSlice';
import { deployLogSelector, processSelector } from '../../redux/selectors';
import { getCurrentTime } from '../../utils/time';

const DeploymentLog = () => {
    const dispatch = useDispatch()
    const deployLog = useSelector(deployLogSelector)
    const process = useSelector(processSelector)

    console.log("re-render");

    useEffect(() => {
        if (process == 1) {
            const interval = setInterval(() => {
                if (deployLog.length < 10) {
                    const newLog = {
                        time: getCurrentTime(),
                        content: "abc",
                    };
                    dispatch(clusteringSlice.actions.setDeployLog([...deployLog, newLog]))
                } else {
                    clearInterval(interval);
                    dispatch(clusteringSlice.actions.setProcess(2))
                }
            }, 250);

            return () => {
                clearInterval(interval);
            };
        }
    }, [deployLog, process]);

    return (
        <Box className="w-full">
            {deployLog.map((e, idx) => (
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

export default DeploymentLog;
