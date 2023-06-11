import React, { useEffect, useRef } from 'react';
import { Image } from 'antd';
import { Box, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import moment from 'moment';

import clusteringSlice from './slice/clusteringSlice';
import { accountSelector, clusterLogSelector, clusterSelector, processSelector } from '../../redux/selectors';
import { env } from '../../utils/env';
import { HOST } from '../../utils/constant';
import { post } from '../../utils/request';

const ClusteringLog = () => {
    const dispatch = useDispatch()
    const clusteringLog = useSelector(clusterLogSelector)
    const clusterData = useSelector(clusterSelector)
    const process = useSelector(processSelector)
    const boxRef = useRef(null);
    const account = useSelector(accountSelector)

    console.log("re-render");

    useEffect(() => {
        if (boxRef.current) {
            boxRef.current.scrollTop = boxRef.current.scrollHeight;
        }
    });

    useEffect(() => {
        if (localStorage.getItem("guest")) {
            return
        }
        const socket = io(`ws://${env()?.host || HOST}:8001?client_id=${account.id}`, { path: "/ws/socket.io", transports: ['websocket'] })
        socket.on("clusteringLog", (message) => {
            const newLog = {
                time: moment(message?.time * 1000).format('HH:mm:ss'),
                type: message?.type || "text",
                content: message.content,
            };
            dispatch(clusteringSlice.actions.setClusteringLog(newLog))
        });

        return () => {
            socket.off("clusteringLog");
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const clustering = async (data) => {
            try {
                const res = await post(`/cluster/clustering?client_id=${account.id}`, data)
                if (res?.status_code == 200) {
                    const membership = res.data.membership.map((e, idx) => [clusterData.selectedRecord[idx], ...e])
                    dispatch(clusteringSlice.actions.setMembership(membership))
                    dispatch(clusteringSlice.actions.setPredLabels(res.data.pred_labels))
                    dispatch(clusteringSlice.actions.setProcess(3))
                } else {
                    errorNotification(res.status_code, res.msg, "bottomRight")
                    dispatch(clusteringSlice.actions.setProcess(0))
                }
            } catch {
                errorNotification("Đã xảy ra lỗi", "Hãy kiểm tra lại các bước làm", "bottomRight")
                dispatch(clusteringSlice.actions.setProcess(0))
            }
        }

        if (process == 2) {
            const identity = clusterData.selectedRecord.map(e => String(e))
            const supervisedOptions = clusterData.supervisedOptions
            const supervisedSet = clusterData.supervisedSet
            const vectorset = clusterData.vectorset
            const headerInfo = clusterData.header.filter(e => e.weight > 0)

            const supervised_set = supervisedOptions.map(c => {
                return identity.map(e => {
                    if (supervisedSet[e] == c.id) {
                        return e
                    }
                }).filter(e => e)
            })
            let fields_len = []
            let fields_weight = []
            const dataset = identity.map((i, idx) => {
                let data = []
                headerInfo.map(e => {
                    const d = vectorset[i][e.id][e.type]
                    if (idx == 0) {
                        fields_len.push(d.length)
                        fields_weight.push(e.weight)
                    }
                    data = [...data, ...d]
                })
                return data
            })

            clustering({
                identity,
                supervised_set,
                fields_len,
                fields_weight,
                dataset,
            })
        }
    }, [process])

    return (
        <Box ref={boxRef} className="w-full max-h-[50vh] overflow-auto">
            {clusteringLog.map((e, idx) => (
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

export default ClusteringLog;
