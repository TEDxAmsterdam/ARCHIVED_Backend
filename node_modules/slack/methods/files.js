'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _files = require('./files.delete');

var _files2 = _interopRequireDefault(_files);

var _files3 = require('./files.info');

var _files4 = _interopRequireDefault(_files3);

var _files5 = require('./files.list');

var _files6 = _interopRequireDefault(_files5);

var _files7 = require('./files.upload');

var _files8 = _interopRequireDefault(_files7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  delete: _files2.default,
  info: _files4.default,
  list: _files6.default,
  upload: _files8.default
};
module.exports = exports['default'];