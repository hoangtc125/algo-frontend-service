import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage';
import LoginPage from '../pages/auth/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import RegisterPage from '../pages/auth/RegisterPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import MainLayout from '../layouts';
import AccountProfile from '../components/account/AccountProfile';
import AccountSetting from '../components/account/AccountSetting';
import AccountVerify from '../components/account/AccountVerify';
import LandingPage from '../pages/LandingPage';
import HomePage from '../pages/HomePage';

export default createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <LandingPage />,
        path: '/',
      },
      {
        element: <LoginPage />,
        path: '/login',
      },
      {
        element: <RegisterPage />,
        path: '/register',
      },
      {
        element: <ResetPasswordPage />,
        path: '/reset-password',
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <HomePage />,
            path: '/home',
            children: [

            ]
          },
          {
            element: <AccountProfile />,
            path: '/account',
          },
          {
            element: <AccountVerify />,
            path: '/account/verify',
          },
          {
            element: <AccountSetting />,
            path: '/account/setting',
          },
        ],
      },
    ],
  },
]);
