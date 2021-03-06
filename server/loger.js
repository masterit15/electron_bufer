const log4js = require("log4js");

log4js.configure({
  appenders: {
    everything: {
      type: 'multiFile', base: 'logs/', property: 'name', extension: '.log',
    }
  },
  categories: {
    default: { appenders: [ 'everything' ], level: 'debug'}
  }
});

const fileSharing = log4js.getLogger('file_sharing');
const appDiagnostic = log4js.getLogger('app_diagnostic');
const userConnections = log4js.getLogger('user_connections');


fileSharing.addContext('name', 'file_sharing'); 
appDiagnostic.addContext('name', 'app_diagnostic');
userConnections.addContext('name', 'user_connections');


// fileSharing.info('New file created');
// logger.trace("Entering cheese testing");
// logger.debug("Got cheese.");
// logger.info("Cheese is Comté.");
// logger.warn("Cheese is quite smelly.");
// logger.error("Cheese is too ripe!");
// logger.fatal("Cheese was breeding ground for listeria.");
const logger = {
  fileSharing,
  appDiagnostic,
  userConnections
}
module.exports = logger