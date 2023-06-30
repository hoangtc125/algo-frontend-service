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

export const clusterSelector = (state) => state.cluster
export const clusterHeaderSelector = (state) => state.cluster.header
export const clusterDatasetSelector = (state) => state.cluster.dataset
export const supervisedSetSelector = (state) => state.cluster.supervisedSet
export const nameColSelector = (state) => state.cluster.nameCol
export const emailColSelector = (state) => state.cluster.emailCol
export const supervisedOptionsSelector = (state) => state.cluster.supervisedOptions
export const selectedRecordSelector = (state) => state.cluster.selectedRecord

export const clusterFileSelector = (state) => state.clusterFile

export const clusteringSelector = (state) => state.clustering
export const deployLogSelector = (state) => state.clustering.deployLog
export const clusterLogSelector = (state) => state.clustering.clusteringLog
export const processSelector = (state) => state.clustering.process

export const clusterHistorySelector = (state) => state.clusterHistory.histories

export const positionSelector = (state) => state.map.position
export const mapEditSelector = (state) => state.map.edit

export const clubInfoSelector = (state) => state.club.info
export const clubIdSelector = (state) => state.club.id
export const clubMembersSelector = (state) => state.club.members || []
export const clubGroupsSelector = (state) => state.club.groups || []
export const selectModeSelector = (state) => state.club.select
export const selectedUserSelector = (state) => state.club.selectedUser
export const eventsSelector = (state) => state.club.events