import React from "react";
import { Box, TextField, Paper, FormGroup, FormControlLabel, Switch, Divider, IconButton, Tooltip, Grid, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import { formEl } from "../../../utils/constant";
import { areFormElementEqual } from "../../../utils/memo"

const TextFieldForm = ({ item, handleValue, deleteEl, handleRequired, handleElType, duplicateElement }) => {
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
              disabled={item.disabled}
              label="Câu hỏi"
              sx={{ mb: 2 }}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Câu trả lời 1 dòng"
              disabled
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="el-type-label">Loại</InputLabel>
              <Select
                labelId="el-type-label"
                id="el-type"
                label="Type"
                value={item.type}
                disabled={item.disabled}
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
      {
        item.disabled
          ?
          <p className="text-base text-start ml-6 my-2 text-red-500">Câu hỏi bắt buộc của hệ thống</p>
          :
          <FormGroup row sx={{ alignItems: "center" }}>
            <Tooltip title="Xóa câu hỏi" aria-label="delete-element">
              <IconButton
                aria-label="delete-element"
                onClick={() => deleteEl(item.id)}
                sx={{ ml: 2 }}
              >
                <DeleteOutlineOutlinedIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sao chép câu hỏi" aria-label="duplicate-element">
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
              label="Bắt buộc"
              sx={{ ml: 2 }}
            />
          </FormGroup>
      }
    </Paper>
  );
};

export default React.memo(TextFieldForm, areFormElementEqual);
