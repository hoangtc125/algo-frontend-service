import { Link, Outlet } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { FileOutlined, PieChartOutlined, DesktopOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { accountSelector } from '../redux/selectors';
import { Button } from '@mui/material';
import { useEffect } from 'react';
const { Header, Footer } = Layout;

import UserMenu from '../components/UserMenu';
import PushNotification from '../components/PushNotification'
import { getProviderIcon } from '../utils/kind';
import { BACKEND_URL } from '../utils/constant';

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Club', '1', <PieChartOutlined />),
    getItem('Event', '2', <DesktopOutlined />),
    getItem('User', '9', <FileOutlined />),
];

const MainLayout = () => {
    const account = useSelector(accountSelector)

    useEffect(() => {
        const fetchEnv = async () => {
            try {
                const resp = await fetch(`http://${window.location.hostname}:5173/env.json`)
                const env = await resp.json()
                sessionStorage.setItem("env", JSON.stringify(env))
            } catch {
                sessionStorage.setItem("env", JSON.stringify({
                    backend_url: BACKEND_URL
                }))
            }
        }
        fetchEnv()
    }, [])

    return (
        <Layout className='min-h-screen'>
            <Header
                className='flex items-center justify-end sm:justify-between bg-white drop-shadow-md mb-1 px-1 sm:px-10'
            >
                <Menu className='grow max-w-full sm:block' theme="light" mode="horizontal" items={items} />
                {
                    account ?
                        (
                            <div className='flex flex-row items-center space-x-1 sm:space-x-4 lg:space-x-6'>
                                {getProviderIcon(account?.provider)}
                                <PushNotification />
                                <UserMenu />
                            </div>
                        ) : (
                            <Button variant="contained"><Link to="/login">Login</Link></Button>
                        )
                }
            </Header>
            <Outlet />
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                DATN HUST ©2023 Created by Cong Hoang Tran
            </Footer>
        </Layout>
    );
}

export default MainLayout;
