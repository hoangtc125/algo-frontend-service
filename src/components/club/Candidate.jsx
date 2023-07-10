import { Box } from '@mui/material';
import React from 'react';
import { useDrag } from 'react-dnd';

const Candidate = ({ id, current, name }) => {
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
                margin: '4px',
                cursor: 'move',
            }}
            className="w-full bg-white"
        >
            {name}
        </Box>
    );
};

export default Candidate;
