import { Avatar, Box, Typography } from '@mui/material';
import { Card, List } from 'antd';
import React from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import moment from 'moment';

import { getProviderIcon } from '../../utils/kind';
import { CLUB_ROLE, MEMBERSHIP_STATUS } from '../../utils/constant';

const UserList = ({ data }) => {

    return (
        <List
            dataSource={data}
            renderItem={(account, idx) => {
                return (
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
                                <Box className="w-full flex flex-col md:flex-row items-start justify-between">
                                    {account.email}
                                    {getProviderIcon(account?.provider)}
                                </Box>
                            }
                        />
                        {
                            account?.member &&
                            <Box
                                className="flex flex-col items-start justify-start whitespace-pre-line text-base space-y-1 p-2"
                            >
                                <Typography variant='body2'>
                                    {`Chức vụ: ${CLUB_ROLE[account?.member?.role]}`}
                                </Typography>
                                <Typography variant='body2'>
                                    {`Trạng thái: `}{MEMBERSHIP_STATUS[account?.member?.status]}
                                </Typography>
                                <Typography variant='body2'>
                                    {`Ngày tham gia: ${moment(account?.member?.created_at * 1000).format('DD-MM-YYYY')}`}
                                </Typography>
                                <Typography variant='body2'>
                                    {`Thế hệ: ${account?.member?.gen || 1}`}
                                </Typography>
                            </Box>
                        }
                    </Card>
                )
            }}
        />
    );
}

export default UserList;
