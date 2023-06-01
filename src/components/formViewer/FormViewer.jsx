import { Grid } from "@mui/material";

import HeaderForm from "./HeaderForm";
import BodyForm from "./BodyForm";

const FormViewer = ({ formId }) => {

  console.log("re-render");

  return (
    <Grid container spacing={2} direction="row" justifyContent="center" className="p-4">
      <Grid item xs={11} md={10}>
        <HeaderForm sectionId={formId} />
        <BodyForm formId={formId} />
      </Grid>
    </Grid>
  );
};
export default FormViewer;
