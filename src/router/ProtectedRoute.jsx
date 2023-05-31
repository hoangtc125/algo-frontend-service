import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb, Layout } from 'antd';

import appSlice from '../layouts/appSlice';
import { accountSelector, tokenSelector } from '../redux/selectors';

const { Content } = Layout;

export default function ProtectedRoute() {
  const dispatch = useDispatch()
  const account = useSelector(accountSelector)
  const token = useSelector(tokenSelector)
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(path => path !== '');
  const breadcrumbItems = pathParts.map((part, index) => {
    const itemPath = `/${pathParts.slice(0, index + 1).join('/')}`;
    return {
      title: <Link to={itemPath}>{part}</Link>,
    };
  });

  if (!localStorage.getItem('accessToken')) {
    return <Navigate to="/algo-frontend-service/login" />
  }
  if (!token) {
    dispatch(appSlice.actions.addToken(localStorage.getItem('accessToken')))
  }
  if (!account) {
    dispatch(appSlice.actions.addAccount(JSON.parse(localStorage.getItem("account"))))
  }

  return (
    <Layout>
      <Content
        style={{
          margin: '0 16px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '16px 0',
          }}
          items={breadcrumbItems.slice(1)}
        />
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: "#fff",
          }}
        >
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
}
