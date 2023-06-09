import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import NumberForm from "./elements/NumberForm";
import RadioForm from "./elements/RadioForm";
import TextAreaForm from "./elements/TextAreaForm";
import TextFieldForm from "./elements/TextFieldForm";
import SelectForm from "./elements/SelectForm";
import { accountSelector, formSelector } from "../../redux/selectors";
import SectionForm from "./elements/SectionForm";
import formSlice from "../formBuilder/formSlice";
import { errorNotification, successNotification } from "../../utils/notification";
import { post } from "../../utils/request";

const BodyForm = ({ formId }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const formData = useSelector(formSelector)
    const sectionData = formData.sections.find(e => e.id == formId)?.data || []
    const account = useSelector(accountSelector)
    const hash = window.location.hash

    console.log(formId, formData.id);

    console.log("re-render");

    useEffect(() => {
        dispatch(formSlice.actions.setIsSubmit(false))
    }, [])

    useEffect(() => {
        let saveInterval = null
        if (formData.id == formId) {
            saveInterval = setInterval(() => {
                sessionStorage.setItem("formViewer", JSON.stringify(formData))
                console.log("auto-save form response");
            }, 3000);
        }
        return () => {
            clearInterval(saveInterval)
        }
    }, [formData])

    const handlePreSubmit = (data) => {
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (element.required && !element.answer) {
                document.getElementById(element.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
                return false
            }
            if (element.type == "section") {
                const _sectionId = element.options.find(e => e.id == element.answer)?.to
                const _res = handlePreSubmit(formData.sections.find(e => e.id == _sectionId)?.data || [])
                if (!_res) {
                    return false
                }
            }
        }
        return true
    }

    const handleSubmit = async () => {
        dispatch(formSlice.actions.setIsSubmit(true))
        if (!handlePreSubmit(sectionData)) {
            errorNotification("Gửi thất bại", "Kiểm tra lại các câu hỏi bắt buộc", "bottomRight")
        } else {
            if (hash) {
                navigate(`/algo-frontend-service/form-store/${formId}/response`)
                successNotification("Gửi thành công", "Câu trả lời của bạn sẽ sớm được xử lý", "bottomRight")
            } else {
                try {
                    const urlParams = new URLSearchParams(window.location.search)
                    const participantId = urlParams.get("participant_id");
                    const url = participantId ? `/recruit/form-answer/create?is_interview=${true}` : `/recruit/form-answer/create`
                    const res = await post(url, {
                        form_id: formId,
                        sections: formData.sections,
                        user_id: account?.id,
                        participant_id: participantId,
                    })
                    if (res?.status_code == 200) {
                        navigate(`/algo-frontend-service/form-store/${formId}/response`)
                        successNotification("Gửi thành công", "Câu trả lời của bạn sẽ sớm được xử lý", "bottomRight")
                    } else {
                        errorNotification("Gửi thất bại", res?.msg, "bottomRight")
                    }
                } catch (e) {
                    console.log({ e });
                    errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
                }
            }
        }
    }

    //Function to Handle Input Values
    const handleAnswerValue = (id, answer) => {
        dispatch(formSlice.actions.updateElement({ sectionId: formId, elementId: id, element: { answer: answer } }))
    };

    //Render items
    const renderElements = (item) => {
        switch (item.type) {
            case "section":
                return (
                    <SectionForm
                        key={item.id}
                        item={item}
                        handleAnswerValue={handleAnswerValue}
                    />
                );
            case "text":
                return (
                    <TextFieldForm
                        key={item.id}
                        item={item}
                        handleAnswerValue={handleAnswerValue}
                    />
                );
            case "textarea":
                return (
                    <TextAreaForm
                        key={item.id}
                        item={item}
                        handleAnswerValue={handleAnswerValue}
                    />
                );
            case "number":
                return (
                    <NumberForm
                        key={item.id}
                        item={item}
                        handleAnswerValue={handleAnswerValue}
                    />
                );
            case "radio":
                return (
                    <RadioForm
                        key={item.id}
                        item={item}
                        handleAnswerValue={handleAnswerValue}
                    />
                );
            case "select":
                return (
                    <SelectForm
                        key={item.id}
                        item={item}
                        handleAnswerValue={handleAnswerValue}
                    />
                );
            default:
                return <Box></Box>;
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            {sectionData.map(e => { return renderElements(e) })}
            {formData.id == formId &&
                <div className="w-full flex justify-start items-center">
                    <Button variant="contained" onClick={handleSubmit}>Gửi</Button>
                </div>
            }
        </div>
    );
};

export default BodyForm;
