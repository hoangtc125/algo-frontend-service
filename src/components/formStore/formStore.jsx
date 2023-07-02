import { CloudDownloadOutlined, StarOutlined } from '@ant-design/icons';
import { Box, Typography, Button, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Avatar, Card, List, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
const { Meta } = Card;

import FORM from '../../assets/images/form.png'
import { formStoreSelector, selectedFormSelector } from '../../redux/selectors';
import formStoreSlice from './formStoreSlice';
import formSlice from '../formBuilder/formSlice'
import { Link } from 'react-router-dom';
import { post } from '../../utils/request';
import { errorNotification } from '../../utils/notification';

const FormStore = ({ mode }) => {
    const dispatch = useDispatch()
    const formStore = useSelector(formStoreSelector)
    const selected = useSelector(selectedFormSelector)

    console.log("re-render");

    const getFormStore = async () => {
        try {
            const res = await post(`/recruit/form-question/get-all`, {
                kind: "public"
            })
            if (res?.status_code == 200) {
                dispatch(formStoreSlice.actions.createStore(res?.data))
            } else {
                errorNotification(res?.status_code, res?.msg, "bottomRight")
            }
        } catch (e) {
            console.log({ e });
            errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
        }
    }

    useEffect(() => {
        // dispatch(formStoreSlice.actions.fakeStore())
        getFormStore()

        // return () => {
        //     dispatch(formSlice.actions.clear())
        // }
    }, [])


    if (mode == "#select") {
        return (

            <Box className='flex items-center flex-col space-y-4 bg-white m-4 rounded-md p-4 shadow-md'>
                <Typography variant='h4'>Kho đơn tuyển thành viên mẫu</Typography>
                <FormControl fullWidth>
                    <RadioGroup
                        aria-labelledby="demo-radio-form-group-label"
                        name="radio-form-group"
                        value={selected?.id || "sample"}
                        className="w-full flex !flex-row items-center justify-center"
                        onChange={(e) => {
                            dispatch(formStoreSlice.actions.setSelected(e.target.value))
                        }}
                    >
                        {(formStore || []).map(item => (
                            <FormControlLabel labelPlacement="top" className='flex flex-row' key={item.id} value={item.id} control={<Radio />} label={
                                <Card
                                    key={item.id}
                                    className='sm:w-72 w-96 shadow-lg m-4 lg:m-8'
                                    hoverable={true}
                                    cover={
                                        <img
                                            alt="example"
                                            src={FORM}
                                        />
                                    }
                                    actions={[
                                        <Tooltip title="Like">
                                            <StarOutlined key="view" style={{ fontSize: "20px" }} />
                                        </Tooltip>,
                                        <Tooltip title="Clone">
                                            <CloudDownloadOutlined key="clone" style={{ fontSize: "20px" }} />
                                        </Tooltip>,
                                    ]}
                                >
                                    <Meta
                                        className='h-24'
                                        title={item.title}
                                        description={item.description}
                                    />
                                </Card>
                            } />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Box>
        );
    } else {
        return (
            <Box className='flex items-center flex-col space-y-4 bg-white m-4 rounded-md p-4 shadow-md'>
                <Typography variant='h4'>Kho đơn tuyển thành viên mẫu</Typography>
                <div className='w-full min-h-[70vh] flex justify-start items-start flex-wrap'>
                    {
                        (formStore || []).map(item => {
                            return (
                                <Card
                                    key={item.id}
                                    className='sm:w-72 w-96 shadow-lg m-4 lg:m-8'
                                    hoverable={true}
                                    cover={
                                        <Link to={`${item.id}/builder`}>
                                            <img
                                                alt="example"
                                                src={FORM}
                                            />
                                        </Link>
                                    }
                                    actions={[
                                        <Tooltip title="Like">
                                            <StarOutlined key="view" style={{ fontSize: "20px" }} />
                                        </Tooltip>,
                                        <Tooltip title="Clone">
                                            <CloudDownloadOutlined key="clone" style={{ fontSize: "20px" }} />
                                        </Tooltip>,
                                    ]}
                                >
                                    <Link to={`${item.id}/builder`}>
                                        <Meta
                                            className='h-24'
                                            title={item.title}
                                            description={item.description}
                                        />
                                    </Link>
                                </Card>
                            )
                        })
                    }
                </div>
            </Box>

        );
    }
}

export default FormStore;