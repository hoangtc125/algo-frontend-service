import { Box } from '@mui/material';
import { Tag } from 'antd';
import React from 'react';
import { useDrag } from 'react-dnd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons'

const Candidate = ({ id, current, name, candidate }) => {
    const [{ isDragging }, drag] = useDrag({
        item: { id, current, name }, type: 'candidate',
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <Box
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                backgroundColor: '#f0f0f0',
                padding: '8px',
                cursor: 'move',
            }}
            className="w-full items-center my-1 hover:!bg-white flex space-x-2"
        >
            {
                (candidate?.answer || []).includes(current) ?
                    <CheckCircleOutlined className='text-green-500' />
                    :
                    <CloseCircleOutlined className='text-red-500' />
            }
            <div>
                {name}
            </div>
        </Box>
    );
};

export default Candidate;
