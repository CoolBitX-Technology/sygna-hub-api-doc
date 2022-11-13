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
};
