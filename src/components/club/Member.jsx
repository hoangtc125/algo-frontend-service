import { Avatar, Badge, Box, Button, Typography } from '@mui/material';
import { Table } from 'antd';
import React from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useDispatch, useSelector } from 'react-redux';

import { clubGroupsSelector, clubMembersSelector } from '../../redux/selectors';
import { useNavigate } from 'react-router-dom';

const header = [
    "ID thành viên",
    "Họ và tên",
    "Tài khoản",
    "Ban",
    "Chức vụ",
    "Ngày tham gia",
    "Trạng thái",
]

const Member = () => {
    const dispatch = useDispatch()
    const members = useSelector(clubMembersSelector)
    const groups = useSelector(clubGroupsSelector)
    const navigate = useNavigate()
    const dataset = members.map(e => [e.member.id, e.name, e.id, e.member.group_id, e.member.role, e.member.created_at, e.member.status])

    const columns = [...header.map((item, index) => {
        const colData = Array.from(new Set(dataset.map(e => e[index])))
        return {
            title: item,
            dataIndex: index.toString(),
            key: index.toString(),
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            fixed: index < 2,
            filterSearch: true,
            filters: colData.map(e => (
                {
                    text: e,
                    value: e,
                }
            )),
            onFilter: (value, record) => String(record[index]).startsWith(value),
            sorter: (a, b) => {
                return String(a[index]).localeCompare(String(b[index]))
            },
            render: (text, record, index) => {
                console.log({ text, record, index });
                if (index == 2) {
                    const account = members.find(e => e.member.id == record[0])
                    return (
                        account.id ?
                            <Box
                                sx={{ display: 'flex', '&:hover': { cursor: 'pointer' } }}
                                onClick={() => { navigate(`/algo-frontend-service/account/${account.id}`) }}
                            >
                                <Typography className='hidden sm:inline-block' variant="h6">{account?.name}</Typography>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    badgeContent={
                                        account?.verify?.status ? <VerifiedIcon className='bg-white rounded-full' fontSize="small" color="primary" /> : <></>
                                    }
                                >
                                    <Avatar
                                        alt='avatar'
                                        src={account?.photo_url}
                                        sx={{ width: 30, height: 30, marginLeft: '10px' }}
                                    />
                                </Badge>
                            </Box>
                            : <></>
                    )
                }
                else {
                    return text
                }
            },
        }
    }), {
        title: 'Thao tác',
        key: 'action',
        fixed: 'right',
        width: 200,
        render: (text, record, index) => (
            <Button variant='outlined' onClick={() => { }}>Xem</Button>
        ),
    }]

    return (
        <Box className="w-full flex items-center justify-center p-4 bg-white">
            <Table
                dataSource={dataset}
                columns={columns}
                bordered
                size='small'
                className='cursor-pointer rounded-md shadow-lg'
                rowKey={(record) => record[0]}
                scroll={{
                    x: 200,
                }}
            />
        </Box>
    );
}

export default Member;
