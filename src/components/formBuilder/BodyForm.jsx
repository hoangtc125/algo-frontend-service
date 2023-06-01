import { useEffect } from "react";
import { v4 } from "uuid";
import { Box} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import NumberForm from "./elements/NumberForm";
import RadioForm from "./elements/RadioForm";
import TextAreaForm from "./elements/TextAreaForm";
import TextFieldForm from "./elements/TextFieldForm";
import SelectForm from "./elements/SelectForm";
import { formSelector } from "../../redux/selectors";
import formSlice from "./formSlice";
import SectionForm from "./elements/SectionForm";

const BodyForm = ({ formId }) => {

    const dispatch = useDispatch()
    const formData = useSelector(formSelector)
    const sectionData = formData.sections.find(e => e.id == formId).data || []

    console.log("re-render");

    useEffect(() => {
        let saveInterval = null
        if (formData.id == formId) {
            saveInterval = setInterval(() => {
                sessionStorage.setItem("formViewer", JSON.stringify(formData))
                console.log("auto-save form builder");
            }, 3000);
        }
        return () => {
            clearInterval(saveInterval)
        }
    }, [formData])

    //Function to delete element
    const deleteEl = (id) => {
        dispatch(formSlice.actions.removeElement({ sectionId: formId, elementId: id }))
    };

    //Function to duplicate element
    const duplicateElement = (sourceEl) => {
        let elIdx = sectionData.findIndex((el) => el.id == sourceEl.id);
        let newEl = {
            ...sourceEl,
            id: v4()
        }
        dispatch(formSlice.actions.addElementAfter({ sectionId: formId, element: newEl, index: elIdx }))
    };

    //Function to Handle Input Values
    const handleValue = (id, e) => {
        dispatch(formSlice.actions.updateElement({ sectionId: formId, elementId: id, element: { value: e.target.value } }))
    };

    //Function to Handle Required
    const handleRequired = (id) => {
        const el = sectionData.find(e => e.id == id)
        dispatch(formSlice.actions.updateElement({ sectionId: formId, elementId: id, element: { required: !el.required } }))
    };

    //Function to Handle Element Type
    const handleElType = (id, type) => {
        dispatch(formSlice.actions.updateElement({ sectionId: formId, elementId: id, element: { type: type } }))
    };

    //Function to Handle Options
    const addOption = (id, newOption) => {
        const el = sectionData.find(e => e.id == id)
        dispatch(formSlice.actions.updateElement({ sectionId: formId, elementId: id, element: { options: [...(el?.options || []), newOption] } }))
    };

    //Function to Change Option Values
    const handleOptionValues = (elId, optionId, optionVal) => {
        const el = sectionData.find(e => e.id == elId)
        const newOptions = el?.options.map((opt) => {
            if (opt.id == optionId) {
                return { ...opt, value: optionVal }
            } else {
                return opt
            }
        });
        dispatch(formSlice.actions.updateElement({ sectionId: formId, elementId: elId, element: { options: newOptions } }))
    };

    //Function to Change Option to Section
    const handleOptionSection = (elId, optionId, optionVal) => {
        const el = sectionData.find(e => e.id == elId)
        const newOptions = el?.options.map((opt) => {
            if (opt.id == optionId) {
                return { ...opt, to: optionVal }
            } else {
                return opt
            }
        });
        dispatch(formSlice.actions.updateElement({ sectionId: formId, elementId: elId, element: { options: newOptions } }))
    };

    //Function to Delete Option
    const deleteOption = (elId, optionId) => {
        const el = sectionData.find(e => e.id == elId)
        const newOptions = el?.options.filter((opt) => opt.id != optionId);
        dispatch(formSlice.actions.updateElement({ sectionId: formId, elementId: elId, element: { options: newOptions } }))
    };

    //Render items
    const renderElements = (item) => {
        switch (item.type) {
            case "section":
                return (
                    <SectionForm
                        key={item.id}
                        item={item}
                        handleValue={handleValue}
                        deleteEl={deleteEl}
                        handleRequired={handleRequired}
                        handleElType={handleElType}
                        addOption={addOption}
                        handleOptionValues={handleOptionValues}
                        handleOptionSection={handleOptionSection}
                        deleteOption={deleteOption}
                        duplicateElement={duplicateElement}
                    />
                );
            case "text":
                return (
                    <TextFieldForm
                        key={item.id}
                        item={item}
                        handleValue={handleValue}
                        deleteEl={deleteEl}
                        handleRequired={handleRequired}
                        handleElType={handleElType}
                        duplicateElement={duplicateElement}
                    />
                );
            case "textarea":
                return (
                    <TextAreaForm
                        key={item.id}
                        item={item}
                        handleValue={handleValue}
                        deleteEl={deleteEl}
                        handleRequired={handleRequired}
                        handleElType={handleElType}
                        duplicateElement={duplicateElement}
                    />
                );
            case "number":
                return (
                    <NumberForm
                        key={item.id}
                        item={item}
                        handleValue={handleValue}
                        deleteEl={deleteEl}
                        handleRequired={handleRequired}
                        handleElType={handleElType}
                        duplicateElement={duplicateElement}
                    />
                );
            case "radio":
                return (
                    <RadioForm
                        key={item.id}
                        item={item}
                        handleValue={handleValue}
                        deleteEl={deleteEl}
                        handleRequired={handleRequired}
                        handleElType={handleElType}
                        addOption={addOption}
                        handleOptionValues={handleOptionValues}
                        deleteOption={deleteOption}
                        duplicateElement={duplicateElement}
                    />
                );
            case "select":
                return (
                    <SelectForm
                        key={item.id}
                        item={item}
                        handleValue={handleValue}
                        deleteEl={deleteEl}
                        handleRequired={handleRequired}
                        handleElType={handleElType}
                        addOption={addOption}
                        handleOptionValues={handleOptionValues}
                        deleteOption={deleteOption}
                        duplicateElement={duplicateElement}
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
