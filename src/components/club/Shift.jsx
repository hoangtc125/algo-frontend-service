import React from 'react';
import { useDrop } from 'react-dnd';

import { COLOR_REAL } from '../../utils/constant';
import Candidate from './Candidate';
import { Affix, Tag } from 'antd';
import { Box } from '@mui/material';

const Shift = ({ id, color, title, capacity, candidates, onCandidateDrop }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'candidate',
        drop: (item) => onCandidateDrop(item.id, item.current, id),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <div
            ref={drop}
            style={{
                backgroundColor: isOver ? 'lightgreen' : '#f0f0f0',
                padding: '16px',
                margin: '8px',
            }}
            className='flex-1 items-center '
        >
            <Affix>
                <Box className="w-full">
                    <Tag color={COLOR_REAL[color % COLOR_REAL.length]} className='text-base w-full items-center text-center'>{title.trim()}</Tag>
                    <Box className='w-full items-center bg-[#f0f0f0] text-center text-base py-1'>
                        {`( ${candidates.length} / ${capacity || "unlimited"} )`}
                    </Box>
                </Box>
            </Affix>
            {candidates.map((candidate) => (
                <div key={candidate.id}>
                    <Candidate id={candidate.id} name={candidate.name} candidate={candidate} current={id} />
                </div>
            ))}
        </div>
    );
};

export default Shift;
