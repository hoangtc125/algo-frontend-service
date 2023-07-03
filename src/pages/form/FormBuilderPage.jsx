import { Tabs } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';
import { useEffect } from 'react';
import { v4 } from 'uuid';

import FormBuilder from '../../components/formBuilder/FormBuilder';
import formSlice from '../../components/formBuilder/formSlice';
import { FORM_BUILDER } from '../../utils/constant';
import { formSelector, infoFormSelector } from '../../redux/selectors';
import { Link, useParams } from 'react-router-dom';
import { get, put } from '../../utils/request';
import { errorNotification, successNotification } from '../../utils/notification';

const FormBuilderPage = () => {
    const dispatch = useDispatch()
    const { formId } = useParams()
    const formsInfo = useSelector(infoFormSelector)
    const formData = useSelector(formSelector)
    const [eventId, setEventId] = useState(sessionStorage.getItem("eventId"))
    const [activeKey, setActiveKey] = useState();
    const [items, setItems] = useState([]);
    console.log("re-render");

    const handleSaveFormQuestion = async () => {
        try {
            const res = await put(`/recruit/form-question/update?form_question_id=${formId}&event_id=${eventId}`, {
                sections: formData.sections
            })
            if (res?.status_code == 200) {
                successNotification("Lưu thành công", "", "bottomRight")
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    }

    const getFormQuestion = async (id) => {
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
            try {
                const res = await get(`/recruit/form-question/get?id=${id}`)
                if (res?.status_code == 200) {
                    dispatch(formSlice.actions.createForm({ id: res?.data?.id, data: res?.data?.sections }))
                    setEventId(res?.data?.event_id)
                    sessionStorage.setItem("eventId", res?.data?.event_id)
                    setItems(res?.data?.sections.map((e, idx) => {
                        return {
                            label: "",
                            children: <div className='w-full min-h-[70vh] bg-blue-50 rounded-xl shadow-lg'><FormBuilder formId={e.id} /></div>,
                            key: e.id,
                            closable: idx != 0,
                        }
                    }))
                    // setItems([{
                    //     label: "",
                    //     children: <div className='w-full min-h-[70vh] bg-blue-50 rounded-xl shadow-lg'><FormBuilder formId={formId} /></div>,
                    //     key: formId,
                    //     closable: false,
                    // }])
                } else {
                    errorNotification(res?.status_code, res?.msg, "bottomRight")
                }
            } catch (e) {
                console.log({ e });
                errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
            }
        }
    }

    useEffect(() => {
        if (formData.id != formId) {
            dispatch(formSlice.actions.clear())
            getFormQuestion(formId)
        } else {
            const recoveryItems = formData.sections.map((e, k) => {
                return {
                    label: e.title,
                    children: <div className='w-full min-h-[70vh] bg-blue-50 rounded-xl shadow-lg'><FormBuilder formId={e.id} /></div>,
                    key: e.id,
                    closable: k != 0,
                }
            })
            setItems(recoveryItems)
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
            label: `Biểu mẫu ${newActiveKey.substr(0, 8)}`,
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
            <Box className="flex w-full justify-between space-x-4 items-center">
                <Link to={-1}><Button variant='outlined'>Quay lại</Button></Link>
                <Box className="flex items-center space-x-4">
                    <Typography>Bản nháp được lưu 3 giây / lần</Typography>
                    <Link to={`/algo-frontend-service/form-store/${formId}/preview#preview`}><Button variant='outlined'>Xem trước</Button></Link>
                    <Button variant='contained' onClick={handleSaveFormQuestion}>Lưu</Button>
                </Box>
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