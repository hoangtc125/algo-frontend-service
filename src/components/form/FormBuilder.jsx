import { Fragment, useState } from "react";
import Nestable from "react-nestable";
import { v4 } from "uuid";
import { Grid, IconButton, Tooltip } from "@mui/material";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DehazeOutlinedIcon from '@mui/icons-material/DehazeOutlined';

import HeaderForm from "./HeaderForm";
import NumberForm from "./elements/NumberForm";
import RadioForm from "./elements/RadioForm";
import TextAreaForm from "./elements/TextAreaForm";
import TextFieldForm from "./elements/TextFieldForm";

import { formEl } from "../../utils/constant";
import SelectForm from "./elements/SelectForm";
import { Space } from "antd";

const FormBuilder = () => {
  const initVal = formEl[0]?.value;

  //State
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState("text");

  const items = data;

  //Function to add new element
  const addElement = () => {
    const data = {
      id: v4(),
      value: "",
      type: formData,
      required: false,
      options: [
        {
          id: v4(),
          value: "",
        }
      ]
    };
    setData((prevState) => [...prevState, data]);
    setFormData(initVal);
  };

  //Function to delete element
  const deleteEl = (id) => {
    setData((prevState) => prevState.filter((val) => val.id !== id));
  };

  //Function to add element at specific pos and return arr
  const addAfter = (elArray, index, newEl) => {
    return [...elArray.slice(0, index + 1), newEl, ...elArray.slice(index + 1)];
  };

  //Function to duplicate element
  const duplicateElement = (sourceEl) => {
    let elIdx = data.findIndex((el) => el.id == sourceEl.id);
    let newEl = {
      ...sourceEl,
      id: v4()
    }
    let newArr = addAfter(data, elIdx, newEl)
    setData(newArr)
  };

  //Function to handle sorting of elements
  const handleOnChangeSort = ({ items }) => {
    setData(items);
  };

  //Function to Handle Input Values
  const handleValue = (id, e) => {
    let newArr = data.map((el) => {
      if (el.id == id) {
        return { ...el, value: e.target.value };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  //Function to Handle Required
  const handleRequired = (id) => {
    let newArr = data.map((el) => {
      if (el.id == id) {
        return { ...el, required: !el.required };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  //Function to Handle Element Type
  const handleElType = (id, type) => {
    let newArr = data.map((el) => {
      if (el.id == id) {
        return { ...el, type: type };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  //Function to Handle Options
  const addOption = (id, newOption) => {
    let newArr = data.map((el) => {
      if (el.id == id) {
        const objVal = el?.options || [];
        return { ...el, options: [...objVal, newOption] };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  //Function to Change Option Values
  const handleOptionValues = (elId, optionId, optionVal) => {
    let newArr = data.map((el) => {
      if (el.id == elId) {
        el?.options &&
          el?.options.map((opt) => {
            if (opt.id == optionId) {
              opt.value = optionVal;
            }
          });
        return el;
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  //Function to Delete Option
  const deleteOption = (elId, optionId) => {
    let newArr = data.map((el) => {
      if (el.id == elId) {
        let newOptions =
          el?.options && el?.options.filter((opt) => opt.id != optionId);
        return { ...el, options: newOptions };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  //Render items
  const renderElements = ({ item }) => {
    switch (item.type) {
      case "text":
        return (
          <TextFieldForm
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            duplicateElement={duplicateElement}
          />
        );
      case "textarea":
        return (
          <TextAreaForm
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            duplicateElement={duplicateElement}
          />
        );
      case "number":
        return (
          <NumberForm
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            duplicateElement={duplicateElement}
          />
        );
      case "radio":
        return (
          <RadioForm
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            addOption={addOption}
            handleOptionValues={handleOptionValues}
            deleteOption={deleteOption}
            duplicateElement={duplicateElement}
          />
        );
      case "select":
        return (
          <SelectForm
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            addOption={addOption}
            handleOptionValues={handleOptionValues}
            deleteOption={deleteOption}
            duplicateElement={duplicateElement}
          />
        );
      default:
        return <Fragment></Fragment>;
    }
  };

  return (
    <Fragment>
      <Grid container spacing={2} direction="row" justifyContent="center" className="p-4">
        <Grid item md={6}>
          <HeaderForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />
          <Nestable
            items={items}
            renderItem={renderElements}
            maxDepth={1}
            onChange={handleOnChangeSort}
          />
        </Grid>
        <Grid item md={1}>
          <Space size={20} className="sticky top-8 flex sm:flex-col items-center w-fit bg-white p-2 rounded-xl shadow-md">
            <Tooltip placement="right" title="Add Element" aria-label="add-element">
              <IconButton
                aria-label="add-element"
                onClick={addElement}
              >
                <AddCircleOutlineOutlinedIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip placement="right" title="Add Section" aria-label="add-section">
              <IconButton
                aria-label="add-section"
                onClick={addElement}
              >
                <DehazeOutlinedIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Space>
        </Grid>
      </Grid>
    </Fragment>
  );
};
export default FormBuilder;
