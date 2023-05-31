import { Box, Paper, Typography, FormControl, FormControlLabel, Checkbox } from "@mui/material";
import React, { useState } from "react";
import { areFormElementEqual } from "../../../utils/memo";

const SelectForm = ({
  item,
  handleAnswerValue,
}) => {
  const [selectedValues, setSelectedValues] = useState([]);
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
          {item.required ? `${item.value} (bắt buộc)` : item.value}
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
      </Box>
    </Paper>
  );
};

export default React.memo(SelectForm, areFormElementEqual);
