import { createSelector } from '@reduxjs/toolkit';

export const accountSelector = (state) => state.app.account
export const tokenSelector = (state) => state.app.token

export const ipSelector = (state) => state.camera.ip
export const imagesSelector = (state) => state.camera.images
export const cameraLoadingSelector = (state) => state.camera.loading
export const singleSelector = (state) => state.camera.single

export const formSelector = (state) => state.form
export const formSectionsDataSelector = id => (state) => state.form.sections.find(e => e.id == id).data || []
export const idSectionsSelector = (state) => state.form.sections.slice(1).map(e => e.id) || []
export const infoSectionsSelector = (state) => state.form.sections.slice(1).map(e => { return {id: e.id, title: e.title}}) || []
export const infoFormSelector = (state) => state.form.sections.map(e => e.title) || []
export const titleSectionSelector = id => (state) => state.form.sections.find(e => e.id == id).title
export const descriptionSectionSelector = id => (state) => state.form.sections.find(e => e.id == id).description
export const formIdSelector = (state) => state.form.id
export const isSubmitFormSelector = (state) => state.form.isSubmit

export const formStoreSelector = (state) => state.formStore.forms