import { Fragment } from "react";
import { Box, TextField, Paper } from "@mui/material";

const HeaderForm = ({ title, description, setTitle, setDescription }) => {
  return (
    <Fragment>
      <Box sx={{ mb: 3 }}>
        <Paper elevation={2} sx={{ p: 3, borderTop: "8px solid #272bb0" }}>
          <TextField
            defaultValue={title}
            onBlur={(e) => setTitle(e.target.value)}
            variant="standard"
            label="Form Title"
            name="title"
            sx={{ mb: 3 }}
            fullWidth
          />
          <TextField
            name="description"
            defaultValue={description}
            onBlur={(e) => setDescription(e.target.value)}
            variant="standard"
            label="Form Description"
            fullWidth
            sx={{ mb: 2 }}
            multiline
            rows={2}
          />
        </Paper>
      </Box>
    </Fragment>
  );
};

export default HeaderForm;
