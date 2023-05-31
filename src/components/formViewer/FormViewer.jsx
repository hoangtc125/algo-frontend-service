import { Button, Grid } from "@mui/material";
import { useSelector } from "react-redux";

import HeaderForm from "./HeaderForm";
import { formIdSelector } from "../../redux/selectors";
import BodyForm from "./BodyForm";

const FormViewer = ({ formId }) => {

  const formInfoId = useSelector(formIdSelector)

  console.log("re-render");

  return (
    <Grid container spacing={2} direction="row" justifyContent="center" className="p-4">
      <Grid item xs={11} md={10}>
        <HeaderForm sectionId={formId} />
        <BodyForm formId={formId} />
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
