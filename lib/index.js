var nject = require('nject');
nject.config(require('./nject.json'), __dirname);

exports.Db = require('./Db');