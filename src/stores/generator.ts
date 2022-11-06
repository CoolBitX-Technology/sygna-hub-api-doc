import { defineStore } from 'pinia';

type Nullable<T> = T | null;
interface State {
  step: number;
  target: Nullable<string>;
  vaspCode: Nullable<string>;
  licenseKey: Nullable<string>;
  webhookURL: Nullable<string>;
}

export const useGeneratorStore = defineStore('generator', {
  state: (): State => ({
    step: 1,
    target: null,
    vaspCode: null,
    licenseKey: null,
    webhookURL: 'https://google.com',
  }),
  getters: {},
  actions: {
    nextStep() {
      this.step++;
    },
    prevStep() {
      this.step--;
    },
  },
});
