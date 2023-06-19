import { Avatar, Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Checkbox } from '@mui/material';
import { Card, List, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import { getProviderIcon } from '../../utils/kind';
import { CLUB_ROLE, MEMBERSHIP_STATUS } from '../../utils/constant';
import { selectModeSelector } from '../../redux/selectors';
import clubSlice from './clubSlice';

const UserList = ({ data }) => {
    const dispatch = useDispatch()
    const selectMode = useSelector(selectModeSelector)
    const [value, setValue] = useState([])

    useEffect(() => {
        return () => {
            dispatch(clubSlice.actions.setSelectOnly())
        }
    }, [])

    if (selectMode == "radio") {
        return (
            <FormControl fullWidth>
                <RadioGroup
                    aria-labelledby="demo-radio-user-group-label"
                    name="radio-user-group"
                    value={value[0] || ""}
                    className="w-full"
                    onChange={(e) => {
                        dispatch(clubSlice.actions.setSelectedUserRadio(e.target.value))
                        setValue([e.target.value])
                    }}
                >
                    {(data || []).map(account => (
                        <FormControlLabel key={account.id} value={account.id} control={<Radio />} label={
                            <Card hoverable
                                bordered={true}
                                className='hover:cursor-pointer m-2 !w-[800px]'
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
                            </Card>
                        } />
                    ))}
                </RadioGroup>
            </FormControl>
        );
    } else if (selectMode == "select") {
        return (
            <FormControl fullWidth>
                {(data || []).map(account => (
                    <FormControlLabel
                        key={account.id}
                        control={
                            <Checkbox
                                value={account.id}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    const isChecked = e.target.checked;
                                    let newData = []
                                    if (isChecked) {
                                    newData = [...value, v]
                                    } else {
                                    newData = value.filter((val) => val !== v)
                                    }
                                    setValue(newData)
                                    dispatch(clubSlice.actions.setSelectedUserSelect(newData))
                                }}
                                checked={value.includes(account.id)}
                            />
                        }
                        label={
                            <Card hoverable
                                bordered={true}
                                className='hover:cursor-pointer m-2 !w-[800px]'
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
                            </Card>
                        }
                    />
                ))}
            </FormControl>
        );
    } else {
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
                                        {`Trạng thái: `} <Tag bordered={false} color={MEMBERSHIP_STATUS[account?.member?.status]?.color}>{MEMBERSHIP_STATUS[account?.member?.status]?.label}</Tag>
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
}

export default UserList;
