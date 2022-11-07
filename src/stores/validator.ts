import { defineStore } from 'pinia';

type Nullable<T> = T | null;
interface State {
  step: number;
  target: Nullable<string>;
  vaspCode: Nullable<string>;
  licenseKey: Nullable<string>;
  webhookURL: Nullable<string>;
  jwtSecret: Nullable<string>;
  accessTokenExpireSec: Nullable<number>;
  dataEncryptionKey: Nullable<string>;
  adminAccount: Nullable<string>;
  adminPassword: Nullable<string>;
  concurrency: Nullable<number>;
}

export const useValidatorStore = defineStore('validator', {
  state: (): State => ({
    step: 1,
    target: null,
    vaspCode: null,
    licenseKey: null,
    webhookURL: 'https://google.com',
    jwtSecret: 'p@ssWord0',
    accessTokenExpireSec: 3600,
    dataEncryptionKey: '00000000000000000000000000000000',
    adminAccount: 'admin@example.com',
    adminPassword: 'p@ssWord0',
    concurrency: 100,
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
