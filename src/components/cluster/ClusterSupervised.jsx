import { PlusOutlined } from '@ant-design/icons';
import { Input, Space, Tag, Tooltip, theme } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { supervisedOptionsSelector } from '../../redux/selectors';
import clusterSlice from './clusterSlice';
import { COLOR } from '../../utils/constant';

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
        const newTags = tags.filter((tag) => tag !== removedTag);
        dispatch(clusterSlice.actions.setSupervisedOptions(newTags))
    };

    const showInput = () => {
        setInputVisible(true);
        ref2.current?.focus();
    };

    const handleInputConfirm = (e) => {
        if (e.target.value.trim() && tags.indexOf(e.target.value) === -1) {
            dispatch(clusterSlice.actions.setSupervisedOptions([...tags, e.target.value]))
        }
        setInputVisible(false);
    };

    const handleEditInputConfirm = (e) => {
        if (e.target.value.trim() && !tags.includes(e.target.value)) {
            const newTags = [...tags];
            newTags[editInputIndex] = e.target.value;
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
                                key={tag}
                                size="large"
                                style={tagInputStyle}
                                defaultValue={tags[index]}
                                onBlur={handleEditInputConfirm}
                                onPressEnter={handleEditInputConfirm}
                            />
                        );
                    }
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag
                            key={tag}
                            className='h-fit'
                            closable={index > 1}
                            color={COLOR[index]}
                            style={{
                                userSelect: 'none',
                            }}
                            onClose={() => handleClose(tag)}
                        >
                            <span
                                className='text-lg'
                                onDoubleClick={(e) => {
                                    setEditInputIndex(index);
                                    e.preventDefault();
                                }}
                            >
                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                            </span>
                        </Tag>
                    );
                    return isLongTag ? (
                        <Tooltip title={tag} key={tag}>
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