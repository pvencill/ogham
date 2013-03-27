var Db = require('../').Db,
    should = require('should');

describe('Db', function () {

    beforeEach(function(){
        var mockNodeSchema = {
            create: function(){}
        }
        var mockRelationshipSchema = {
            create: function(){}
        }
        var mockQuery = {
            create: function(){}
        }

        Db.$inject(mockNodeSchema, mockRelationshipSchema, mockQuery)
    })

    describe('#constructor', function () {

        it('should work with no arguments', function () {
            var db = new Db();
        });

        it('should know where the database is', function(){
            var db = new Db();
            db.options.dbUrl.should.eql('http://localhost:7474');
        });

        it('should override options', function () {
            var db = new Db({strict:true});
            db.options.strict.should.equal(true);
        });

    });

    describe('#NodeSchema', function () {
        var db = new Db();

        it('should register a new schema', function () {
            db.CreateNodeSchema('actors');
            db._nodes.should.have.keys('actors');
        });

    });

});