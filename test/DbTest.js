var Db = require('../').Db,
    should = require('should'),
    sinon = require('sinon'),
    _ = require('underscore');

describe('Db', function () {
    var mockNodeSchema,
        mockRelationshipSchema,
        mockQuery,
        db;

    beforeEach(function(){
        mockNodeSchema = {
            create: sinon.stub().returns(function(){})
        }
        mockRelationshipSchema = {
            create: function(){}
        }
        mockQuery = {
            create: function(){}
        }

        Db.$inject(mockNodeSchema, mockRelationshipSchema, mockQuery)

        db = new Db();
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

    describe('#createNodeSchema', function () {
        var db = new Db();

        it('calls the NodeSchema factory create method with correct arguments', function(){
            var definition = {},
                opts = {}
            db.createNodeSchema('actors', definition, opts);

            mockNodeSchema.create.calledWith(db,'actors', definition, _.defaults(opts, db.options)).should.be.ok;
        });

        it('returns the Schema constructor', function(){
            var ReturnedSchema = db.createNodeSchema('actors');
            var CreatedSchema = mockNodeSchema.create(db, 'actors');

            ReturnedSchema.should.equal(CreatedSchema);
        });
    });

    describe('#getNodeSchmea', function(){
        it('retrieves created schemas', function(){
            var Schema = db.createNodeSchema('actors');

            db.getNodeSchema('actors').should.equal(Schema);
        });
    });

});