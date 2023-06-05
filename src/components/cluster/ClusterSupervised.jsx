import { PlusOutlined } from '@ant-design/icons';
import { Input, Space, Tag, Tooltip, theme } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { supervisedOptionsSelector } from '../../redux/selectors';
import clusterSlice from './clusterSlice';
import { COLOR } from '../../utils/constant';
import { v4 } from 'uuid';

const ClusterSupervised = () => {
    const { token } = theme.useToken();
    const dispatch = useDispatch()
    const tags = useSelector(supervisedOptionsSelector)
    const ref1 = useRef(null)
    const ref2 = useRef(null)

    const [inputVisible, setInputVisible] = useState(false);
    const [editInputIndex, setEditInputIndex] = useState(-1);

    useEffect(() => {
        if (editInputIndex) {
            ref1.current?.focus();
        }
    }, [editInputIndex]);

    useEffect(() => {
        if (inputVisible) {
            ref2.current?.focus();
        }
    }, [inputVisible]);

    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag.id != removedTag);
        dispatch(clusterSlice.actions.setSupervisedOptions(newTags))
    };

    const showInput = () => {
        setInputVisible(true);
        ref2.current?.focus();
    };

    const handleInputConfirm = (e) => {
        if (e.target.value.trim() && !tags.map(e => e.value).includes(e.target.value)) {
            dispatch(clusterSlice.actions.setSupervisedOptions([...tags, {id: v4(), value: e.target.value}]))
        }
        setInputVisible(false);
    };

    const handleEditInputConfirm = (value, tagId) => {
        if (value.trim() && !tags.map(e => e.value).includes(value)) {
            const newTags = tags.map(tag => {
                if (tag.id == tagId) {
                    return {...tag, value: value}
                } else {
                    return tag
                }
            });
            dispatch(clusterSlice.actions.setSupervisedOptions(newTags))
        }
        setEditInputIndex(-1);
    };

    const tagInputStyle = {
        width: "100%",
        verticalAlign: 'top',
    };

    const tagPlusStyle = {
        background: token.colorBgContainer,
        borderStyle: 'dashed',
    };

    console.log("re-render");

    return (
        <Space size={20} wrap className='m-4 w-full'>
            <Space size={20} wrap>
                {tags.map((tag, index) => {
                    if (editInputIndex === index) {
                        return (
                            <Input
                                ref={ref1}
                                key={tag.id}
                                size="large"
                                style={tagInputStyle}
                                defaultValue={tag.value}
                                onBlur={(e) => { handleEditInputConfirm(e.target.value, tag.id) }}
                                onPressEnter={(e) => { handleEditInputConfirm(e.target.value, tag.id) }}
                            />
                        );
                    }
                    const isLongTag = tag.value.length > 20;
                    const tagElem = (
                        <Tag
                            key={tag.id}
                            className='h-fit'
                            closable={index > 1}
                            color={COLOR[index]}
                            style={{
                                userSelect: 'none',
                            }}
                            onClose={() => handleClose(tag.id)}
                        >
                            <span
                                className='text-lg'
                                onDoubleClick={(e) => {
                                    setEditInputIndex(index);
                                    e.preventDefault();
                                }}
                            >
                                {isLongTag ? `${tag.value.slice(0, 20)}...` : tag.value}
                            </span>
                        </Tag>
                    );
                    return isLongTag ? (
                        <Tooltip title={tag.value} key={tag.id}>
                            {tagElem}
                        </Tooltip>
                    ) : (
                        tagElem
                    );
                })}
            </Space>
            {inputVisible &&
                <Input
                    ref={ref2}
                    type="text"
                    size="large"
                    defaultValue={`Cụm ${tags.length + 1}`}
                    style={tagInputStyle}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            }
            {!inputVisible && tags.length < 10 &&
                <Tag style={tagPlusStyle} onClick={showInput} className='h-fit text-lg items-center'>
                    <PlusOutlined /> Tạo cụm mới
                </Tag>
            }
        </Space>
    );
};

export default React.memo(ClusterSupervised);