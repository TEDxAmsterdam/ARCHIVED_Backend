var logger = require('logfmt');
/**
 * Logger module.
 * @author dligthart
 * @version 0.1
 * @constructor
 */
module.exports = function (loopbackApplication, options) {
  loopbackApplication.use(function (req, res, next) {
    next();
  });

	var Logger = function() {};

	Logger.prototype.logInfo = function(msg) {
		logger.log({
	    type: 'info',
	    msg: msg
	  });
	};

	Logger.prototype.logDebug = function(msg) {
		logger.log({
	    type: 'debug',
	    msg: msg
	  });
	};

	Logger.prototype.logError = function(msg) {
		logger.log({
	    type: 'error',
	    msg: msg
	  });
	};

	Logger.prototype.log = function(obj) {
		logger.log(obj);
	};

	loopbackApplication.logger = new Logger();
};
