import React from 'react';
import { List, Modal } from 'antd';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';

import { CLUSTER_TYPE } from '../../utils/constant';
import clusterSlice from './clusterSlice';
import { areFormElementEqual } from "../../utils/memo";

const HeaderSetting = ({ item, colDiffData }) => {
    const dispatch = useDispatch()

    console.log("re-render");

    const handleDetailView = (data) => {
        Modal.info({
            title: item.title,
            className: "min-w-[80vw] max-w-[90vw]",
            centered: true,
            content: (
                <List
                    itemLayout="horizontal"
                    className='w-full max-h-[80vh] overflow-auto'
                    dataSource={data}
                    header={
                        <div className='w-full flex flex-col justify-center items-center'>
                            <Grid container>
                                <Grid item className='items-center flex justify-center p-2' xs={2}>
                                    <Typography variant='h6'>
                                        STT
                                    </Typography>
                                </Grid>
                                <Grid item className='items-center flex justify-center p-2' xs={10}>
                                    <Typography variant='h6'>
                                        Data
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    }
                    renderItem={(e, idx) => (
                        <List.Item key={idx}>
                            <Grid container>
                                <Grid item className='items-center flex justify-center p-2' xs={2}>
                                    <Typography variant='body1'>
                                        {idx + 1}
                                    </Typography>
                                </Grid>
                                <Grid item className='items-center flex justify-center p-2' xs={10}>
                                    <Typography variant='body1'>
                                        {e}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </List.Item>
                    )}
                />
            ),
            onOk() { },
            onCancel() { },
        });
    }

    return (
        <Grid container>
            <Grid item className='items-center p-2' xs={6}>
                <Typography variant='body1'>
                    {item.title}
                </Typography>
            </Grid>
            <Grid item className='items-center flex justify-center p-2' xs={3}>
                <FormControl className='w-[50%]'>
                    <InputLabel id="el-cluster-label">Type</InputLabel>
                    <Select
                        labelId="el-cluster-label"
                        label="Type"
                        value={item.type}
                        onChange={(e) => { dispatch(clusterSlice.actions.updateHeader({ id: item.id, header: { type: e.target.value } })) }}
                    >
                        {CLUSTER_TYPE &&
                            CLUSTER_TYPE.map((el, key) => (
                                <MenuItem key={key} value={el.value}>
                                    {el.label}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item className='items-center flex justify-center p-2' xs={3}>
                <Button variant='outlined' onClick={() => handleDetailView(colDiffData)}>
                    {colDiffData.length}
                </Button>
            </Grid>
        </Grid>
    )
}

export default React.memo(HeaderSetting, areFormElementEqual)