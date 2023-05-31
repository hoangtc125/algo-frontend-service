import Nestable from "react-nestable";
import { Box, Button, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import HeaderForm from "./HeaderForm";
import NumberForm from "./elements/NumberForm";
import RadioForm from "./elements/RadioForm";
import TextAreaForm from "./elements/TextAreaForm";
import TextFieldForm from "./elements/TextFieldForm";
import SelectForm from "./elements/SelectForm";
import { formIdSelector, formSectionsDataSelector } from "../../redux/selectors";
import SectionForm from "./elements/SectionForm";
import formSlice from "../form/formSlice";

const FormViewer = ({ formId }) => {

  const dispatch = useDispatch()
  const sectionData = useSelector(formSectionsDataSelector(formId))
  const formInfoId = useSelector(formIdSelector)

  console.log("re-render");

  //Function to handle sorting of elements
  const handleOnChangeSort = ({ items }) => {
    dispatch(formSlice.actions.updateSection({ sectionId: formId, section: { data: items } }))
  };

  //Function to Handle Input Values
  const handleAnswerValue = (id, answer) => {
    dispatch(formSlice.actions.updateElement({ sectionId: formId, elementId: id, element: { answer: answer } }))
  };

  //Render items
  const renderElements = ({ item }) => {
    switch (item.type) {
      case "section":
        return (
          <SectionForm
            item={item}
            handleAnswerValue={handleAnswerValue}
          />
        );
      case "text":
        return (
          <TextFieldForm
            item={item}
            handleAnswerValue={handleAnswerValue}
          />
        );
      case "textarea":
        return (
          <TextAreaForm
            item={item}
            handleAnswerValue={handleAnswerValue}
          />
        );
      case "number":
        return (
          <NumberForm
            item={item}
            handleAnswerValue={handleAnswerValue}
          />
        );
      case "radio":
        return (
          <RadioForm
            item={item}
            handleAnswerValue={handleAnswerValue}
          />
        );
      case "select":
        return (
          <SelectForm
            item={item}
            handleAnswerValue={handleAnswerValue}
          />
        );
      default:
        return <Box></Box>;
    }
  };

  return (
    <Grid container spacing={2} direction="row" justifyContent="center" className="p-4">
      <Grid item xs={11} md={10}>
        <HeaderForm sectionId={formId} />
        <Nestable
          items={sectionData}
          renderItem={renderElements}
          maxDepth={1}
          onChange={handleOnChangeSort}
        />
        {
          formInfoId == formId &&
          <div className="w-full flex justify-start items-center">
            <Button variant="contained">SUBMIT</Button>
          </div>
        }
      </Grid>
    </Grid>
  );
};
export default FormViewer;
