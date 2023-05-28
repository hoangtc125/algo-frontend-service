import { createSelector } from '@reduxjs/toolkit';

export const accountSelector = (state) => state.app.account
export const tokenSelector = (state) => state.app.token
export const ipSelector = (state) => state.camera.ip
export const imagesSelector = (state) => state.camera.images
export const cameraLoadingSelector = (state) => state.camera.loading
export const singleSelector = (state) => state.camera.single