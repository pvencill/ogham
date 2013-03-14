var NodeSchema = function (name, definition, opts){

};

NodeSchema.prototype.defineAttribute = function(){
	throw new Error('not implemented');
};

NodeSchema.prototype.defineRelationship = function(){
	throw new Error('not implemented');
};

NodeSchema.prototype.create = function(data){
	throw new Error('not implemented');
};

module.exports = NodeSchema;