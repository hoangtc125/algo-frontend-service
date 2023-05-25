import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import appSlice from '../layouts/appSlice';
import { accountSelector, tokenSelector } from '../redux/selectors';

export default function ProtectedRoute() {
  const dispatch = useDispatch()
  const account = useSelector(accountSelector)
  const token = useSelector(tokenSelector)

  if (!localStorage.getItem('accessToken')) {
    return <Navigate to="/login" />
  } else {
    if (!token) {
      dispatch(appSlice.actions.addToken(localStorage.getItem('accessToken')))
    }
    if (!account) {
      dispatch(appSlice.actions.addAccount(JSON.parse(localStorage.getItem("account"))))
    }
    return <Outlet />;
  }
}
