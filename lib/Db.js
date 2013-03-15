var NodeSchemaFactory	= require('./NodeSchema'),
	QueryFactory		= require('./Query'),
    _					= require('underscore');

var Db = function (opts) {
    this._nodes = {};
    this._relationships = {};
    this.options = _.defaults((opts || {}), Db.defaults);
};

Db.defaults = {
    dbUrl:'http://localhost:7474',
    strict:false
};

Db.prototype.NodeSchema = function (name, schemaDefinition, opts) {
    opts = _.defaults(opts || {}, this.options);
    var Schema = NodeSchemaFactory(this, name, schemaDefinition, opts);
    this._nodes[name] = Schema;
    return Schema;
};

Db.prototype.RelationshipSchema = function (name, schema, opts) {

};

Db.prototype.Query = function (query, opts) {
	var Query = QueryFactory(this);
	return new Query(query,opts);
};

module.exports = Db;