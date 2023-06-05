import React, { useEffect, useRef } from 'react';
import { Box, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import clusteringSlice from './clusteringSlice';
import { deployLogSelector, processSelector } from '../../redux/selectors';
import { getCurrentTime } from '../../utils/time';

const DeploymentLog = () => {
    const dispatch = useDispatch()
    const deployLog = useSelector(deployLogSelector)
    const process = useSelector(processSelector)
    const boxRef = useRef(null);

    console.log("re-render");

    useEffect(() => {
        if (boxRef.current) {
            boxRef.current.scrollTop = boxRef.current.scrollHeight;
        }
        if (process == 1) {
            const interval = setInterval(() => {
                if (deployLog.length < 20) {
                    const newLog = {
                        time: getCurrentTime(),
                        content: "abc",
                    };
                    dispatch(clusteringSlice.actions.setDeployLog([...deployLog, newLog]))
                } else {
                    clearInterval(interval);
                    dispatch(clusteringSlice.actions.setProcess(2))
                }
            }, 100);

            return () => {
                clearInterval(interval);
            };
        }
    }, [deployLog, process]);

    return (
        <Box ref={boxRef} className="w-full max-h-[30vh] overflow-auto">
            {deployLog.map((e, idx) => (
                <Box key={idx} className="w-full hover:bg-slate-100">
                    <Grid container className="w-full items-center">
                        <Grid item xs={2}>
                            {e.time}
                        </Grid>
                        <Grid item xs={10}>
                            {e.content}
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </Box>
    );
}

export default DeploymentLog;
