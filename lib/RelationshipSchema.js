var _ = require('underscore'),
    na = require('./utils/underscore.observable'),
    normalizeProperty = require('./utils/normalizeProperty');

exports.$inject = function () {
}

exports.create = function (db, schemaName, schemaProps, opts) {

    if (!db) {
        throw new Error('A db instance is required to create a schema');
    }
    if (!schemaName) {
        throw new Error('A schema name is required to create a schema');
    }

    opts = opts || {}
    var schemaProperties = {},
        startSchema,
        endSchema;
    var strict = opts.strict;

    function init() {
        //reserve start and end schema limitations if set,
        //but drop them from property definitions
        startSchema = schemaProps._start;
        endSchema = schemaProps._end;
        delete schemaProps._start;
        delete schemaProps._end;

        Schema.defineProperty(schemaProps || {});
    }

    //TODO: _start and _end are required!
    var Schema = function (props) {
        var self = this;
        var startNode,
            endNode

        Object.defineProperty(this, '_SCHEMA', {
            value:schemaName
        });

        Object.defineProperty(this, '_start', {
            enumerable:true,
            configurable:false,
            get: function(){
                return startNode
            },
            set: function(val){

            }
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

        if (strict) {
            Object.preventExtensions(self);
        }

    }

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

    init();
};
