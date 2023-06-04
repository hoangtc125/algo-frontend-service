import { PlusOutlined } from '@ant-design/icons';
import { Input, Space, Tag, Tooltip, theme } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { supervisedOptionsSelector } from '../../redux/selectors';
import clusterSlice from './clusterSlice';

const ClusterSupervised = () => {
    const { token } = theme.useToken();
    const dispatch = useDispatch()
    const tags = useSelector(supervisedOptionsSelector)

    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState('');
    const inputRef = useRef(null);
    const editInputRef = useRef(null);

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);

    useEffect(() => {
        editInputRef.current?.focus();
    }, [inputValue]);

    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        dispatch(clusterSlice.actions.setSupervisedOptions(newTags))
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
            dispatch(clusterSlice.actions.setSupervisedOptions([...tags, inputValue]))
        }
        setInputVisible(false);
        setInputValue('');
    };

    const handleEditInputChange = (e) => {
        setEditInputValue(e.target.value);
    };

    const handleEditInputConfirm = () => {
        const newTags = [...tags];
        newTags[editInputIndex] = editInputValue;
        dispatch(clusterSlice.actions.setSupervisedOptions(newTags))
        setEditInputIndex(-1);
        setInputValue('');
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
        <Space size={[0, 8]} wrap className='m-4 w-full'>
            <Space size={[0, 8]} wrap>
                {tags.map((tag, index) => {
                    if (editInputIndex === index) {
                        return (
                            <Input
                                ref={editInputRef}
                                key={tag}
                                size="large"
                                style={tagInputStyle}
                                value={editInputValue}
                                onChange={handleEditInputChange}
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
                            closable={true}
                            style={{
                                userSelect: 'none',
                            }}
                            onClose={() => handleClose(tag)}
                        >
                            <span
                                className='text-lg'
                                onDoubleClick={(e) => {
                                    setEditInputIndex(index);
                                    setEditInputValue(tag);
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
            {inputVisible ? (
                <Input
                    ref={inputRef}
                    type="text"
                    size="large"
                    style={tagInputStyle}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            ) : (
                <Tag style={tagPlusStyle} onClick={showInput} className='h-fit text-lg items-center'>
                    <PlusOutlined /> Tạo tập quan sát mới
                </Tag>
            )}
        </Space>
    );
};

export default ClusterSupervised;