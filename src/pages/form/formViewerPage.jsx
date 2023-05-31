import React from 'react';
import FormViewer from '../../components/formViewer/FormViewer';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

const FormViewerPage = () => {
    const { formId } = useParams()
    const navigate = useNavigate()

    return (
        <Box className="m-4">
            <Button variant='outlined' onClick={() => { navigate(-1) }}>BACK</Button>
            <FormViewer formId={formId} />
        </Box>
    );
}

export default FormViewerPage;
