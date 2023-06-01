import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import NumberForm from "./elements/NumberForm";
import RadioForm from "./elements/RadioForm";
import TextAreaForm from "./elements/TextAreaForm";
import TextFieldForm from "./elements/TextFieldForm";
import SelectForm from "./elements/SelectForm";
import { formIdSelector, formSectionsDataSelector, formSectionsSelector } from "../../redux/selectors";
import SectionForm from "./elements/SectionForm";
import formSlice from "../formBuilder/formSlice";
import { errorNotification, successNotification } from "../../utils/notification";

const BodyForm = ({ formId }) => {

    const dispatch = useDispatch()
    const sectionData = useSelector(formSectionsDataSelector(formId))
    const formData = useSelector(formSectionsSelector)
    const formInfoId = useSelector(formIdSelector)

    console.log("re-render");

    useEffect(() => {
        dispatch(formSlice.actions.setIsSubmit(false))
    }, [])

    const handlePreSubmit = (data) => {
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (element.required && !element.answer) {
                return false
            }
            if (element.type == "section") {
                const _sectionId = element.options.find(e => e.id == element.answer).to
                const _res = handlePreSubmit(formData.find(e => e.id == _sectionId)?.data || [])
                if (!_res) {
                    return false
                }
            }
        }
        return true
    }

    const handleSubmit = () => {
        dispatch(formSlice.actions.setIsSubmit(true))
        if (!handlePreSubmit(sectionData)) {
            errorNotification("Submit failed", "Check required question", "bottomRight")
        } else {
            successNotification("Form has been sent", "Your request will be processed soon", "bottomRight")
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
            {formInfoId == formId &&
                <div className="w-full flex justify-start items-center">
                    <Button variant="contained" onClick={handleSubmit}>SUBMIT</Button>
                </div>
            }
        </div>
    );
};

export default BodyForm;
