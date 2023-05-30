import { createSlice } from '@reduxjs/toolkit';

const formSlice = createSlice({
  name: 'form',
  initialState: { id: null, sections: [] },
  reducers: {
    clear: (state, action) => {
      state.id = null;
      state.sections = [];
    },
    createForm: (state, action) => {
      state.id = action.payload;
      state.sections.push({
        id: action.payload,
        title: "",
        description: "",
        data: [],
      })
    },
    addSection: (state, action) => {
      state.sections.push({
        id: action.payload,
        title: "",
        description: "",
        data: [],
      })
    },
    removeSection: (state, action) => {
      state.sections = state.sections.filter(e => e.id != action.payload) 
    },
    updateSection: (state, action) => {
      const sectionId = action.payload.sectionId
      const sectionIndex = state.sections.findIndex(e => e.id == sectionId)
      state.sections[sectionIndex] = {...state.sections[sectionIndex], ...action.payload.section}
    },
    addElement: (state, action) => {
      const sectionId = action.payload.sectionId
      let section = state.sections.find(e => e.id == sectionId)
      section.data.push(action.payload.element)
    },
    addElementAfter: (state, action) => {
      const sectionId = action.payload.sectionId
      const index = action.payload.index
      let section = state.sections.find(e => e.id == sectionId)
      section.data = [...section.data.slice(0, index + 1), action.payload.element, ...section.data.slice(index + 1)]
    },
    updateElement: (state, action) => {
      const sectionId = action.payload.sectionId
      let section = state.sections.find(e => e.id == sectionId)
      const elementIndex = section.data.findIndex(e => e.id == action.payload.elementId)
      section.data[elementIndex] = {...section.data[elementIndex], ...action.payload.element}
    },
    removeElement: (state, action) => {
      const sectionId = action.payload.sectionId
      let section = state.sections.find(e => e.id == sectionId)
      section.data = section.data.filter(e => e.id != action.payload.elementId)
    },
  },
});

export default formSlice;
