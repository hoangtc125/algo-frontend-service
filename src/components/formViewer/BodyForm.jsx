import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import NumberForm from "./elements/NumberForm";
import RadioForm from "./elements/RadioForm";
import TextAreaForm from "./elements/TextAreaForm";
import TextFieldForm from "./elements/TextFieldForm";
import SelectForm from "./elements/SelectForm";
import { formSectionsDataSelector } from "../../redux/selectors";
import SectionForm from "./elements/SectionForm";
import formSlice from "../formBuilder/formSlice";

const BodyForm = ({ formId }) => {

    const dispatch = useDispatch()
    const sectionData = useSelector(formSectionsDataSelector(formId))

    console.log("re-render");

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
        </div>
    );
};

export default BodyForm;
