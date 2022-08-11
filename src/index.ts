require('@/bootstrap');
import { appConfig } from 'Config/app';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginAwsLambda from '@bugsnag/plugin-aws-lambda';

// Init App Server
let appServer = null;
if (appConfig.server === 'lambda') {
  appServer = require('Server/lambda');
  exports.handler = appServer;
} else {
  appServer = require('Server/http-server');
}

// Run bugsnag
if (appConfig.bugsnagKey) {
  Bugsnag.start({
    releaseStage: appConfig.environment,
    enabledReleaseStages: ['production', 'beta'],
    apiKey: appConfig.bugsnagKey,
    plugins: [BugsnagPluginAwsLambda],
  });

  if (appConfig.server === 'lambda') {
    const bugsnagHandler = Bugsnag.getPlugin('awsLambda')?.createHandler();
    module.exports.lambdaHandler = bugsnagHandler ? bugsnagHandler(appServer) : module.exports.lambdaHandler;
  }
}

export default appServer;
