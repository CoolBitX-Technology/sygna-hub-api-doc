import { defineStore } from 'pinia';
import type { Config, Nullable } from 'src/components/models';

interface State {
  step: number;
  target: Nullable<string>;
  config: Config;
}

export const useValidatorStore = defineStore('validator', {
  state: (): State => ({
    step: 1,
    target: 'config.yml',
    config: {
      settings: {
        vaspCode: null,
        licenseKey: null,
        webhookURL: 'https://google.com',
        jwtSecret: 'p@ssWord0',
        accessTokenExpireSec: 3600,
        dataEncryptionKey: '00000000000000000000000000000000',
        adminAccount: 'admin@example.com',
        adminPassword: 'p@ssWord0',
        concurrency: 100,
      },
      db: {
        driver: 'postgres',
        user: 'admin',
        password: 'p@ssWord0',
        host: 'localhost',
        port: 5432,
        name: 'db',
      },
    },
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
