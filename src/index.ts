require('@/bootstrap');
import { appConfig } from 'Config/app';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginAwsLambda from '@bugsnag/plugin-aws-lambda';

// Prepare bugsnag
if (appConfig.bugsnagKey) {
  Bugsnag.start({
    releaseStage: appConfig.environment,
    enabledReleaseStages: ['production', 'beta'],
    apiKey: appConfig.bugsnagKey,
    plugins: [BugsnagPluginAwsLambda],
  });
}

// Init App Server
let appServer: any;
if (appConfig.server === 'lambda') {
  const { server } = require('Server/lambda');
  appServer = server;
  const bugsnagHandler = Bugsnag?.getPlugin('awsLambda')?.createHandler();
  exports.handler = bugsnagHandler ? bugsnagHandler(appServer) : appServer;
} else {
  appServer = require('Server/http-server');
}

export default appServer;
