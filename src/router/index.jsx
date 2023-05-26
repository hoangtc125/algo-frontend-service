import { Outlet, createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage';
import Home from '../pages/Home';
import LoginPage from '../pages/auth/Login';
import ProtectedRoute from './ProtectedRoute';
import RegisterPage from '../pages/auth/Register';
import ResetPasswordPage from '../pages/auth/ResetPassword';

export default createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
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
            element: <Home />,
            path: '/home',
            children: [
              
            ]
          },
        ],
      },
    ],
  },
]);
