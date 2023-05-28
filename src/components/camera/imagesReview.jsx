import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { useState } from 'react';
import { v4 } from 'uuid';

import { useDispatch, useSelector } from 'react-redux';
import { imagesSelector, singleSelector } from '../../redux/selectors';
import cameraSlice from './cameraSlice';
import { errorNotification } from '../../utils/notification';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ImagesReview = () => {
    const dispatch = useDispatch()
    const images = useSelector(imagesSelector)
    const single = useSelector(singleSelector)
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = async ({ file }) => {
        if (!["image/jpeg", "image/png"].some(item => item == file.type)) {
            errorNotification("Wrong type file", `You couldn't upload ${file.type} file`, "bottomRight")
            return
        }
        if (file.status == "removed") {
            dispatch(cameraSlice.actions.removeImage(file))
            return
        } 
            let image = {
                uid: v4(),
                name: file.name,
                status: 'done',
                url: file.url,
                type: file.type,
            }
            if (!image.url) {
                const base64Image = await getBase64(file.originFileObj)
                image.url = base64Image
            }
            if (single) {
                dispatch(cameraSlice.actions.addSingleImage(image))
            } else {
                dispatch(cameraSlice.actions.addImage(image))
            }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );
    return (
        <>
            <Upload
                action={null}
                listType="picture-card"
                fileList={images}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </>
    );
};
export default ImagesReview;