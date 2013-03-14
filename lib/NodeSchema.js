var _ = require('underscore');

module.exports = function NodeSchemaFactory(db, schemaName, schemaDefinition, opts) {
    /*
     schema: {}
     type: String || Number || Date || Boolean TODO: support neo4js native types as strings - http://docs.neo4j.org/chunked/milestone/graphdb-neo4j-properties.html
    default: val,
    index: {} descripts indexing options
    getter: function
    setter: function
     */
    var relationships = {};
    var strict = opts.strict;

    var Schema = function (attrs) {
        var self = this;
        var attributes = {};
        var prevAttributes = {};

        //private variable revealing the schema of any model object
        Object.defineProperty(this, '_SCHEMA', {
            value:schemaName
        });

        _.each(schemaDefinition, function (definition, key) {
            Object.defineProperty(self, key, {
                enumerable: true,
                configurable: false,
                get:function () {
                    var val = attributes[key];
                    if(definition.getter) {
                        val = definition.getter(val);
                    }
                    return val;
                },
                set:function (val) {
                    if(definition.setter) {
                        val = definition.setter(val);
                    }

                    //TODO: think about type coercion?

                    prevAttributes[key] = attributes[key];
                    attributes[key] = val;
                }
            })
        });

        if(strict) {
            Object.preventExtensions(self);
        }

        _.each(attrs, function (attr, key) {
            self[key] = attr;
        });

    };

    //static methods
    Schema.defineProperty = function (name, definition) {
        var self = this;
        if(_.isObject(name)) {
            _.each(name, function(val, key){
                self.defineProperty(key, val);
            });
        } else {
            schemaDefinition[name] = definition;
        }
    }

    Schema.defineRelationship = function (name, definition) {
        var self = this;
        if(_.isObject(name)) {
            _.each(name, function(val, key){
                self.defineRelationship(key, val);
            });
        } else {
            relationships[name] = definition;
        }
    }

    //model methods
    Schema.prototype.save = function () {
        var self = this;
        var attrs = _.pick(self, _.keys(schemaDefinition));
        _.extend(attrs, self);
        return attrs;
        //TODO: run query to save attrs
    };
    Schema.prototype.destroy = function () {

    };
    Schema.prototype.load = function () {

    };

    return Schema;
}