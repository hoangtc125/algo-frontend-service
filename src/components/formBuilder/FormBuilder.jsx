import Nestable from "react-nestable";
import { v4 } from "uuid";
import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Space } from "antd";
import { useDispatch, useSelector } from "react-redux";

import HeaderForm from "./HeaderForm";
import NumberForm from "./elements/NumberForm";
import RadioForm from "./elements/RadioForm";
import TextAreaForm from "./elements/TextAreaForm";
import TextFieldForm from "./elements/TextFieldForm";
import SelectForm from "./elements/SelectForm";
import { formIdSelector, formSectionsDataSelector } from "../../redux/selectors";
import formSlice from "./formSlice";
import SectionForm from "./elements/SectionForm";
import { errorNotification } from "../../utils/notification"

const FormBuilder = ({ formId }) => {

  const dispatch = useDispatch()
  const sectionData = useSelector(formSectionsDataSelector(formId))
  const formInfoId = useSelector(formIdSelector)

  console.log("re-render");

  //Function to add new element
  const addElement = () => {
    const data = {
      id: v4(),
      value: "",
      type: "text",
      answer: "",
      required: false,
      options: [
        {
          id: v4(),
          value: "",
          to: "",
        }
      ]
    };
    dispatch(formSlice.actions.addElement({ sectionId: formId, element: data }))
  };

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

  //Function to handle sorting of elements
  const handleOnChangeSort = ({ items }) => {
    dispatch(formSlice.actions.updateSection({ sectionId: formId, section: { data: items } }))
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
    if (formInfoId == formId) {
      dispatch(formSlice.actions.updateElement({ sectionId: formId, elementId: id, element: { type: type } }))
    } else {
      if (type == "section") {
        errorNotification("Bad action", "You can add a redirect question in sub form", "bottomRight")
      } else {
        dispatch(formSlice.actions.updateElement({ sectionId: formId, elementId: id, element: { type: type } }))
      }
    }
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
      <Grid container spacing={2} direction="row" justifyContent="center" className="p-4">
        <Grid item xs={11} md={8}>
          <HeaderForm sectionId={formId} />
          <div className="w-full flex flex-col items-center">
            {sectionData.map(e => {return renderElements(e)})}
          </div>
        </Grid>
        <Grid item xs={1} md={1}>
          <Space size={20} className="sticky top-8 flex sm:flex-col items-center w-fit bg-white p-2 rounded-xl shadow-md">
            <Tooltip placement="right" title="Add Element" aria-label="add-element">
              <IconButton
                aria-label="add-element"
                onClick={addElement}
              >
                <AddCircleOutlineOutlinedIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Space>
        </Grid>
      </Grid>
  );
};
export default FormBuilder;
