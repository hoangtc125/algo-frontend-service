import { Box, TextField, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { descriptionSectionSelector, titleSectionSelector } from "../../redux/selectors";
import formSlice from "./formSlice";

const HeaderForm = ({ sectionId }) => {

  const dispatch = useDispatch()
  const title = useSelector(titleSectionSelector(sectionId))
  const description = useSelector(descriptionSectionSelector(sectionId))

  console.log("re-render");

  return (
    <Box sx={{ mb: 3 }}>
      <Paper elevation={2} sx={{ p: 3, borderTop: "8px solid #272bb0" }}>
        <TextField
          defaultValue={title}
          onBlur={(e) => dispatch(formSlice.actions.updateSection({ sectionId: sectionId, section: { title: e.target.value } }))}
          variant="standard"
          label="Form Title"
          name="title"
          sx={{ mb: 3 }}
          fullWidth
        />
        <TextField
          name="description"
          defaultValue={description}
          onBlur={(e) => dispatch(formSlice.actions.updateSection({ sectionId: sectionId, section: { description: e.target.value } }))}
          variant="standard"
          label="Form Description"
          fullWidth
          sx={{ mb: 2 }}
          multiline
          rows={2}
        />
      </Paper>
    </Box>
  );
};

export default HeaderForm;
