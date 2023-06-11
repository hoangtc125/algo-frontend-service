import React, { useEffect, useRef } from 'react';
import { Box, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { Image } from 'antd';
import moment from 'moment';

import clusteringSlice from './slice/clusteringSlice';
import { accountSelector, clusterSelector, deployLogSelector, processSelector } from '../../redux/selectors';
import clusterSlice from './slice/clusterSlice';
import { post } from '../../utils/request';
import { errorNotification } from '../../utils/notification';
import { env } from '../../utils/env';
import { HOST } from '../../utils/constant';

const DeploymentLog = () => {
    const dispatch = useDispatch()
    const deployLog = useSelector(deployLogSelector)
    const process = useSelector(processSelector)
    const clusterData = useSelector(clusterSelector)
    const boxRef = useRef(null);
    const account = useSelector(accountSelector)

    console.log("re-render");

    useEffect(() => {
        if (boxRef.current) {
            boxRef.current.scrollTop = boxRef.current.scrollHeight;
        }
    });

    useEffect(() => {
        if (localStorage.getItem("guest") || !account?.id) {
            return
        }
        const socket = io(`ws://${env()?.host || HOST}:8001?client_id=${account.id}`, { path: "/ws/socket.io", transports: ['websocket'] })
        socket.on("deployLog", (message) => {
            const newLog = {
                time: moment(message?.time * 1000).format('HH:mm:ss'),
                type: message?.type || "text",
                content: message.content,
            };
            dispatch(clusteringSlice.actions.setDeployLog(newLog))
        });

        return () => {
            socket.off("deployLog");
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const vectorize = async (data) => {
            try {
                const res = await post(`/cluster/vectorize?client_id=${account?.id}`, data)
                if (res?.status_code == 200) {
                    dispatch(clusterSlice.actions.updateVectorset(res.data))
                    dispatch(clusteringSlice.actions.setProcess(2))
                } else {
                    errorNotification(res.status_code, res.msg, "bottomRight")
                    dispatch(clusteringSlice.actions.setProcess(0))
                }
            } catch(e) {
                console.log({e});
                errorNotification("Đã xảy ra lỗi", "Hãy đăng nhập để thực hiện tính năng này", "bottomRight")
                dispatch(clusteringSlice.actions.setProcess(0))
            }
        }

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
                        data: selectedRecord.map(e => ({ id: e.id, data: e.data[index] })).filter(e => clusterData.vectorset[e.id][index][element.type].length == 0)
                    }
                } else {
                    res[index] = {
                        type: element.type,
                        weight: element.weight,
                        data: selectedRecord.map(e => ({ id: e.id, data: e.data[index] })).filter(e => clusterData.vectorset[e.id][index][element.type].length == 0)
                    }
                }
            }
            vectorize(res)
        }
    }, [process])

    return (
        <Box ref={boxRef} className="w-full max-h-[50vh] overflow-auto">
            {deployLog.map((e, idx) => (
                <Box key={idx} className="w-full hover:bg-slate-100">
                    <Grid container className="w-full items-center">
                        <Grid item xs={2}>
                            {e.time}
                        </Grid>
                        <Grid item xs={10}>
                            {
                                e?.type == "image"
                                    ?
                                    <Image src={`data:image/png;base64,${e.content}`} className='w-full' />
                                    :
                                    e.content
                            }
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </Box>
    );
}

export default DeploymentLog;
