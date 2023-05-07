import React, { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge, Menu, MenuItem } from '@mui/material';
import io from 'socket.io-client';


export default function PushNotification() {
    const [invisible, setInvisible] = useState(true);
    const [notification, setNotification] = useState([]);

    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
        setInvisible(true);
    };

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    useEffect(() => {
        // const socket = io("ws://localhost:8001", {path: "/ws/socket.io", transports: ['websocket']})
        // socket.on("general", (message) => {
        //     setNotification(prev => [message, ...prev])
        // });
    
        // return () => {
        //   socket.off("general");
        //   socket.disconnect();
        // };
    }, []);

    return (
        <>
            <Badge
                color='error'
                variant='dot'
                invisible={invisible}
                badgeContent={notification.length}
                overlap='circular'
                sx={{ '&:hover': { cursor: 'pointer' }, ml: '5px' }}
            >
                <NotificationsIcon onClick={handleClick} sx={{ color: '#7D9D9C' }} />
            </Badge>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleClose}>{notification}</MenuItem>
            </Menu>
        </>
    );
}