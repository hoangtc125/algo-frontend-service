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
import TryClusterPage from '../pages/cluster/TryClusterPage';
import FormResponsePage from '../pages/form/formResponsePage';
import TryCameraPage from '../pages/camera/TryCameraPage';
import ClubProfile from '../components/club/ClubProfile';
import Test from '../components/Test';
import CreateInfo from '../components/club/CreateInfo';

export default createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Test />,
        path: '/algo-frontend-service/test',
      },
      {
        element: <HomePage />,
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
        element: <FormResponsePage />,
        path: '/algo-frontend-service/form-store/:formId/response',
      },
      {
        element: <TryClusterPage />,
        path: '/algo-frontend-service/try-cluster',
      },
      {
        element: <TryCameraPage />,
        path: '/algo-frontend-service/try-camera',
      },
      {
        element: <AccountProfile />,
        path: '/algo-frontend-service/account/:account_id?',
      },
      {
        element: <ClubProfile />,
        path: '/algo-frontend-service/club/:clubId',
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
            element: <CreateInfo />,
            path: '/algo-frontend-service/club/:clubId/edit',
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
