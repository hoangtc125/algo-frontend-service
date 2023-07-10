import React from 'react';
import { useDrop } from 'react-dnd';
import Candidate from './Candidate';

const Shift = ({ id, title, candidates, onCandidateDrop }) => {
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
        >
            <h3>{title}</h3>
            {candidates.map((candidate) => (
                <div key={candidate.id}>
                    <Candidate id={candidate.id} name={candidate.name} current={id}/>
                </div>
            ))}
        </div>
    );
};

export default Shift;
