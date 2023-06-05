import React, { useEffect, useRef } from 'react';
import { Box, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import clusteringSlice from './clusteringSlice';
import { clusterLogSelector, processSelector } from '../../redux/selectors';
import { getCurrentTime } from '../../utils/time';

const ClusteringLog = () => {
    const dispatch = useDispatch()
    const clusteringLog = useSelector(clusterLogSelector)
    const process = useSelector(processSelector)
    const boxRef = useRef(null);

    console.log("re-render");

    useEffect(() => {
        if (boxRef.current) {
            boxRef.current.scrollTop = boxRef.current.scrollHeight;
        }
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
            }, 100);

            return () => {
                clearInterval(interval);
            };
        }
    }, [clusteringLog, process]);

    return (
        <Box ref={boxRef} className="w-full max-h-[30vh] overflow-auto">
            {clusteringLog.map((e, idx) => (
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

export default ClusteringLog;
