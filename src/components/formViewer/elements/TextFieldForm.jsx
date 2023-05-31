import { Box, TextField, Paper, Typography } from "@mui/material";
import React from "react";
import { areFormElementEqual } from "../../../utils/memo";


const TextFieldForm = ({ item, handleAnswerValue }) => {
  console.log("re-render");

  return (
    <Paper elevation={1} className="my-3 border-l-4 hover:border-l-4 hover:border-blue-500 w-full">
      <Box className="p-6 space-y-8">
        <Typography variant="h5">
          {item.required ? `${item.value} (bắt buộc)` : item.value}
        </Typography>
        <TextField
          variant="standard"
          fullWidth
          onBlur={(e) => { handleAnswerValue(item.id, e.target.value) }}
          placeholder="Câu trả lời của bạn"
        />
      </Box>
    </Paper>
  );
};

export default React.memo(TextFieldForm, areFormElementEqual);
