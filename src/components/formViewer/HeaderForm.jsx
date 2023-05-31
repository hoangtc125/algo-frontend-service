import { Fragment } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";

import { descriptionSectionSelector, titleSectionSelector } from "../../redux/selectors";

const HeaderForm = ({ sectionId }) => {

  const title = useSelector(titleSectionSelector(sectionId))
  const description = useSelector(descriptionSectionSelector(sectionId))
  console.log("re-render");

  return (
    <Fragment>
      <Box sx={{ mb: 3 }}>
        <Paper elevation={2} sx={{ p: 3, borderTop: "8px solid #272bb0" }}>
          <Typography variant="h2" gutterBottom className="w-full">
            {title}
          </Typography>
          <Typography variant="h4" gutterBottom className="w-full">
            {description}
          </Typography>
        </Paper>
      </Box>
    </Fragment>
  );
};

export default HeaderForm;
