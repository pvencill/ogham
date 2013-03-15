var NodeSchemaFactory = require('../lib/NodeSchema'),
    should = require('should'),
    _ = require('underscore');

describe('NodeSchema', function(){

    var db = {};
    var Actor;
    var name = 'bob',
        dob = '12/12/12',
        weight = 125,
        height = "5' 6";

    function resetActor(schemaDefinition, opts) {
        Actor = NodeSchemaFactory(db, 'actors', schemaDefinition, opts);
    }

    describe('#constructor', function(){
        beforeEach(function(){
            resetActor({
                name: String,
                dob: Date
            }, {
                strict: true
            });
        });

        it('allows setting of properties in constructor', function(){
            var bob = new Actor({name: name, dob: dob});
            bob.name.should.equal(name);
            bob.dob.should.equal(dob);
        });

        it('allows setting of properties after construction', function(){
            var bob = new Actor();
            bob.name = name;
            bob.dob = dob;
            bob.name.should.equal(name);
            bob.dob.should.equal(dob);
        });

        it('allows definition of single properties', function(){
            Actor.defineProperty('weight', Number);
            var bob = new Actor({weight: weight});
            bob.weight.should.equal(weight);
        });

        it('allows definition of multiple properties', function(){
            Actor.defineProperty({
                weight: Number,
                height: String
            });

            var bob = new Actor({weight: weight, height: height});
            bob.weight.should.equal(weight);
            bob.height.should.equal(height);
        });

        it('can be enumerated', function(){
            var bob = new Actor({name: name, dob: dob});
            //this is an EXACT match of enumerable keys on the object
            bob.should.have.keys('name', 'dob');
        });
    });

    describe('in strict mode', function(){
        beforeEach(function(){
            resetActor({
                name: String,
                dob: Date
            }, {
                strict: true
            });
        });

        it('rejects arbitrary values in the constructor', function (){
            var bob = new Actor({name: name, dob: dob, weight: weight});
            should.not.exist(bob.weight);
            bob.should.have.keys('name', 'dob');
        });

        it('rejects arbitrary values after construction', function (){
            var bob = new Actor({name: name, dob: dob});
            bob.weight = weight;
            should.not.exist(bob.weight);
            bob.should.have.keys('name', 'dob');
        });
    });

    describe('in non-strict mode', function(){
        beforeEach(function(){
            resetActor({
                name: String,
                dob: Date
            });
        });

        it('allows arbitrary values in the constructor', function (){
            var bob = new Actor({name: name, dob: dob, weight: weight});
            bob.weight.should.equal(weight);
            bob.should.have.keys('name', 'dob', 'weight');
        });

        it('allows arbitrary values after construction', function (){
            var bob = new Actor({name: name, dob: dob});
            bob.weight = weight;
            bob.weight.should.equal(weight);
            bob.should.have.keys('name', 'dob', 'weight');
        });
    });
});