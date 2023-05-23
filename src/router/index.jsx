import { createBrowserRouter } from 'react-router-dom';
import AuthProvider from '../context/AuthProvider';
import ErrorPage from '../pages/ErrorPage';
import Home from '../pages/Home';
import Login from '../pages/Login';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts';

const AuthLayout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

export default createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Login />,
        path: '/login',
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Home />,
            path: '/',
            children: [
              
            ]
          },
        ],
      },
    ],
  },
]);
