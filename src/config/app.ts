export interface IConfig {
  environment: string;
  bugsnagKey?: string;
  server?: string;
  httpPort?: number;
  fetchRetry?: number;
  fetchTimeout?: number;
}

const appConfig: IConfig = {
  environment: process.env.ENV || 'development',
  bugsnagKey: process.env.BUGSNAG_API_KEY,
  server: process.env.SERVER,
  httpPort: +(process.env.HTTP_PORT || 7000),
  fetchRetry: +(process.env.FETCH_RETRY || 3),
  fetchTimeout: +(process.env.FETCH_TIMEOUT || 3000)
};

export { appConfig };
