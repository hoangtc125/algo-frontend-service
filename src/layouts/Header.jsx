import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { HomeOutlined, CloudServerOutlined, DesktopOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Modal, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';
const { Header } = Layout;

import PushNotification from '../components/PushNotification';
import UserMenu from '../components/UserMenu';
import { getProviderIcon } from '../utils/kind';
import { accountSelector } from '../redux/selectors';
import appSlice from './appSlice';
import LoginPage from '../pages/auth/LoginPage';

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const headerItems = [
    getItem(<Link to={"/algo-frontend-service/"}>Trang chủ</Link>, '/algo-frontend-service/', <HomeOutlined />),
    getItem(<Link to={"/algo-frontend-service/form-store"}>Kho đơn</Link>, '/algo-frontend-service/form-store', <CloudServerOutlined />),
    getItem(<Link to={"/algo-frontend-service/try-cluster"}>Phân cụm</Link>, '/algo-frontend-service/try-cluster', <DesktopOutlined />),
    getItem(<Link to={"/algo-frontend-service/try-camera"}>Kết nối</Link>, '/algo-frontend-service/try-camera', <VideoCameraOutlined />),
];

const HeaderPage = () => {
    const dispatch = useDispatch()
    const account = useSelector(accountSelector)
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log("re-render");

    const handleOk = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (account?.id) {
            setIsModalOpen(false)
        }
    }, [account])

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
                                }}
                            >
                                Dùng thử phần mềm
                            </Button>
                            <Button variant="contained" onClick={() => {
                                setIsModalOpen(true)
                                localStorage.setItem("redirect", window.location.pathname)
                            }}>Đăng nhập</Button>
                        </Space>
                    )
            }
            <Modal centered width={1500} open={isModalOpen} onOk={handleOk} onCancel={handleOk} destroyOnClose={true}>
                <LoginPage />
            </Modal>
        </Header>
    );
}

export default HeaderPage;
