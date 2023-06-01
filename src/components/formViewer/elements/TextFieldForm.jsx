import { Box, TextField, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { areFormElementEqual } from "../../../utils/memo";
import { isSubmitFormSelector } from "../../../redux/selectors";


const TextFieldForm = ({ item, handleAnswerValue }) => {
  const [isClick, setIsClick] = useState(false)
  const isSubmit = useSelector(isSubmitFormSelector)
  console.log("re-render");

  return (
    <Paper elevation={1} className="my-3 border-l-4 hover:border-l-4 hover:border-blue-500 w-full">
      <Box className="p-6 space-y-8" id={item.id}>
        <Typography variant="h5" className="whitespace-pre-line">
          {item.required ? (
            <span>
              <span style={{ color: 'black' }}>{item.value}</span>
              <span style={{ color: 'red' }}> *</span>
            </span>
          ) : (
            item.value
          )}
        </Typography>
        <TextField
          variant="standard"
          fullWidth
          onBlur={(e) => {
            handleAnswerValue(item.id, e.target.value)
            setIsClick(true)
          }}
          defaultValue={item.answer}
          placeholder="Câu trả lời của bạn"
        />
        {(item.required && !item.answer) && (isClick || isSubmit) ? (
          <div className='text-red-600'>Không được để trống</div>
        ) : null}
      </Box>
    </Paper>
  );
};

export default React.memo(TextFieldForm, areFormElementEqual);
