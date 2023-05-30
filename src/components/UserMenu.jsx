import { Avatar, Badge, Menu, MenuItem, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { accountSelector } from '../redux/selectors';
import appSlice from '../layouts/appSlice';
import cameraSlice from './camera/cameraSlice';
import formSlice from './form/formSlice';

export default function UserMenu() {
  const account = useSelector(accountSelector)
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.clear()
    dispatch(appSlice.actions.clear())
    dispatch(cameraSlice.actions.clear())
    dispatch(formSlice.actions.clear())
    navigate("/algo-frontend-service/login")
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
            account?.verify?.status ? <VerifiedIcon fontSize="small" color="primary" /> : <></>
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
        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
      </Menu>
    </>
  );
}
