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
import FormStorePage from '../pages/form/FormStorePage';
import FormBuilderPage from '../pages/form/FormBuilderPage';
import FormViewerPage from '../pages/form/formViewerPage';

export default createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <LandingPage />,
        path: '/algo-frontend-service/',
      },
      {
        element: <LoginPage />,
        path: '/algo-frontend-service/login',
      },
      {
        element: <RegisterPage />,
        path: '/algo-frontend-service/register',
      },
      {
        element: <ResetPasswordPage />,
        path: '/algo-frontend-service/reset-password',
      },
      {
        element: <FormStorePage />,
        path: '/algo-frontend-service/form-store',
      },
      {
        element: <FormBuilderPage />,
        path: '/algo-frontend-service/form-store/:formId/builder',
      },
      {
        element: <FormViewerPage />,
        path: '/algo-frontend-service/form-store/:formId/preview',
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <HomePage />,
            path: '/algo-frontend-service/home',
            children: [

            ]
          },
          {
            element: <AccountProfile />,
            path: '/algo-frontend-service/account',
          },
          {
            element: <AccountVerify />,
            path: '/algo-frontend-service/account/verify',
          },
          {
            element: <AccountSetting />,
            path: '/algo-frontend-service/account/setting',
          },
        ],
      },
    ],
  },
]);
