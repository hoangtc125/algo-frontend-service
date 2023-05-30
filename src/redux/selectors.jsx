import { createSelector } from '@reduxjs/toolkit';

export const accountSelector = (state) => state.app.account
export const tokenSelector = (state) => state.app.token
export const ipSelector = (state) => state.camera.ip
export const imagesSelector = (state) => state.camera.images
export const cameraLoadingSelector = (state) => state.camera.loading
export const singleSelector = (state) => state.camera.single
export const formSectionsSelector = id => (state) => state.form.sections.find(e => e.id == id)
export const formSectionsDataSelector = id => (state) => state.form.sections.find(e => e.id == id).data
export const idSectionsSelector = (state) => state.form.sections.slice(1).map(e => e.id)
export const titleSectionSelector = id => (state) => state.form.sections.find(e => e.id == id).title
export const descriptionSectionSelector = id => (state) => state.form.sections.find(e => e.id == id).description