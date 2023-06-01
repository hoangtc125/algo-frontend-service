import { Box, Paper, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import FormViewer from "../FormViewer";
import { areFormElementEqual } from "../../../utils/memo";
import { idSectionsSelector, isSubmitFormSelector } from "../../../redux/selectors";

const SectionForm = ({
  item,
  handleAnswerValue,
}) => {
  const [value, setValue] = useState(item.answer)
  const sectionsId = useSelector(idSectionsSelector)
  const isSubmit = useSelector(isSubmitFormSelector)
  const sectionId = item.options.find(s => s.id == value)?.to
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
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            value={value}
            onChange={(e) => {
              handleAnswerValue(item.id, e.target.value)
              setValue(e.target.value)
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
      {
        (sectionsId.includes(sectionId)) &&
        <FormViewer formId={sectionId} />
      }
    </Paper>
  );
};

export default React.memo(SectionForm, areFormElementEqual);
