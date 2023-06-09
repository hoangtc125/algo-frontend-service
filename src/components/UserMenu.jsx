import { Avatar, Badge, Menu, MenuItem, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { accountSelector } from '../redux/selectors';
import appSlice from '../layouts/appSlice';
import cameraSlice from './camera/cameraSlice';
import formSlice from './formBuilder/formSlice';
import formStoreSlice from './formStore/formStoreSlice';
import clusterSlice from './cluster/slice/clusterSlice';
import clusterFileSlice from './cluster/slice/clusterFileSlice';
import clusterHistorySlice from './cluster/slice/clusterHistorySlice';
import clusteringSlice from './cluster/slice/clusteringSlice';
import clubSlice from './club/clubSlice';

const  UserMenu = () => {
  const account = useSelector(accountSelector)
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  console.log("re-render");

  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.clear()
    dispatch(appSlice.actions.clear())
    dispatch(cameraSlice.actions.clear())
    dispatch(formSlice.actions.clear())
    dispatch(formStoreSlice.actions.clear())
    dispatch(clusterFileSlice.actions.clear())
    dispatch(clusterSlice.actions.clear())
    dispatch(clusteringSlice.actions.clear())
    dispatch(clusterHistorySlice.actions.clear())
    dispatch(clubSlice.actions.clear())
    navigate(window.location.pathname)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  return (
    <>
      <Box
        sx={{ display: 'flex', '&:hover': { cursor: 'pointer' } }}
        onClick={handleClick}
      >
        <Typography className='hidden sm:inline-block' variant="h6">{account?.name}</Typography>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            account?.verify?.status ? <VerifiedIcon className='bg-white rounded-full' fontSize="small" color="primary" /> : <></>
          }
        >
          <Avatar
            alt='avatar'
            src={account?.photo_url}
            sx={{ width: 30, height: 30, marginLeft: '10px' }}
          />
        </Badge>
      </Box>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </>
  );
}

export default React.memo(UserMenu)
