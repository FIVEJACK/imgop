require('@/bootstrap');
import { appConfig } from 'Config/app';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginAwsLambda from '@bugsnag/plugin-aws-lambda';

// Init App Server
let appServer = null;
if (appConfig.server === 'lambda') {
  const { server } = require('Server/lambda');
  appServer = server;

  const bugsnagHandler = Bugsnag?.getPlugin('awsLambda')?.createHandler();
  if (bugsnagHandler) { module.exports.lambdaHandler = bugsnagHandler(server); }
  exports.handler = appServer;
} else {
  const { server } = require('Server/http-server');
  appServer = server;
}

// Run bugsnag
if (appConfig.bugsnagKey) {
  Bugsnag.start({
    apiKey: appConfig.bugsnagKey,
    plugins: [BugsnagPluginAwsLambda],
  });
}

export default appServer;
