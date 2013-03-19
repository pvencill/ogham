var handlebars	= require('handlebars'),
	_			= require('underscore');

exports.queryTemplate = handlebars.compile('START {{#comma_sep starts}}{{>startSwitch}}{{/comma_sep}} {{>return}};');

handlebars.registerPartial('startSwitch', '{{#if star}}{{>startStar}}{{else}}{{>start}}{{/if}}');

handlebars.registerPartial('start', '{{{variable}}}=node({ {{{variable}}} })');

handlebars.registerPartial('startStar', '{{{variable}}}=node(*)');

handlebars.registerPartial('return', 'RETURN {{#comma_sep returns}}{{{this}}}{{/comma_sep}}');
// TODO: matches and wheres

handlebars.registerHelper('comma_sep', function(items, options){
	var out = '';
	if(_.isArray(items)){
		var arr = _.map(items, options.fn);
		out = arr.join(',');
	}else{
		out = options.fn(items);
	}

	return out;
});