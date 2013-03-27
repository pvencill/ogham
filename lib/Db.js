var _ = require('underscore'),
    NodeSchema,
    RelationshipSchema,
    Query;

module.exports = Db;

module.exports.$inject = function ($nodeSchema, $relationshipSchema, $query) {
    NodeSchema = $nodeSchema;
    RelationshipSchema = $relationshipSchema;
    Query = $query;
}

function Db(opts) {
    this._nodes = {};
    this._relationships = {};
    this.options = _.defaults((opts || {}), Db.defaults);
};

Db.defaults = {
    dbUrl:'http://localhost:7474',
    strict:false
};

Db.prototype.CreateNodeSchema = function (name, schemaDefinition, opts) {
    opts = _.defaults(opts || {}, this.options);
    var Schema = NodeSchema.create(this, name, schemaDefinition, opts);
    this._nodes[name] = Schema;
    return Schema;
};

Db.prototype.getNodeSchema = function (name) {
    return this._nodes[name];
}

Db.prototype.CreateRelationshipSchema = function (name, schemaDefinition, opts) {
    opts = _.defaults(opts || {}, this.options);
    var Schema = RelationshipSchema.create(this, name, schemaDefinition, opts);
    this._relationships[name] = Schema;
    return Schema;
};

Db.prototype.getRelationshipSchema = function (name) {
    return this._relationships[name];
}

Db.prototype.Query = function (query, opts) {
    return Query.create(this, query, opts);
};

