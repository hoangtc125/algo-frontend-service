import React from 'react';
import { InputNumber, Modal, Slider } from 'antd';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
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
                <div className='w-full rounded-lg'>
                    <div className='w-full flex flex-col justify-center items-center bg-slate-200'>
                        <Grid container>
                            <Grid item className='items-center flex justify-center p-2' xs={2}>
                                <Typography variant='h6'>
                                    STT
                                </Typography>
                            </Grid>
                            <Grid item className='items-center flex justify-center p-2' xs={10}>
                                <Typography variant='h6'>
                                    Dữ liệu
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                    <Box className="w-full max-h-[60vh] overflow-auto">
                        {data.map((e, idx) => {
                            return (
                                <Grid key={idx} container className='hover:bg-slate-100 border-b-2'>
                                    <Grid item className='items-center flex justify-center p-2' xs={2}>
                                        <Typography variant='body1'>
                                            {idx + 1}
                                        </Typography>
                                    </Grid>
                                    <Grid item className='items-center flex justify-center p-2' xs={10}>
                                        <Typography variant='body1'>
                                            {e == 0 ? "0" : e}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </Box>
                </div>
            ),
            onOk() { },
            onCancel() { },
        });
    }

    return (
        <Grid container>
            <Grid item className='border-r-2 items-center p-2' xs={6}>
                <Typography variant='body1'>
                    {item.title}
                </Typography>
            </Grid>
            <Grid item className='border-r-2 items-center flex justify-center p-2' xs={1}>
                <Button variant='outlined' onClick={() => handleDetailView(colDiffData)}>
                    {colDiffData.length}
                </Button>
            </Grid>
            <Grid item className='border-r-2 items-center flex justify-center p-2' xs={2}>
                <FormControl className='w-full lg:w-[70%]'>
                    <InputLabel id="el-cluster-label">Loại</InputLabel>
                    <Select
                        labelId="el-cluster-label"
                        label="Type"
                        value={item.type}
                        disabled={item.disabled}
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
            <Grid item className='border-r-2 w-full items-center flex justify-center p-2' xs={3}>
                <Grid container spacing={1}>
                    <Grid item className='items-center flex justify-center p-2' xs={8}>
                        <Slider
                            className='w-[90%]'
                            min={0}
                            max={3}
                            disabled={item.disabled}
                            onChange={(value) => { dispatch(clusterSlice.actions.updateHeader({ id: item.id, header: { weight: value } })) }}
                            value={item.weight}
                            step={0.25}
                        />
                    </Grid>
                    <Grid item className='items-center flex justify-end p-2' xs={4}>
                        <InputNumber
                            min={0}
                            max={3}
                            className='ml-2'
                            disabled={item.disabled}
                            value={item.weight}
                            onChange={(value) => { dispatch(clusterSlice.actions.updateHeader({ id: item.id, header: { weight: value } })) }}
                            step={0.25}
                        />
                    </Grid>
                </Grid>
            </Grid >
        </Grid >
    )
}

export default React.memo(HeaderSetting, areFormElementEqual)