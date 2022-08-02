export interface IConfig {
  environment: string;
  bugsnagKey?: string;
  server?: string;
  httpPort?: number;
}

const appConfig: IConfig = {
  environment: process.env.ENV || 'development',
  bugsnagKey: process.env.BUGSNAG_API_KEY,
  server: process.env.SERVER,
  httpPort: +(process.env.HTTP_PORT || 7000),
};

export { appConfig };
