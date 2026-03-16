import { defineStore } from 'pinia';

export const useStyleStore = defineStore('style', {
  state: () => ({
    uiColors: ['#333366ff', '#0b0b44ff'],
  }),
  getters: {
    baseSelectStyles: () => ({
      // Dummy object for backward compatibility if needed during migration,
      // but we are moving to native selects.
    }),
  },
});
