var _ = require('underscore');

module.exports = function(property){
    if(_.isString(property)) {
        property = {schema: property};
    }

    property = _.defaults(property, {
        loading: 'lazy'
    });

    return property
}