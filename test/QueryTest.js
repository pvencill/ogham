var Db			= require('../').Db,
		_				= require('underscore'),
    should 	= require('should');

describe('Query', function(){
	var db = new Db();
	it('should be retrievable from the Db', function(){
		var query = db.Query();
		should.exist(query);
		console.log(query);
		query.start.should.be.an.instanceOf(Function);
	});

	describe('#start', function(){
		it('should return the query object', function(){
			var query = db.Query();
			var q2 = query.start({n:'*'});
			q2.should.equal(query);
			q2.state.starts.n.should.eql('*');
		});
		describe('when it is passed a object', function(){
			it('should add the object to the starts collection', function(){
				var query = db.Query();
				var q = {n:'*'};
				query.start(q);
				query.state.starts.n.should.eql('*');
			});
		});
		describe('when it is passed a string', function(){
			describe('if the string is a *', function(){
				it('should generate a numeric id on the starts hash', function(){
					var query = db.Query();
					query.start('*');
					query.state.starts.n1.should.eql('*');
				});
			});

			describe('if the string is not a *', function(){
				it('should not add a statement to the starts hash', function(){
					var query = new db.Query();
					query.start('jemima');
					should.not.exist(query.state.starts.n1);
				});
			});
		});

	});

	describe('#exec', function(){
		describe('when called with empty starts hash', function(){
			var oldSend = db.send;

			before(function(){
				db.send = function(query){ 
					var keys = _.keys(query.state.starts);
					keys.length.should.eql(1);
					query.state.starts[keys[0]].should.eql('*');
				};
			})
			it('should call db#send with start n=node(*) return n;', function(){
				var query = db.Query();
				query.exec();
			});

			after(function(){
				db.send = oldSend;
			})
		})
	});
});