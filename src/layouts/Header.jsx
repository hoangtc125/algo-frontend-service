import React from 'react';
import { Button } from '@mui/material';
import { FileOutlined, CloudServerOutlined, DesktopOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Space } from 'antd';
const { Header } = Layout;

import PushNotification from '../components/PushNotification';
import UserMenu from '../components/UserMenu';
import { getProviderIcon } from '../utils/kind';
import { accountSelector } from '../redux/selectors';
import appSlice from './appSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const headerItems = [
    getItem(<Link to={"/algo-frontend-service/form-store"}>Kho đơn tuyển thành viên mẫu</Link>, '/algo-frontend-service/form-store', <CloudServerOutlined />),
    getItem(<Link to={"/algo-frontend-service/cluster"}>Dùng thử phân cụm đơn tuyển thành viên</Link>, '/algo-frontend-service/cluster', <DesktopOutlined />),
];

const HeaderPage = () => {
    const dispatch = useDispatch()
    const account = useSelector(accountSelector)
    const navigate = useNavigate()
    const location = useLocation();

    return (
        <Header
            className='flex items-center justify-end sm:justify-between bg-white drop-shadow-md mb-1 px-1 sm:px-10'
        >
            <Menu className='grow max-w-full sm:block' theme="light" mode="horizontal" selectedKeys={location.pathname} items={headerItems} />
            {
                account ?
                    (
                        <div className='flex flex-row items-center space-x-1 sm:space-x-4 lg:space-x-6'>
                            {getProviderIcon(account?.provider)}
                            <PushNotification />
                            <UserMenu />
                        </div>
                    ) : (
                        <Space>
                        <Button
                            fullWidth
                            variant="outlined"
                            className='whitespace-nowrap'
                            onClick={() => {
                                dispatch(appSlice.actions.setTry())
                                navigate("/algo-frontend-service/home")
                            }}
                        >
                            Dùng thử phần mềm
                        </Button>
                            <Button variant="contained"><Link to="/algo-frontend-service/login">Đăng nhập</Link></Button>
                        </Space>
                    )
            }
        </Header>
    );
}

export default HeaderPage;
