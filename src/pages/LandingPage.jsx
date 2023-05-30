import { Tabs } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { v4 } from 'uuid';

import FormBuilder from '../components/form/FormBuilder';
import formSlice from '../components/form/formSlice';

const LandingPage = () => {
    const dispatch = useDispatch()
    const [activeKey, setActiveKey] = useState();
    const [items, setItems] = useState();

    useEffect(() => {
        const formId = v4()
        dispatch(formSlice.actions.createForm(formId))
        setActiveKey(formId)
        setItems([
            {
                label: 'Main section',
                children: <div className='w-full min-h-[70vh] bg-blue-50 rounded-xl shadow-lg'><FormBuilder formId={formId}/></div>,
                key: formId,
                closable: false,
            },
        ])
    }, [])

    const onChange = (newActiveKey) => {
        setActiveKey(newActiveKey);
    };

    const add = () => {
        const newActiveKey = v4();
        dispatch(formSlice.actions.addSection(newActiveKey))
        const newPanes = [...items];
        newPanes.push({
            label: `Section ${newActiveKey.substr(0, 8)}`,
            children: <div className='w-full min-h-[70vh] bg-blue-50 rounded-xl shadow-lg'><FormBuilder formId={newActiveKey}/></div>,
            key: newActiveKey,
        });
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const remove = (targetKey) => {
        dispatch(formSlice.actions.removeSection(targetKey))
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = items.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const onEdit = (targetKey, action) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };

    return (
        <Tabs
            type="editable-card"
            onChange={onChange}
            activeKey={activeKey}
            onEdit={onEdit}
            items={items}
            className='w-full p-4'
        />
    );

};
export default LandingPage;