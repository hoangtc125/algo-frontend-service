import { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge, Menu } from '@mui/material';
import { Button, List, Skeleton } from 'antd';
import moment from 'moment';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

import { accountSelector } from '../redux/selectors';
import { post } from '../utils/request';
import { openNotification } from '../utils/notification';

export default function PushNotification() {
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [notification, setNotification] = useState([1, 2]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [page, setPage] = useState(1);
    const account = useSelector(accountSelector)
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    useEffect(() => {
        const socket = io(`ws://localhost:8001?client_id=${account.id}`, {path: "/ws/socket.io", transports: ['websocket']})
        socket.on("notification", (message) => {
            setNotification(prev => [message, ...prev])
            openNotification("Notification", message?.content, "bottomLeft")
        });

        return () => {
          socket.off("notification");
          socket.disconnect();
        };
    }, []);


    useEffect(() => {
        const loadNoti = async () => {
            const noti = await post(`/account/notification?page_size=5&page_number=${page}&orderby=created_at&sort=-1`, {"to": account.id})
            setInitLoading(false);
            setData(noti?.data || []);
            setNotification(noti?.data || []);
        }
        loadNoti()
    }, []);

    const onLoadMore = async () => {
        setLoading(true);
        setNotification(
            data.concat(
                [...new Array(5)].map(() => ({
                    loading: true,
                    created_at: 0,
                    content: "",
                })),
            ),
        );
        const noti = await post(`/account/notification?page_size=5&page_number=${page + 1}&orderby=created_at&sort=1`, {"to": account.id})
        const newData = data.concat(noti?.data || []);
        setData(newData);
        setNotification(newData);
        setLoading(false);
        setPage(prev => prev + 1)
        window.dispatchEvent(new Event('resize'));
    };


    const loadMore =
        !initLoading && !loading ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button onClick={onLoadMore}>loading more</Button>
            </div>
        ) : null;

    return (
        <>
            <div onClick={handleClick}>
                <Badge
                    color='primary'
                    badgeContent={notification.length}
                    overlap='circular'
                    sx={{ '&:hover': { cursor: 'pointer' }, ml: '5px' }}
                >
                    <NotificationsIcon sx={{ color: '#7D9D9C' }} />
                </Badge>
            </div>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <List
                    className="demo-loadmore-list overflow-auto scroll-auto w-[300px] sm:w-[500px] max-h-[50vh] sm:max-h-[80vh] px-2 py-1"
                    loading={initLoading}
                    itemLayout="horizontal"
                    loadMore={loadMore}
                    dataSource={notification}
                    header="Notification"
                    renderItem={(item) => (
                        <List.Item>
                            <Skeleton avatar title={false} loading={item?.loading} active>
                                <List.Item.Meta
                                    title={<p className='text-base'>{item?.content}</p>}
                                    description={<p className='text-sm text-right'>{moment(item?.created_at * 1000).format('DD-MM-YYYY HH:mm:ss')}</p>}
                                />
                            </Skeleton>
                        </List.Item>
                    )}
                />
            </Menu>
        </>
    );
}