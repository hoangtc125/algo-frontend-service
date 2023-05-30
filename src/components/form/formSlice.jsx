import { createSlice } from '@reduxjs/toolkit';

const formSlice = createSlice({
  name: 'form',
  initialState: { id: null, sections: [] },
  reducers: {
    createForm: (state, action) => {
      state.id = action.payload.id;
      state.sections.push({
        id: action.payload.id,
        data: [],
      })
    },
    addSection: (state, action) => {
      state.sections.push({
        id: action.payload.id,
        title: action.payload.title,
        description: action.payload.description,
        data: [],
      })
    },
    updateTitleSection: (state, action) => {
      const sectionId = action.payload.sectionId
      let section = state.sections.find(e => e.id == sectionId)
      section.title = action.payload.title
    },
    updateDescriptionSection: (state, action) => {
      const sectionId = action.payload.sectionId
      let section = state.sections.find(e => e.id == sectionId)
      section.description = action.payload.description
    },
    updateTitleSection: (state, action) => {
      const sectionId = action.payload.sectionId
      let section = state.sections.find(e => e.id == sectionId)
      section.title = action.payload.title
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
      let element = section.data.find(e => e.id == action.payload.element.id)
      element = action.payload.element
    },
    removeElement: (state, action) => {
      const sectionId = action.payload.sectionId
      let section = state.sections.find(e => e.id == sectionId)
      section.data = section.data.filter(e => e != action.payload.elementId)
    },
  },
});

export default formSlice;
