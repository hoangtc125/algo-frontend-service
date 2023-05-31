import { createSlice } from '@reduxjs/toolkit';

import { FORM_BUILDER } from '../../utils/constant';

const formStoreSlice = createSlice({
  name: 'formStore',
  initialState: { forms: [] },
  reducers: {
    clear: (state, action) => {
      state.forms = [];
    },
    fakeStore: (state, action) => {
      state.forms = [{
        id: FORM_BUILDER.id,
        title: FORM_BUILDER.sections.find(e => e.id == FORM_BUILDER.id).title,
        description: FORM_BUILDER.sections.find(e => e.id == FORM_BUILDER.id).description,
      }]
    },
    addForm: (state, action) => {
      state.forms.push(action.payload)
    },
  },
});

export default formStoreSlice;
