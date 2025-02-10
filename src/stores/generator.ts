import { defineStore } from 'pinia';

type Nullable<T> = T | null;

interface Backend {
  callbackHost: string;
  enableRotateLog: boolean;
    // Log File (if enable_rotate_log is set to true)
    //     - file_name
    //     - max_size
    //     - max_backups
    //     - max_age
  enableCors: boolean;
  allowOrigins: string[];
}

interface DB {
  driver: string;
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
}
interface State {
  step: number;
  target: Nullable<string>;
  vaspCode: Nullable<string>;
  licenseKey: Nullable<string>;
  backend: Backend;
  db: DB;
  webhookURL: Nullable<string>;
}

export const useGeneratorStore = defineStore('generator', {
  state: (): State => ({
    step: 1,
    target: null,
    vaspCode: null,
    licenseKey: null,
    backend: {
      callbackHost: '',
      enableRotateLog: true,
      enableCors: true,
      allowOrigins: [],
    },
    db: {
      driver: 'postgres',
      host: '',
      port: 3306,
      user: '',
      password: '',
      name: '',
    },
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
