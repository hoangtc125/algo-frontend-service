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
  const [section, setSection] = useState(false)
  const sectionsId = useSelector(idSectionsSelector)
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
              const sectionId = item.options.find(s => s.id == e.target.value).to
              if (sectionId) (
                setSection(sectionId)
              )
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
        (sectionsId.includes(section)) &&
        <FormViewer formId={section} />
      }
    </Paper>
  );
};

export default React.memo(SectionForm, areFormElementEqual);
