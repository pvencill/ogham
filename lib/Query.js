var format	= require('util').format,
	_		= require('underscore');

// single curly templating
_.templateSettings = {
  interpolate : /\{(.+?)\}/g
};

var REST = {
	node		: '/node/{key}',
	node_index	: '/index/node'
};

module.exports = function(db){
	var Query = function(query, options){
		this.options = _.defaults((options || {}), Query.defaults);
		this.state = {
			starts : {},
			wheres : [],
			matches : [],
			returns : []
		};
	};
	/*
	stmt
     type: String || Number || Object || Array
     */
	Query.prototype.start = function(stmt) {
		var self = this;
		if(_.isObject(stmt)){
			_.each(stmt, function(v,k){
				self.state.starts[k] = v;
			});
		} else if (_.isString(stmt) && /^\*$/.test(stmt.trim())){
			self.state.starts[_.uniqueId('n')] = stmt;
		}
		return self;
	};

	Query.prototype.exec = function(cb) {
		var self = this;
		if(_.keys(self.state.starts).length === 0){
			self.start('*');
		}

		if(self.state.returns.length === 0){
			_.each(self.state.starts, function(v,k){
				self.state.returns.push(k);
			})
		};
		db.send(this, cb);
	};

	Query.defaults = {
		hostname : 'http://localhost:7474',
		dataPath : '/db/data'
	};

	return Query;
};