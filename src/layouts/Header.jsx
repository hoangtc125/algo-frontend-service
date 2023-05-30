import React from 'react';
import { Button } from '@mui/material';
import { FileOutlined, PieChartOutlined, DesktopOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Space } from 'antd';
const { Header } = Layout;

import PushNotification from '../components/PushNotification';
import UserMenu from '../components/UserMenu';
import { getProviderIcon } from '../utils/kind';
import { accountSelector } from '../redux/selectors';
import appSlice from './appSlice';
import { Link, useNavigate } from 'react-router-dom';

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const headerItems = [
    getItem('Club', '1', <PieChartOutlined />),
    getItem('Event', '2', <DesktopOutlined />),
    getItem('User', '9', <FileOutlined />),
];

const HeaderPage = () => {
    const dispatch = useDispatch()
    const account = useSelector(accountSelector)
    const navigate = useNavigate()

    return (
        <Header
            className='flex items-center justify-end sm:justify-between bg-white drop-shadow-md mb-1 px-1 sm:px-10'
        >
            <Menu className='grow max-w-full sm:block' theme="light" mode="horizontal" items={headerItems} />
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
                            onClick={() => {
                                dispatch(appSlice.actions.setTry())
                                navigate("/algo-frontend-service/home")
                            }}
                        >
                            Try without Sign in
                        </Button>
                            <Button variant="contained"><Link to="/algo-frontend-service/login">Login</Link></Button>
                        </Space>
                    )
            }
        </Header>
    );
}

export default HeaderPage;
