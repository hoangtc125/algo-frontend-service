import { Box, Paper, Typography, FormControl, FormControlLabel, Checkbox } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { areFormElementEqual } from "../../../utils/memo";
import { isSubmitFormSelector } from "../../../redux/selectors";

const SelectForm = ({
  item,
  handleAnswerValue,
}) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const isSubmit = useSelector(isSubmitFormSelector)
  console.log("re-render");

  const handleChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    let newData = []
    if (isChecked) {
      newData = [...selectedValues, value]
    } else {
      newData = selectedValues.filter((val) => val !== value)
    }
    handleAnswerValue(item.id, newData)
    setSelectedValues(newData);
  };

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
          {(item?.options || []).map(opt => (
            <FormControlLabel
              key={opt.id}
              control={
                <Checkbox
                  value={opt.id}
                  onChange={handleChange}
                />
              }
              label={opt.value}
            />
          ))}
        </FormControl>
        {(item.required && !item.answer) && (isSubmit) ? (
          <div className='text-red-600'>Không được để trống</div>
        ) : null}
      </Box>
    </Paper>
  );
};

export default React.memo(SelectForm, areFormElementEqual);
