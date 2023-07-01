import React, { useEffect, useState } from 'react';
import FormViewer from '../../components/formViewer/FormViewer';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { get } from '../../utils/request';
import { useDispatch } from 'react-redux';
import { errorNotification } from '../../utils/notification';
import formSlice from '../../components/formBuilder/formSlice';

const FormViewerPage = () => {
    const dispatch = useDispatch()
    const { formId } = useParams()
    const hash = window.location.hash
    const navigate = useNavigate()
    const [canAnswer, setCanAnswer] = useState(false)

    console.log("re-render");

    const getFormQuestion = async () => {
        try {
            const res = await get(`/recruit/form-question/get?id=${formId}`)
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
    }, [])

    return (
        <Box className="m-4">
            <Button variant='outlined' onClick={() => { navigate(-1) }}>Quay lại</Button>
            {
                hash && <FormViewer formId={formId} />
            }
            {!hash && canAnswer &&
                <FormViewer formId={formId} />
            }
        </Box>
    );
}

export default FormViewerPage;
