import { CloudDownloadOutlined, StarOutlined } from '@ant-design/icons';
import { Box, Typography, Button } from '@mui/material';
import { Avatar, Card, List, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
const { Meta } = Card;

import FORM from '../../assets/images/form.png'
import { formStoreSelector } from '../../redux/selectors';
import formStoreSlice from './formStoreSlice';
import { Link } from 'react-router-dom';

const FormStore = () => {
    const dispatch = useDispatch()
    const formStore = useSelector(formStoreSelector)

    useEffect(() => {
        dispatch(formStoreSlice.actions.fakeStore())
    }, [])

    return (
        <Box className='flex items-center flex-col space-y-4 bg-white m-4 rounded-md p-4'>
            <Typography variant='h4'>Forms Store</Typography>
            <div className='w-full flex justify-end'>
                <Button variant='contained'>New Form</Button>
            </div>
            <List
                grid={{
                    gutter: 16,
                    column: 4,
                }}
                dataSource={formStore}
                renderItem={(item) => (
                    <List.Item key={item.id}>
                        <Card
                            className='sm:w-72 w-96 shadow-lg'
                            hoverable={true}
                            cover={
                                <Link to={item.id}>
                                    <img
                                        alt="example"
                                        src={FORM}
                                    />
                                </Link>
                            }
                            actions={[
                                <Tooltip title="Like">
                                    <StarOutlined key="view" style={{ fontSize: "20px" }} />
                                </Tooltip>,
                                <Tooltip title="Clone">
                                    <CloudDownloadOutlined key="clone" style={{ fontSize: "20px" }} />
                                </Tooltip>,
                            ]}
                        >
                            <Link to={item.id}>
                                <Meta
                                    avatar={<Avatar alt='a' />}
                                    title={item.title}
                                    description={item.description}
                                />
                            </Link>
                        </Card>
                    </List.Item>
                )}
            />
        </Box>

    );
}

export default FormStore;