import { Avatar, Badge, Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Modal, Popconfirm, Table, Tag } from 'antd';
import React, { useState } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import { clubGroupsSelector, clubInfoSelector, clubMembersSelector, selectedUserSelector } from '../../redux/selectors';
import { CLUB_ROLE, MEMBERSHIP_STATUS } from '../../utils/constant';
import clubSlice, { createMember, deleteMember, updateMember, updateMemberGroup } from './clubSlice';
import { errorNotification } from '../../utils/notification';
import { handleDownload } from '../../utils/excel';
import User from './User';

const Member = () => {
    const dispatch = useDispatch()
    const members = useSelector(clubMembersSelector)
    const groups = useSelector(clubGroupsSelector)
    const info = useSelector(clubInfoSelector)
    const selectedUser = useSelector(selectedUserSelector)
    const navigate = useNavigate()
    const { clubId } = useParams()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dataset = members.map(e => [e.member.id, e.name, e.id, e.member.group_id, e.member.role, e.member.created_at, e.member.status])
    const columns = [
        {
            title: "ID",
            dataIndex: 0,
            key: 0,
            ellipsis: true, // Giới hạn độ dài cột
            width: 50, // Độ rộng cột
            fixed: true,
            render: (text, record, index) => {
                return (
                    <Typography>{index + 1}</Typography>
                )
            }
        },
        {
            title: "Họ và tên",
            dataIndex: 1,
            key: 1,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            fixed: true,
            render: (text, record, index) => {
                return (
                    <Typography>{text}</Typography>
                )
            }
        },
        {
            title: "Tài khoản",
            dataIndex: 2,
            key: 2,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            render: (text, record, index) => {
                if (text) {
                    const account = members.find(e => e.member.id == record[0])
                    return (
                        <Box
                            sx={{ display: 'flex', '&:hover': { cursor: 'pointer' } }}
                            className="hover:text-blue-500"
                            onClick={() => { navigate(`/algo-frontend-service/account/${account.id}`) }}
                        >
                            <Typography className='hidden sm:inline-block text-base'>{account?.name}</Typography>
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
                                    sx={{ width: 24, height: 24, marginLeft: '6px' }}
                                />
                            </Badge>
                        </Box>
                    )
                } else {
                    return record
                }
            },
        },
        {
            title: "Ban",
            dataIndex: 3,
            key: 3,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            filterSearch: true,
            filters: groups.map(e => ({
                text: e.name,
                value: e.id,
            })),
            onFilter: (value, record) => record[3].some(e => String(e).startsWith(value)),
            sorter: (a, b) => {
                return String(a[3]).localeCompare(String(b[3]))
            },
            render: (text, record, index) => {
                return (
                    <FormControl fullWidth>
                        <InputLabel id="el-group-label">Ban</InputLabel>
                        <Select
                            labelId="el-group-label"
                            id="el-group"
                            label="Ban"
                            value={text[0]}
                            onChange={(e) => {
                                console.log(e.target.value);
                                const admin_group_id = groups.find(e => !e.is_remove)?.id
                                if (text[0] == admin_group_id) {
                                    if (members.filter(e => e.member.group_id.includes(admin_group_id)).length > 1) {
                                        dispatch(updateMemberGroup({ member_id: record[0], group_id: text[0], add: false }))
                                        setTimeout(() => {
                                            dispatch(updateMemberGroup({ member_id: record[0], group_id: e.target.value, add: true }))
                                        }, 100);
                                    } else {
                                        errorNotification("Không thành công", "Phải có ít nhất 2 người ở Ban quản lý trước khi thay đổi", "bottomRight")
                                    }
                                } else {
                                    dispatch(updateMemberGroup({ member_id: record[0], group_id: text[0], add: false }))
                                    setTimeout(() => {
                                        dispatch(updateMemberGroup({ member_id: record[0], group_id: e.target.value, add: true }))
                                    }, 100);
                                }
                            }}
                        >
                            {groups.map((e, idx) => (
                                <MenuItem key={idx} value={e.id}>
                                    {e.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )
            }
        },
        {
            title: "Chức vụ",
            dataIndex: 4,
            key: 4,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            filterSearch: true,
            filters: Object.keys(CLUB_ROLE).map(e => ({
                text: CLUB_ROLE[e],
                value: e,
            })),
            onFilter: (value, record) => String(record[4]).startsWith(value),
            sorter: (a, b) => {
                return String(a[4]).localeCompare(String(b[4]))
            },
            render: (text, record, index) => {
                return (
                    <FormControl fullWidth>
                        <InputLabel id="el-role-label">Chức vụ</InputLabel>
                        <Select
                            labelId="el-role-label"
                            id="el-role"
                            label="Chức vụ"
                            value={text}
                            onChange={(e) => {
                                if (members.find(e => e.member.id == record[0])?.member?.role == "PRESIDENT") {
                                    if (members.filter(e => e.member.role == "PRESIDENT").length > 1) {
                                        dispatch(updateMember({ id: record[0], input: { "role": e.target.value } }))
                                    } else {
                                        errorNotification("Không thành công", "Phải có ít nhất 2 chủ nhiệm trước khi thay đổi", "bottomRight")
                                    }
                                } else {
                                    dispatch(updateMember({ id: record[0], input: { "role": e.target.value } }))
                                }
                            }}
                        >
                            {Object.keys(CLUB_ROLE).map((e, idx) => (
                                <MenuItem key={idx} value={e}>
                                    {CLUB_ROLE[e]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )
            }
        },
        {
            title: "Ngày tham gia",
            dataIndex: 5,
            key: 5,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột

            render: (text, record, index) => {
                return moment(parseInt(text) * 1000).format('DD-MM-YYYY')
            },
        },
        {
            title: "Trạng thái",
            dataIndex: 6,
            key: 6,
            ellipsis: true, // Giới hạn độ dài cột
            width: 200, // Độ rộng cột
            filterSearch: true,
            filters: Object.keys(MEMBERSHIP_STATUS).map(e => ({
                text: <Tag color={MEMBERSHIP_STATUS[e]?.color || "success"}>{MEMBERSHIP_STATUS[e]?.label}</Tag>,
                value: e,
            })),
            onFilter: (value, record) => String(record[6]).startsWith(value),
            sorter: (a, b) => {
                return String(a[6]).localeCompare(String(b[6]))
            },
            render: (text, record, index) => {
                return (
                    <FormControl fullWidth>
                        <InputLabel id="el-status-label">Trạng thái</InputLabel>
                        <Select
                            labelId="el-status-label"
                            id="el-status"
                            label="Trạng thái"
                            value={text}
                            onChange={(e) => { dispatch(updateMember({ id: record[0], input: { "status": e.target.value } })) }}
                        >
                            {Object.keys(MEMBERSHIP_STATUS).map((e, idx) => (
                                <MenuItem key={idx} value={e}>
                                    <Tag color={MEMBERSHIP_STATUS[e]?.color || "success"}>{MEMBERSHIP_STATUS[e]?.label}</Tag>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )
            }
        }, {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            width: 100,
            render: (text, record, index) => (
                <Popconfirm
                    title={`Xóa ${record[1]}?`}
                    onConfirm={() => { handleDelMember(record) }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button variant='outlined' color='error'>Xóa</Button>
                </Popconfirm>
            ),
        },
    ]

    const handleOk = () => {
        setIsModalOpen(false);
        for (let index = 0; index < selectedUser.length; index++) {
            const user_id = selectedUser[index];
            dispatch(createMember({
                "club_id": clubId,
                "user_id": user_id,
                "group_id": groups ? [groups[groups.length - 1]?.id] : [],
                "gen": 1,
            }))
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const handleDelMember = async (record) => {
        if (members.find(e => e.member.id == record[0])?.member?.role == "PRESIDENT") {
            if (members.filter(e => e.member.role == "PRESIDENT").length > 1) {
                dispatch(deleteMember({ member_id: record[0] }))
            } else {
                errorNotification("Không thành công", "Phải có ít nhất 2 chủ nhiệm trước khi thay đổi", "bottomRight")
            }
        } else {
            dispatch(deleteMember({ member_id: record[0] }))
        }
    }

    return (
        <Box className="w-full flex items-start justify-center">
            <Table
                dataSource={dataset}
                columns={columns}
                size='small'
                title={() => (
                    <Box className="w-full flex items-center justify-between">
                        <Box className="flex-1">
                            <Button variant='outlined'
                                onClick={() => {
                                    dispatch(clubSlice.actions.setSelect("select"))
                                    setIsModalOpen(true)
                                }}
                            >Thêm thành viên</Button>
                        </Box>
                        <Box className="flex-1 w-full flex flex-col text-center items-center justify-center">
                            <Typography className='text-black uppercase' variant='h6'>{info?.name}</Typography>
                            <Typography className='text-black uppercase' variant='body1'>{info?.nickname}</Typography>
                        </Box>
                        <Box className="flex-1 text-end items-center">
                            <Button variant='contained' startIcon={<DownloadIcon />} onClick={() => {
                                handleDownload(
                                    columns.map(e => e.title),
                                    dataset.map((e, idx) => {
                                        e[0] = idx + 1
                                        e[2] = `${window.location.origin}/algo-frontend-service/account/${e[2]}`
                                        e[3] = groups.filter(group => e[3].includes(group.id)).map(group => group.name)
                                        e[4] = CLUB_ROLE[e[4]]
                                        e[5] = moment(parseInt(e[5]) * 1000).format('DD-MM-YYYY')
                                        e[6] = MEMBERSHIP_STATUS[e[6]]?.label
                                        return e
                                    }),
                                    `${info?.name} - Member.xlsx`
                                )
                            }}>
                                Tải xuống
                            </Button>
                        </Box>
                    </Box>
                )}
                className='w-full min-h-screen bg-gray-100 rounded-md shadow-lg p-3'
                rowKey={(record) => record[0]}
                scroll={{
                    x: 200,
                }}
                pagination={false}
            />
            <Modal centered width={1000} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
                <User />
            </Modal>
        </Box>
    );
}

export default Member;
