import { createSlice } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

import { FORM_BUILDER } from '../../utils/constant';

const formStoreSlice = createSlice({
  name: 'formStore',
  initialState: { forms: [], selected: FORM_BUILDER },
  reducers: {
    clear: (state, action) => {
      state.forms = [];
      state.selected = FORM_BUILDER
    },
    fakeStore: (state, action) => {
      state.forms = [
        {
          id: FORM_BUILDER.id,
          title: FORM_BUILDER.sections.find(e => e.id == FORM_BUILDER.id).title,
          description: FORM_BUILDER.sections.find(e => e.id == FORM_BUILDER.id).description,
        },
        {
          id: v4(),
          title: "Đơn trống",
          description: "",
        },
      ]
    },
    createStore: (state, action) => {
      state.forms = [
        {
          id: FORM_BUILDER.id,
          title: FORM_BUILDER.sections.find(e => e.id == FORM_BUILDER.id).title,
          description: FORM_BUILDER.sections.find(e => e.id == FORM_BUILDER.id).description,
          sections: FORM_BUILDER.sections,
        },
        ...action.payload.map(form => {
          return {
            id: form.id,
            title: form.sections.find(e => e.id == form.id).title,
            description: form.sections.find(e => e.id == form.id).description,
            sections: form.sections,
          }
        })
      ]
    },
    addForm: (state, action) => {
      state.forms.push(action.payload)
    },
    setSelected: (state, action) => {
      state.selected = state.forms.find(e => e.id == action.payload)
    },
  },
});

export default formStoreSlice;
