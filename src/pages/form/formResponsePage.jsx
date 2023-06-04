import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import { titleSectionSelector } from '../../redux/selectors';

const FormResponsePage = () => {
    const { formId } = useParams()
    const title = useSelector(titleSectionSelector(formId))
    const navigate = useNavigate()
    console.log("re-render");

    return (
        <Box className="m-4">
            <Button variant='outlined' onClick={() => { navigate(-1) }}>Quay lại</Button>
            <Grid container spacing={2} direction="row" justifyContent="center" className="p-4">
                <Grid item xs={11} md={10}>
                    <Box sx={{ mb: 3 }}>
                        <Paper elevation={2} sx={{ p: 3, borderTop: "8px solid #272bb0" }} className="space-y-8">
                            <Typography variant="h2" gutterBottom className="w-full">
                                {title}
                            </Typography>
                            <Typography variant="h5" gutterBottom className="w-full">
                                Câu trả lời của bạn đã được ghi lại.
                            </Typography>
                            <Typography variant="h5" gutterBottom className="w-full">
                                <Link to={-1} className="underline text-blue-500">
                                    Gửi ý kiến phản hồi khác
                                </Link>
                            </Typography>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default FormResponsePage;
