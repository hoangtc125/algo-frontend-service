import { Link, Outlet } from 'react-router-dom';
import { Layout, Menu, Space } from 'antd';
import { FileOutlined, PieChartOutlined, UserOutlined, DesktopOutlined, TeamOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { accountSelector } from '../redux/selectors';
import { Button } from '@mui/material';
const { Header, Footer } = Layout;

import UserMenu from '../components/UserMenu';
import PushNotification from '../components/PushNotification'

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Option 1', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
];

const MainLayout = () => {
    const account = useSelector(accountSelector)

    return (
        <Layout className='min-h-screen'>
            <Header
                className='flex items-center justify-end sm:justify-between bg-white drop-shadow-md'
            >
                <Menu className='grow max-w-full sm:block' theme="light" mode="horizontal" items={items} />
                {
                    account ?
                        (
                            <Space size={20}>
                                <PushNotification />
                                <UserMenu />
                            </Space>
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
