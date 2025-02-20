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
        jwtSecret: '',
        accessTokenExpireSec: 3600,
        dataEncryptionKey: '00000000000000000000000000000000',
        adminAccount: 'admin@example.com',
        adminPassword: '',
        concurrency: 100,
      },
      db: {
        driver: 'postgres',
        user: 'admin',
        password: '',
        host: 'localhost',
        port: 5432,
        name: 'db',
      },
      server: {
        host: '0.0.0.0',
        port: 8080,
        enableRotateLog: true,
        enableCORS: true,
        allowOrigins: [
          'http://localhost:8000'
        ],
        callbackHost: null,
      },
      googleLogin: {
        id: null,
        secret: null
      },
      logFile: {
        fileName: 'temp',
        maxSize: 100,
        maxBackups: 30,
        maxAge: 30
      },
      emailService: {
        host: null,
        account: null,
        password: '',
        displayName: 'Hub Sender',
        subjectPrefix: '[TEST]'
      },
      frontend: {
        url: null,
      },
      trisaServer: {
        url: 'http://localhost:8081',
        host: '0.0.0.0',
        port: 443,
        restfulPort: 8081
      },
      shyftServer: {
        rpcURL: 'ws://shyft-realy:8545'
      }
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
