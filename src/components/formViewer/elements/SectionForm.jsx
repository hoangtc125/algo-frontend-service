import { Box, Paper, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useState } from "react";
import FormViewer from "../FormViewer";

const SectionForm = ({
  item,
  handleAnswerValue,
}) => {
  const [section, setSection] = useState(false)
  console.log(section);

  return (
    <Paper elevation={1} className="my-3 border-l-4 hover:border-l-4 hover:border-blue-500 w-full">
      <Box className="p-6 space-y-8">
        <Typography variant="h5">
          {item.required ? `${item.value} (bắt buộc)` : item.value}
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
      </Box>
      {
        section &&
        <FormViewer formId={section}/>
      }
    </Paper>
  );
};

export default SectionForm;
