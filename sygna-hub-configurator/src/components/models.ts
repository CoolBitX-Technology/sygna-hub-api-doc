export type Nullable<T> = T | null;

export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export type Config = {
  settings: {
    vaspCode: Nullable<string>;
    licenseKey: Nullable<string>;
    webhookURL: Nullable<string>;
    jwtSecret: Nullable<string>;
    accessTokenExpireSec: Nullable<number>;
    dataEncryptionKey: Nullable<string>;
    adminAccount: Nullable<string>;
    adminPassword: Nullable<string>;
    concurrency: Nullable<number>;
  };
  db: {
    driver: Nullable<string>;
    user: Nullable<string>;
    password: Nullable<string>;
    host: Nullable<string>;
    port: Nullable<number>;
    name: Nullable<string>;
  };
  server: {
    host: Nullable<string>;
    port: Nullable<number>;
    enableRotateLog: boolean;
    enableCORS: boolean;
    allowOrigins: string[];
    callbackHost: Nullable<string>;
  };
  googleLogin: {
    id: Nullable<string>;
    secret: Nullable<string>;
  };
  logFile: {
    fileName: Nullable<string>;
    maxSize: Nullable<number>;
    maxBackups: Nullable<number>;
    maxAge: Nullable<number>;
  };
  emailService: {
    host: Nullable<string>;
    account: Nullable<string>;
    password: Nullable<string>;
    displayName: Nullable<string>;
    subjectPrefix: Nullable<string>;
  };
  frontend: {
    url: Nullable<string>;
  };
  trisaServer: {
    url: Nullable<string>;
    host: Nullable<string>;
    port: Nullable<number>;
    restfulPort: Nullable<number>;
  };
  shyftServer: {
    rpcURL: Nullable<string>;
  };
};
