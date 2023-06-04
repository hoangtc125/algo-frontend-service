import { createSlice } from '@reduxjs/toolkit';

import { FORM_BUILDER } from '../../utils/constant';

const formStoreage = JSON.parse(sessionStorage.getItem("formViewer"))

const formSlice = createSlice({
  name: 'form',
  initialState: { id: formStoreage?.id, sections: formStoreage?.sections || [], isSubmit: false },
  reducers: {
    clear: (state, action) => {
      state.id = null;
      state.sections = [];
      state.isSubmit = false
    },
    setIsSubmit: (state, action) => {
      state.isSubmit = action.payload
    },
    fakeForm: (state, action) => {
      state.id = FORM_BUILDER.id;
      state.sections = FORM_BUILDER.sections
    },
    createForm: (state, action) => {
      state.id = action.payload;
      state.sections.push({
        id: action.payload,
        title: "Đơn tuyển thành viên",
        description: "",
        data: [
          {
            id: '162b384f-b495-4c8a-b2d4-f3462c12147d',
            value: 'Email cá nhân',
            type: 'text',
            answer: '',
            disabled: true,
            required: true,
            options: [
              {
                id: '85000685-e1c5-4447-bb8f-3a541f45be7b',
                value: '',
                to: ''
              }
            ]
          },
          {
            id: '04ed6a64-26f6-45ad-abd5-bf1c9d425608',
            value: 'Họ và tên',
            type: 'text',
            answer: '',
            disabled: true,
            required: true,
            options: [
              {
                id: '2a92e6d4-2ac8-4379-94d6-36cc75ae4c75',
                value: '',
                to: ''
              }
            ]
          },
        ],
      })
    },
    addSection: (state, action) => {
      state.sections.push({
        id: action.payload,
        title: `Biểu mẫu ${action.payload.substr(0, 8)}`,
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
      state.sections[sectionIndex] = { ...state.sections[sectionIndex], ...action.payload.section }
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
      section.data[elementIndex] = { ...section.data[elementIndex], ...action.payload.element }
    },
    removeElement: (state, action) => {
      const sectionId = action.payload.sectionId
      let section = state.sections.find(e => e.id == sectionId)
      section.data = section.data.filter(e => e.id != action.payload.elementId)
    },
  },
});

export default formSlice;
