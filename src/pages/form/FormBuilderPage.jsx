import { Tabs } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import { useEffect } from 'react';
import { v4 } from 'uuid';

import FormBuilder from '../../components/formBuilder/FormBuilder';
import formSlice from '../../components/formBuilder/formSlice';
import { FORM_BUILDER } from '../../utils/constant';
import { infoFormSelector } from '../../redux/selectors';
import { Link, useParams } from 'react-router-dom';

const FormBuilderPage = () => {
    const dispatch = useDispatch()
    const { formId } = useParams()
    const formsInfo = useSelector(infoFormSelector)
    const [activeKey, setActiveKey] = useState();
    const [items, setItems] = useState([]);
    console.log("re-render");

    useEffect(() => {
        if (formId == FORM_BUILDER.id) {
            dispatch(formSlice.actions.clear())
            dispatch(formSlice.actions.fakeForm())
            const fakeItems = FORM_BUILDER.sections.map((e, k) => {
                return {
                    label: e.title,
                    children: <div className='w-full min-h-[70vh] bg-blue-50 rounded-xl shadow-lg'><FormBuilder formId={e.id} /></div>,
                    key: e.id,
                    closable: k != 0,
                }
            })
            setItems(fakeItems)
        } else {
            dispatch(formSlice.actions.clear())
            dispatch(formSlice.actions.createForm(formId))
            setItems([{
                label: "",
                children: <div className='w-full min-h-[70vh] bg-blue-50 rounded-xl shadow-lg'><FormBuilder formId={formId} /></div>,
                key: formId,
                closable: false,
            }])
        }
        setActiveKey(formId)
    }, [])

    if (items.length > 0 && formsInfo.length > 0 && items.length == formsInfo.length) {
        if (JSON.stringify(formsInfo) != JSON.stringify(items.map(e => e.label))) {
            const newItems = items.map((e, idx) => {
                return { ...e, label: formsInfo[idx] }
            })
            setItems(newItems)
        }
    }

    const onChange = (newActiveKey) => {
        setActiveKey(newActiveKey);
    };

    const add = () => {
        const newActiveKey = v4();
        dispatch(formSlice.actions.addSection(newActiveKey))
        const newPanes = [...items];
        newPanes.push({
            label: `Section ${newActiveKey.substr(0, 8)}`,
            children: <div className='w-full min-h-[70vh] bg-blue-50 rounded-xl shadow-lg'><FormBuilder formId={newActiveKey} /></div>,
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
        <Box className="m-4 flex flex-col space-y-4">
            <Box className="flex w-full justify-end space-x-4 items-center">
                <Link to={`/algo-frontend-service/form-store/${formId}/preview`}><Button variant='outlined'>PREVIEW</Button></Link>
                <Link to="/algo-frontend-service/form-store"><Button variant='contained'>SAVE</Button></Link>
            </Box>
            <Tabs
                type="editable-card"
                onChange={onChange}
                activeKey={activeKey}
                onEdit={onEdit}
                items={items}
                className='w-full'
            />
        </Box>
    );

};
export default FormBuilderPage;