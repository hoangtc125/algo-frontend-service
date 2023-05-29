import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, FloatButton, Image, Modal, Result } from 'antd';
import { FileOutlined, PieChartOutlined, DesktopOutlined, UserOutlined, ProfileFilled } from '@ant-design/icons';
import VerifiedIcon from '@mui/icons-material/Verified';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { useEffect } from 'react';
const { Header, Footer, Sider } = Layout;
const { success } = Modal;

import UserMenu from '../components/UserMenu';
import PushNotification from '../components/PushNotification'
import { getProviderIcon } from '../utils/kind';
import { BACKEND_URL } from '../utils/constant';
import { accountSelector } from '../redux/selectors';
import logoImage from '../assets/images/algo.png'

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


const siderItems = [
    getItem(<Link to={"/club"}>Club</Link>, 'club', <PieChartOutlined />),
    getItem('Account', 'account', <UserOutlined />, [
        getItem(<Link to={"/account"}>Profile</Link>, '/account', <ProfileFilled />),
        getItem(<Link to={"/account/verify"}>Verify</Link>, '/account/verify', <VerifiedIcon />),
        getItem(<Link to={"/account/setting"}>Setting</Link>, '/account/setting', <SettingsSuggestIcon />),
    ]),
];

const MainLayout = () => {
    const account = useSelector(accountSelector)
    const location = useLocation();

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

    useEffect(() => {
        const hash = window.location.hash;
        if (hash == "#active") {
            success({
                title: 'Welcome to Algo',
                centered: true,
                content: (
                    <Result
                        status="success"
                        title="Successfully Active Account"
                        subTitle="Now you can login with your email and password."
                        className='pr-16'
                    />
                ),
            });
        } else if (hash == "#verify") {
            success({
                title: 'Account has been verified',
                centered: true,
                content: (
                    <Result
                        status="success"
                        title="Successfully Verify Account"
                        subTitle="Now you can login with your email and password."
                        className='pr-16'
                    />
                ),
            });
        }
    }, [])

    return (
        <Layout className='min-h-screen'>
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
                            <Button variant="contained"><Link to="/login">Login</Link></Button>
                        )
                }
            </Header>
            <Layout>
                {
                    account &&
                    <Sider collapsed={true} theme='light' className='w-[50px] sm:w-[200px]'>
                        <Link to="/">
                            <Image
                                preview={false}
                                src={logoImage}
                                className='cursor-pointer'
                                fallback="data:image/png;base64,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"
                            />
                        </Link>
                        <Menu theme="light" selectedKeys={location.pathname} mode="inline" items={siderItems} />
                    </Sider>
                }
                <Outlet />
            </Layout>
            <Footer className='text-center' >
                Thesis at Hanoi University of Science and Technology ©2023 Created by Cong Hoang Tran
            </Footer>
            <FloatButton.BackTop />
        </Layout>
    );
}

export default MainLayout;
