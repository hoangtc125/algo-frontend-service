import { Box, Grid } from '@mui/material';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Tag } from 'antd';
import { useSelector } from 'react-redux';

import { COLOR } from '../../utils/constant';
import { clusteringSelector } from '../../redux/selectors';

const ClusterChart = ({ data }) => {
    const hash = window.location.hash
    const supervisedOptions = data.supervisedOptions
    const dataset = hash == "#3" ? data.membership : useSelector(clusteringSelector).membership

    return (
        <Box className="w-full flex flex-col items-center justify-center space-y-8">
            {
                supervisedOptions.map((tag, id) => {
                    const isLongTag = tag.value.length > 10;
                    const tagElem = (
                        <Tag
                            key={tag.id}
                            className='text-sm'
                            color={COLOR[id]}
                        >
                            {isLongTag ? `${tag.value.slice(0, 10)}...` : tag.value}
                        </Tag>
                    )
                    const dataChart = dataset.map(e => ({
                        id: e[0],
                        value: e[id + 1]
                    }))
                    return (
                        <Grid key={id} container className='w-full'>
                            <Grid item xs={1} className='flex w-full items-center text-center justify-center'>
                                {
                                    isLongTag ? (
                                        <Tooltip title={tag.value} key={tag.id} placement="bottom">
                                            {tagElem}
                                        </Tooltip>
                                    ) : (
                                        tagElem
                                    )
                                }
                            </Grid>
                            <Grid item xs={11} className='w-full flex items-center justify-center'>
                                <Tag
                                    className='w-fit rounded-md p-0 px-1'
                                    color={COLOR[id]}
                                >
                                    <BarChart width={1200} height={300} data={dataChart} className='bg-white pt-2 pb-4'>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="id" />
                                        <YAxis label={{ value: 'Tỉ lệ phần trăm', angle: -90, position: 'insideLeft' }} domain={[0, 1]} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="rgba(0, 123, 255, 0.5)" />
                                    </BarChart>
                                </Tag>
                            </Grid>
                        </Grid>
                    )
                })
            }
        </Box>
    );
};

export default ClusterChart;
