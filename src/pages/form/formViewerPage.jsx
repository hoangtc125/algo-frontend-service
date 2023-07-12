import React, { useEffect, useState } from 'react';
import FormViewer from '../../components/formViewer/FormViewer';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { get, post } from '../../utils/request';
import { useDispatch } from 'react-redux';
import { errorNotification } from '../../utils/notification';
import formSlice from '../../components/formBuilder/formSlice';

const FormViewerPage = ({ form_id, selectedParticipant }) => {
    const dispatch = useDispatch()
    const { formId } = useParams()
    const hash = window.location.hash == "#preview"
    const navigate = useNavigate()
    const [canAnswer, setCanAnswer] = useState(false)

    console.log("re-render");

    const getFormQuestion = async () => {
        try {
            const res = await post(`/recruit/form-answer/get-all`, {
                "form_id": formId || form_id,
                "participant_id": selectedParticipant,
            })
            if (res?.status_code == 200 && res?.data[0]) {
                dispatch(formSlice.actions.createForm({ id: formId || form_id, data: res?.data[0]?.sections }))
                setCanAnswer(true)
                return
            } else {
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
        try {
            const res = await get(`/recruit/form-question/get?id=${formId || form_id}`)
            if (res?.status_code == 200) {
                dispatch(formSlice.actions.createForm({ id: res?.data?.id, data: res?.data?.sections }))
                setCanAnswer(true)
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    }

    useEffect(() => {
        if (!hash) {
            getFormQuestion()
        }
    }, [selectedParticipant])

    return (
        <Box className="m-4">
            {
                !form_id &&
                <Button variant='outlined' onClick={() => { navigate(-1) }}>Quay lại</Button>
            }
            {
                hash && <FormViewer formId={formId || form_id} />
            }
            {!hash && canAnswer &&
                <FormViewer formId={formId || form_id} />
            }
        </Box>
    );
}

export default FormViewerPage;
