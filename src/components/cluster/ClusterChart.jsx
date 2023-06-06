import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
    { id: 'A', value: 10 },
    { id: 'B', value: 20 },
    { id: 'C', value: 30 },
    { id: 'D', value: 40 },
];

const ClusterChart = () => {
    return (
        <BarChart width={1000} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="id" />
            <YAxis label={{ value: 'Tỉ lệ phần trăm', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="rgba(0, 123, 255, 0.5)" />
        </BarChart>
    );
};

export default ClusterChart;
