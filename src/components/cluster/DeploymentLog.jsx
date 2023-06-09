import React, { useEffect, useRef } from 'react';
import { Box, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import clusteringSlice from './slice/clusteringSlice';
import { clusterSelector, deployLogSelector, processSelector } from '../../redux/selectors';
import { getCurrentTime } from '../../utils/time';
import clusterSlice from './slice/clusterSlice';

const DeploymentLog = () => {
    const dispatch = useDispatch()
    const deployLog = useSelector(deployLogSelector)
    const process = useSelector(processSelector)
    const clusterData = useSelector(clusterSelector)
    const boxRef = useRef(null);

    console.log("re-render");

    useEffect(() => {
        if (boxRef.current) {
            boxRef.current.scrollTop = boxRef.current.scrollHeight;
        }
        if (process == 1) {
            const interval = setInterval(() => {
                if (deployLog.length < 3) {
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

    useEffect(() => {
        if (process == 1) {
            const selectedRecord = clusterData.selectedRecord.map(e => ({ id: e, data: clusterData.dataset[e] }))
            let res = {}
            for (let index = 0; index < clusterData.header.length; index++) {
                const element = clusterData.header[index];
                if (element.weight == 0) {
                    continue
                }
                if (element.type == "categorical") {
                    res[index] = {
                        type: element.type,
                        weight: element.weight,
                        collDiffData: clusterData.collDiffData[index],
                        data: selectedRecord.map(e => ({id: e.id, data: e.data[index]})).filter(e => clusterData.vectorset[e.id][index][element.type].length == 0)
                    }
                } else {
                    res[index] = {
                        type: element.type,
                        weight: element.weight,
                        data: selectedRecord.map(e => ({id: e.id, data: e.data[index]})).filter(e => clusterData.vectorset[e.id][index][element.type].length == 0)
                    }
                }
            }
            dispatch(clusterSlice.actions.updateVectorset(res))
        }
    }, [process])

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
