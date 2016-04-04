module.exports = function() {
  return function tracker(req, res, next) {
    var start = process.hrtime();
    res.once('finish', function() {
      var diff = process.hrtime(start);
      var ms = diff[0] * 1e3 + diff[1] * 1e-6;

			req.app.logger.log({
		    type: 'tracker',
		    processingTime: ms
		  });

			req.app.slack.send('#api-activity',
				req.url + '. Processing time: ' + ms + ' ms.');
    });
		next();
  };
};
