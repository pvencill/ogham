var _ = require('underscore'),
    na = require('./utils/underscore.observable'),
    normalizeProperty = require('./utils/normalizeProperty'),
    normalizeRelationship = require('./utils/normalizeRelationship');

exports.$inject = function () {
}

exports.create = function (db, schemaName, schemaProps, schemaRels, opts) {
    /*
     schema: {}
     type: String || Number || Date || Boolean TODO: support neo4js native types as strings - http://docs.neo4j.org/chunked/milestone/graphdb-neo4j-properties.html
     default: val,
     index: {} describes indexing options
     getter: function
     setter: function
     */
    if (!db) {
        throw new Error('A db instance is required to create a schema');
    }
    if (!schemaName) {
        throw new Error('A schema name is required to create a schema');
    }

    opts = opts || {}
    var schemaProperties = {};
    var schemaRelationships = {};
    var strict = opts.strict;

    function init() {
        Schema.defineProperty(schemaProps || {});
        Schema.defineRelationship(schemaRels || {});
    }

    var Schema = function (props) {
        var self = this;
        var properties = {};
        var prevProperties = {};

        //private variable revealing the schema of any model object
        Object.defineProperty(this, '_SCHEMA', {
            value:schemaName
        });

        _.each(schemaProperties, function (definition, key) {
            Object.defineProperty(self, key, {
                enumerable:true,
                configurable:false,
                get:function () {
                    var val = properties[key];
                    if (definition.getter) {
                        val = definition.getter(val);
                    }
                    return val;
                },
                set:function (val) {
                    if (definition.setter) {
                        val = definition.setter(val);
                    }

                    //TODO: think about type coercion?

                    prevProperties[key] = properties[key];
                    properties[key] = val;
                }
            });

            if(definition.default) {
                self[key] = definition.default;
            }
        });

        _.each(schemaRelationships, function(definition, key){
            Object.defineProperty(self, key, {
                enumerable:true,
                configurable:false,
                get:function () {
                    return properties[key];
                },
                set: function(val){
                    properties[key] = _.observe(val, arrayChanged);
                }
            });

            function arrayChanged(){
                //TODO: deal with changing relationship arrays
            }

            self[key] = null;
        });

        if (strict) {
            Object.preventExtensions(self);
        }

        _.each(props, function (attr, key) {
            self[key] = attr;
        });

    };

    //static methods
    Schema.defineProperty = function (name, definition) {
        var self = this;
        if (_.isObject(name)) {
            _.each(name, function (val, key) {
                self.defineProperty(key, val);
            });
        } else {
            schemaProperties[name] = normalizeProperty(definition);
        }
    }

    Schema.defineRelationship = function (name, definition) {
        var self = this;
        if (_.isObject(name)) {
            _.each(name, function (val, key) {
                self.defineRelationship(key, val);
            });
        } else {
            schemaRelationships[name] = normalizeRelationship(definition);
        }
    }

    Schema.all = function (filter, cb) {
        return db.Query(filter).start().execute(cb);
    }

    Schema.prototype.isValid = function(){

    }

    //model methods
    Schema.prototype.save = function () {
        var self = this;
        var attrs = _.pick(self, _.keys(schemaProperties));
        _.extend(attrs, self);
        return attrs;
        //TODO: run query to save attrs
    };
    Schema.prototype.destroy = function () {

    };
    Schema.prototype.load = function (relationship) {

    };

    init();

    return Schema;
}
