import { Box, Paper, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { areFormElementEqual } from "../../../utils/memo";
import { isSubmitFormSelector } from "../../../redux/selectors";

const RadioForm = ({
  item,
  handleAnswerValue,
}) => {
  const isSubmit = useSelector(isSubmitFormSelector)
  console.log("re-render");

  return (
    <Paper elevation={1} className="my-3 border-l-4 hover:border-l-4 hover:border-blue-500 w-full">
      <Box className="p-6 space-y-8">
        <Typography variant="h5">
          {item.required ? (
            <span>
              <span style={{ color: 'black' }}>{item.value}</span>
              <span style={{ color: 'red' }}> *</span>
            </span>
          ) : (
            item.value
          )}
        </Typography>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(e) => {
              handleAnswerValue(item.id, e.target.value)
            }}
          >
            {(item?.options || []).map(opt => (
              <FormControlLabel key={opt.id} value={opt.id} control={<Radio />} label={opt.value} />
            ))}
          </RadioGroup>
        </FormControl>
        {(item.required && !item.answer) && (isSubmit) ? (
          <div className='text-red-600'>Không được để trống</div>
        ) : null}
      </Box>
    </Paper>
  );
};

export default React.memo(RadioForm, areFormElementEqual);
