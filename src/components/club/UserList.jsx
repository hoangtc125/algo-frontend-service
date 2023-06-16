import { Avatar, Box } from '@mui/material';
import { Card, List } from 'antd';
import React from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';

import { getProviderIcon } from '../../utils/kind';

const UserList = ({data}) => {

    return (
        <List
            dataSource={data}
            renderItem={(account, idx) => (
                <Card hoverable
                    key={idx}
                    bordered={true}
                    className='hover:cursor-pointer m-2'
                    onClick={() => {
                        window.location.href = `/algo-frontend-service/account/${account.id || ""}`
                    }}
                >
                    <Card.Meta
                        avatar={
                            <Avatar
                                alt='avatar'
                                src={account?.photo_url}
                            />
                        }
                        title={
                            <Box>
                                {account.name}
                                {account?.verify?.status ? <VerifiedIcon className='bg-white rounded-full ml-1' fontSize="small" color="primary" /> : <></>}
                            </Box>
                        }
                        description={
                            <Box className="w-full flex items-center justify-between">
                                {account.email}
                                {getProviderIcon(account?.provider)}
                            </Box>
                        }
                    />
                </Card>
            )}
        />
    );
}

export default UserList;
