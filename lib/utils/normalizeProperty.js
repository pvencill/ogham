var _ = require('underscore');

module.exports = function(property){
    if(_.isString(property)) {
        property = {type: property};
    }

    property = _.defaults(property, {
        default: undefined,
        getter: undefined,
        setter: undefined,
        validate: undefined
    })

    return property
}