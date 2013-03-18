var format		= require('util').format,
	request		= require('request'),
	handlebars	= require('handlebars'),
	_			= require('underscore');


var REST = {
	node		: '/node/{{{key}}}',
	node_index	: '/index/node'
};

var TOKENS = {
	starts		:	handlebars.compile("{{variable}}=node({ {{{variable}}} })"),
	startsStar  : 	handlebars.compile("{{variable}}=node(*)")
};

module.exports = function(db){
	var Query = function(query, options){
		this.options = _.defaults((options || {}), Query.defaults);
		this.state = {
			starts : {},
			wheres : [],
			matches : [],
			returns : [],
			params : {}
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
				self.state.params[k] = v;
			});
		} else if (_.isNumber(stmt) || (_.isString(stmt) && /^\*$/.test(stmt.trim()))){
			self.state.starts[_.uniqueId('n')] = stmt.trim();
		} 
		return self;
	};

	Query.prototype.returns = function(values) {
		var self = this;
		if(_.isString(values))
			values = [values];
		if(_.isObject(values) && !_.isArray(values)){
			var vals = [];
			_.each(values, function(v,k){
				vals.push(k);
			});
			values = vals;
		}
		_.each(values, function(v,i){
			self.state.returns.push(v);
		});
		return self;
	};

	Query.prototype.toCypher = function() {
		var parts = ['START'];
		var starts = _.map(this.state.starts, function(v,k){
			if(v === '*')
				return TOKENS.startsStar({variable : k});
			return TOKENS.starts({variable : k, value : v}) ;
		});
		parts.push(starts.join(','));

		parts.push('RETURN');
		parts.push(this.state.returns.join(','));
		parts.push(';');
		return parts.join(' ').replace(/\s+/g,' ');
	};

	/*
	cb
		type: function (callback)
	*/
	Query.prototype.exec = function(cb) {
		var self = this;
		var query = self.toCypher();
		request({
			url : db.dbUrl,
			method : 'POST',
			json : {
				query : query,
				params : self.params
			}
		});
	};

	Query.defaults = {
		hostname : 'http://localhost:7474',
		dataPath : '/db/data'
	};

	return Query;
};