import { Avatar, Menu, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { accountSelector } from '../redux/selectors';
import appSlice from '../layouts/appSlice';

export default function UserMenu() {
  const account = useSelector(accountSelector)
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.clear()
    dispatch(appSlice.actions.addToken(null))
    dispatch(appSlice.actions.removeAccount())
    navigate("/login")
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
        <Typography className='hidden sm:inline-block'>{account?.name}</Typography>
        <Avatar
          alt='avatar'
          src={account?.photo_url}
          sx={{ width: 24, height: 24, marginLeft: '10px' }}
        />
      </Box>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
