var Db			= require('../').Db,
	_			= require('underscore'),
    should		= require('should');

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
					var keys = _.keys(query.state.starts);
					query.state.starts[keys[0]].should.eql('*');
				});
			});

			describe('if the string is not a *', function(){
				it('should not add a statement to the starts hash', function(){
					var query = new db.Query();
					query.start('jemima');
					var values = _.values(query.state.starts);
					values.should.not.include('jemima');
				});
			});
		});

	});

	describe('#toCypher', function(){
		var db = new Db();
		it('should return a valid simple cypher string with start * values', function(){
			var query = db.Query();
			query.start({n1:'*'}).returns('n1');
			console.log(query.toCypher());
			query.toCypher().should.eql("START n1=node(*) RETURN n1;");
		});

		it('should return a valid simple cypher string with a number value', function(){
			var query = db.Query();
			query.start({n:0}).returns('n');
			query.toCypher().should.eql("START n=node({ n }) RETURN n;");
			query.state.params.n.should.eql(0);
		});
	});

	describe('#exec', function(){
		var db = new Db();
		// describe('with a valid query object looking for all nodes', function(){
		// 	var query = db.Query();
		// 	query.start({n1:'*'}).returns('n1');
		// 	it('should return a data object including the root node', function(done){
		// 		query.exec(function(e,result){
		// 			should.not.exist(e);
		// 			var rootNode = result.data[0][0];
		// 			rootNode.should.be.ok;
		// 			rootNode.should.have.property('self');
		// 			rootNode.self.should.eql('http://localhost:7474/db/data/node/0');
		// 		});
		// 	});
		// });
	});
});