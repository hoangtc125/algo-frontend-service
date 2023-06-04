import { v4 } from "uuid";
import { Grid, IconButton, Tooltip } from "@mui/material";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Space } from "antd";
import { useDispatch } from "react-redux";

import HeaderForm from "./HeaderForm";
import formSlice from "./formSlice";
import BodyForm from "./BodyForm";

const FormBuilder = ({ formId }) => {

  const dispatch = useDispatch()

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

  return (
    <Grid container spacing={2} direction="row" justifyContent="center" className="p-4">
      <Grid item xs={11} md={8}>
        <HeaderForm sectionId={formId} />
        <BodyForm formId={formId} />
      </Grid>
      <Grid item xs={1} md={1}>
        <Space size={20} className="sticky top-8 flex sm:flex-col items-center w-fit bg-white p-2 rounded-xl shadow-md">
          <Tooltip placement="right" title="Thêm câu hỏi" aria-label="add-element">
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
