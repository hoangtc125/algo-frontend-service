import { v4 } from "uuid";
import React from "react";
import { Box, TextField, Paper, FormGroup, FormControlLabel, Switch, Divider, IconButton, Tooltip, Grid, MenuItem, Select, InputLabel, FormControl, Button } from "@mui/material";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

import { formEl } from "../../../utils/constant";
import { useSelector } from "react-redux";
import { idSectionsSelector } from "../../../redux/selectors";
import { areFormElementEqual } from "../../../utils/memo";

const SectionForm = ({
  item,
  handleValue,
  deleteEl,
  handleRequired,
  handleElType,
  addOption,
  handleOptionValues,
  handleOptionSection,
  deleteOption,
  duplicateElement
}) => {
  const sectionsId = useSelector(idSectionsSelector)

  console.log("re-render");

  //Create new option
  const createNewOption = (id) => {
    const data = {
      id: v4(),
      value: "",
      to: "",
    };
    addOption(id, data);
  };

  return (
    <Paper elevation={1} className="my-3 border-l-4 hover:border-l-4 hover:border-blue-500 w-full">
      <Box sx={{ textAlign: "center" }} className="py-2 cursor-all-scroll hover:bg-blue-100">
        <DragIndicatorIcon
          sx={{ transform: "rotate(-90deg)", cursor: "all-scroll" }}
        />
      </Box>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={1}>
          <Grid item md={9}>
            <TextField
              defaultValue={item.value}
              variant="outlined"
              onBlur={(e) => handleValue(item.id, e)}
              fullWidth
              required={item.required}
              label="Section Label"
              sx={{ mb: 2 }}
            />
            {(item?.options || []).map((opt, key) => (
              <Box className="flex items-center mb-2 space-x-1" key={opt?.id}>
                <RadioButtonCheckedIcon className="mr-2" color="action" />
                <TextField
                  variant="outlined"
                  fullWidth
                  label={`Section Option ${key + 1}`}
                  defaultValue={opt?.value}
                  key={opt?.id}
                  onBlur={(e) =>
                    handleOptionValues(item?.id, opt?.id, e.target.value)
                  }
                />
                <FormControl className="w-full">
                  <InputLabel id="el-to-section-label">To Section</InputLabel>
                  <Select
                    labelId="el-to-section-label"
                    id="el-to-section"
                    label="To Section"
                    value={sectionsId.includes(opt?.to) ? opt?.to : ""}
                    onChange={(e) => handleOptionSection(item?.id, opt?.id, e.target.value)}
                  >
                    <MenuItem key={""} value={""}>
                      No Section
                    </MenuItem>
                    {sectionsId &&
                      sectionsId.map((el) => (
                        <MenuItem key={el} value={el}>
                          {`Section ${el.substr(0, 8)}`}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <Tooltip title="Delete Option" aria-label="delete-option">
                  <IconButton
                    aria-label="delete-option"
                    onClick={() => deleteOption(item.id, opt?.id)}
                    className="w-fit h-fit p-4"
                  >
                    <DeleteOutlineOutlinedIcon color="warn" />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
            <Button variant="text" onClick={() => createNewOption(item.id)}>
              Add Option
            </Button>
          </Grid>
          <Grid item md={3}>
            <FormControl fullWidth>
              <InputLabel id="el-type-label">Type</InputLabel>
              <Select
                labelId="el-type-label"
                id="el-type"
                label="Type"
                value={item.type}
                onChange={(e) => handleElType(item.id, e.target.value)}
              >
                {formEl &&
                  formEl.map((el, key) => (
                    <MenuItem key={key} value={el.value}>
                      {el.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Divider light />
      <FormGroup row sx={{ alignItems: "center" }}>
        <Tooltip title="Delete Element" aria-label="delete-element">
          <IconButton
            aria-label="delete-element"
            onClick={() => deleteEl(item.id)}
            sx={{ ml: 2 }}
          >
            <DeleteOutlineOutlinedIcon color="primary" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Duplicate Element" aria-label="duplicate-element">
          <IconButton
            aria-label="duplicate-element"
            onClick={() => duplicateElement(item)}
            sx={{ ml: 2 }}
          >
            <FileCopyIcon color="primary" />
          </IconButton>
        </Tooltip>

        <FormControlLabel
          control={
            <Switch
              checked={item.required}
              onChange={() => handleRequired(item.id)}
              name="required-field"
              color="primary"
            />
          }
          label="Required"
          sx={{ ml: 2 }}
        />
      </FormGroup>
    </Paper>
  );
};

export default React.memo(SectionForm, areFormElementEqual);
