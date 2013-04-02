var RelationshipSchema = require('../lib/RelationshipSchema'),
    should = require('should'),
    _ = require('underscore');

describe('NodeSchema', function () {

    var db = {};
    var ActsIn;
    var role = 'The Terminator',
        age = 27,
        catchphrase = 'Ill be back'


    function resetSchema(schemaProperties, opts) {
        ActsIn = RelationshipSchema.create(db, 'acts_in', schemaProperties, opts);
    }

    describe('#create', function () {
        it('throws an error if no db instance is provided', function () {
            function createSchemaWithNoDb() {
                RelationshipSchema.create(undefined);
            }

            createSchemaWithNoDb.should.throw();
        });

        it('throws an error if no db schema name is provided', function () {
            function createSchemaWithNoName() {
                RelationshipSchema.create({}, '');
            }

            createSchemaWithNoName.should.throw();
        });
    });

    describe('properties', function () {
        beforeEach(function () {
            resetSchema({
                role: role,
                age: age
            })
        });

        it('allows setting of properties in constructor', function () {
            var bob = new Actor({name:name, dob:dob});
            bob.name.should.equal(name);
            bob.dob.should.equal(dob);
        });

        it('allows setting of properties after construction', function () {
            var bob = new Actor();
            bob.name = name;
            bob.dob = dob;
            bob.name.should.equal(name);
            bob.dob.should.equal(dob);
        });

        it('allows definition of single properties', function () {
            Actor.defineProperty('weight', Number);
            var bob = new Actor({weight:weight});
            bob.weight.should.equal(weight);
        });

        it('allows definition of multiple properties', function () {
            Actor.defineProperty({
                weight:Number,
                height:String
            });

            var bob = new Actor({weight:weight, height:height});
            bob.weight.should.equal(weight);
            bob.height.should.equal(height);
        });

        it('can be enumerated', function () {
            var bob = new Actor({name:name, dob:dob});
            //this is an EXACT match of enumerable keys on the object
            bob.should.have.keys('name', 'dob');
        });

        it('respects setter functions', function () {
            Actor.defineProperty('weight', {
                type:Number,
                setter:function (val) {
                    return val+2;
                }
            });

            var bob = new Actor({
                weight: weight
            });

            bob.weight.should.equal(weight+2);
        });

        it('respects getter functions', function () {
            Actor.defineProperty('weight', {
                type:Number,
                getter:function (val) {
                    return val+3;
                }
            });

            var bob = new Actor({
                weight: weight
            });

            bob.weight.should.equal(weight+3);
        });

        it('respects default values', function(){
            Actor.defineProperty('weight', {
                type:Number,
                default:weight
            });

            var bob = new Actor();

            bob.weight.should.equal(weight);
        });

        describe('in strict mode', function () {
            beforeEach(function () {
                resetActor({
                        name:String,
                        dob:Date
                    },
                    null,
                    {
                        strict:true
                    });
            });

            it('rejects arbitrary values in the constructor', function () {
                var bob = new Actor({name:name, dob:dob, weight:weight});
                should.not.exist(bob.weight);
                bob.should.have.keys('name', 'dob');
            });

            it('rejects arbitrary values after construction', function () {
                var bob = new Actor({name:name, dob:dob});
                bob.weight = weight;
                should.not.exist(bob.weight);
                bob.should.have.keys('name', 'dob');
            });
        });

        describe('in non-strict mode', function () {
            beforeEach(function () {
                resetActor({
                    name:String,
                    dob:Date
                });
            });

            it('allows arbitrary values in the constructor', function () {
                var bob = new Actor({name:name, dob:dob, weight:weight});
                bob.weight.should.equal(weight);
                bob.should.have.keys('name', 'dob', 'weight');
            });

            it('allows arbitrary values after construction', function () {
                var bob = new Actor({name:name, dob:dob});
                bob.weight = weight;
                bob.weight.should.equal(weight);
                bob.should.have.keys('name', 'dob', 'weight');
            });
        });
    });

    describe('relationships', function () {
        beforeEach(function () {
            resetActor({
                    name:String,
                    dob:Date
                },
                {
                    movies:'acts_in',
                    friends:'friends_with'
                },
                {
                    strict:true
                });
        });



    });
});