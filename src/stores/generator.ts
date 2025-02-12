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

export enum EmailEncryptionMode {
  None = 'NONE',
  SSLTLS = 'SSL/TLS',
  StartTLS = 'STARTTLS',
}
interface EmailService {
  host: string;
  port: number;
  account: string;
  password: string;
  displayName: string;
  subjectPrefix: string;
  encryptionMode: EmailEncryptionMode;
  fromEmail: string;
}

interface Security {
  jwtSecret: string;
  accessTokenExpireSec: number;
  dataEncryptionKey: string;
}

interface Admin {
  account: string;
  password: string;
}

interface GoogleSSO {
  id: string;
  secret: string;
}

export enum ContainerWorkType {
  Default = '',
  API = 'api',
  Cronjob = 'cronjob',
}

interface Advanced {
  concurrency: number;
  workType: ContainerWorkType;
  transactionConcurrency: number;
  webhookUrl: string;
}

interface State {
  step: number;
  target: Nullable<string>;
  vaspCode: Nullable<string>;
  licenseKey: Nullable<string>;
  backend: Backend;
  db: DB;
  emailService: EmailService;
  security: Security;
  admin: Admin;
  googleSSO: GoogleSSO;
  advanced: Advanced;
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
      port: 5432,
      user: '',
      password: '',
      name: '',
    },
    emailService: {
      host: '',
      port: 587,
      account: '',
      password: '',
      displayName: '',
      subjectPrefix: '',
      encryptionMode: EmailEncryptionMode.None,
      fromEmail: '',
    },
    security: {
      jwtSecret: '',
      accessTokenExpireSec: 3600,
      dataEncryptionKey: '',
    },
    admin: {
      account: '',
      password: '',
    },
    googleSSO: {
      id: '',
      secret: '',
    },
    advanced: {
      concurrency: 100,
      workType: ContainerWorkType.Default,
      transactionConcurrency: 50,
      webhookUrl: '',
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
