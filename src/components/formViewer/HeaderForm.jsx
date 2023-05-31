import { Fragment } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { descriptionSectionSelector, titleSectionSelector } from "../../redux/selectors";

const HeaderForm = ({ sectionId }) => {

  const dispatch = useDispatch()
  const title = useSelector(titleSectionSelector(sectionId))
  const description = useSelector(descriptionSectionSelector(sectionId))

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
