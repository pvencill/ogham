var NodeSchemaFactory = require('./NodeSchema');

var Db = function (opts) {
    this._nodes = {};
    this._relationships = {};
    this.options = _.defaults((opts || {}), Db.defaults)
};

Db.defaults = {
    dbUrl:'http://localhost:7474',
    strict:false
}

Db.prototype.NodeSchema = function (name, schemaDefinition, opts) {
    var opts = _.defaults(opts || {}, this.options);
    var Schema = NodeSchemaFactory(this, name, schemaDefinition, opts);
    this._nodes[name] = Schema;
    return Schema;
}

Db.prototype.RelationshipSchema = function (name, schema, opts) {

}

Db.prototype.Query = function (query) {
}

module.exports = Db;