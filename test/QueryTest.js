var Query = require('../lib/Query'),
    _ = require('underscore'),
    should = require('should');

describe('Query', function () {
    var query;

    beforeEach(function(){
        var mockRequest = {};
        var mockDb = {};

        Query.$inject(mockRequest);

        query = Query.create(mockDb);
    })

    describe('#start', function () {
        it('should return the query object', function () {
            var q2 = query.start({n:'*'});
            q2.should.equal(query);
            q2.state.starts.n.should.eql('*');
        });
        describe('when it is passed a object', function () {
            it('should add the object to the starts collection', function () {
                var q = {n:'*'};
                query.start(q);
                query.state.starts.n.should.eql('*');
            });
        });
        describe('when it is passed a string', function () {
            describe('if the string is a *', function () {
                it('should generate a numeric id on the starts hash', function () {
                    query.start('*');
                    var keys = _.keys(query.state.starts);
                    query.state.starts[keys[0]].should.eql('*');
                });
            });

            describe('if the string is not a *', function () {
                it('should not add a statement to the starts hash', function () {
                    query.start('jemima');
                    var values = _.values(query.state.starts);
                    values.should.not.include('jemima');
                });
            });
        });

    });

    describe('#toCypher', function () {
        it('should return a valid simple cypher string with start * values', function () {
            query.start({n1:'*'}).returns('n1');
            console.log(query.toCypher());
            query.toCypher().should.eql("START n1=node(*) RETURN n1;");
        });

        it('should return a valid simple cypher string with a number value', function () {
            query.start({n:0}).returns('n');
            query.toCypher().should.eql("START n=node({ n }) RETURN n;");
            query.state.params.n.should.eql(0);
        });
    });

    describe('#exec', function () {
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