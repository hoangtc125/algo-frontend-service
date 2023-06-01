import { Box, TextField, Paper, FormGroup, FormControlLabel, Switch, Divider, IconButton, Tooltip, Grid, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import React from "react";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import { formEl } from "../../../utils/constant";
import { areFormElementEqual } from "../../../utils/memo";

const TextAreaForm = ({
  item,
  handleValue,
  deleteEl,
  handleRequired,
  handleElType,
  duplicateElement,
}) => {
  console.log("re-render");

  return (
    <Paper elevation={1} className="my-3 border-l-4 hover:border-l-4 hover:border-blue-500 w-full">
      <Box sx={{ textAlign: "center" }} className="py-2 cursor-all-scroll hover:bg-blue-100">
        <DragIndicatorIcon
          sx={{ transform: "rotate(-90deg)", cursor: "all-scroll" }}
        />
      </Box>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={1}>
          <Grid item xs={9}>
            <TextField
              defaultValue={item.value}
              variant="outlined"
              onBlur={(e) => handleValue(item.id, e)}
              multiline
              fullWidth
              required={item.required}
              label="Textarea Label"
              sx={{ mb: 2 }}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="TextareaIInput Field"
              disabled
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={3}>
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

export default React.memo(TextAreaForm, areFormElementEqual);
