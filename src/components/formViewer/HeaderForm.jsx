import { Box, Divider, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";

import { descriptionSectionSelector, titleSectionSelector } from "../../redux/selectors";

const HeaderForm = ({ sectionId }) => {

  const title = useSelector(titleSectionSelector(sectionId))
  const description = useSelector(descriptionSectionSelector(sectionId))
  console.log("re-render");

  return (
    <Box sx={{ mb: 3 }}>
      <Paper elevation={2} sx={{ p: 3, borderTop: "8px solid #272bb0" }}>
        <Typography variant="h2" gutterBottom className="w-full">
          {title}
        </Typography>
        <Divider />
        <Typography variant="h5" gutterBottom className="w-full pt-4">
          {description}
        </Typography>
      </Paper>
    </Box>
  );
};

export default HeaderForm;
