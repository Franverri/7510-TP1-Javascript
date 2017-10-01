var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var Interpreter = require('../src/interpreter');


describe("Interpreter", function () {

    var db = [
        "varon(juan).",
        "varon(pepe).",
        "varon(hector).",
        "varon(roberto).",
        "varon(alejandro).",
        "mujer(maria).",
        "mujer(cecilia).",
        "padre(juan, pepe).",
        "padre(juan, pepa).",
        "padre(hector, maria).",
        "padre(roberto, alejandro).",
        "padre(roberto, cecilia).",
        "hijo(X, Y) :- varon(X), padre(Y, X).",
        "hija(X, Y) :- mujer(X), padre(Y, X)."
    ];

    var interpreter = null;

    before(function () {
        // runs before all tests in this block
    });

    after(function () {
        // runs after all tests in this block
    });

    beforeEach(function () {
        // runs before each test in this block
        interpreter = new Interpreter();
        interpreter.parseDB(db);
    });

    afterEach(function () {
        // runs after each test in this block
    });


    describe('Interpreter Facts', function () {

        it('varon(juan) should be true', function () {
            assert(interpreter.checkQuery('varon(juan)'));
        });

        it('varon(maria) should be false', function () {
            assert(interpreter.checkQuery('varon(maria)') === false);
        });

        it('mujer(cecilia) should be true', function () {
            assert(interpreter.checkQuery('mujer(cecilia)'));
        });

        it('padre(juan, pepe) should be true', function () {
            assert(interpreter.checkQuery('padre(juan, pepe)') === true);
        });

        it('padre(mario, pepe) should be false', function () {
            assert(interpreter.checkQuery('padre(mario, pepe)') === false);
        });

    });

    describe('Interpreter Rules', function () {

        it('hijo(pepe, juan) should be true', function () {
            assert(interpreter.checkQuery('hijo(pepe, juan)') === true);
        });
        it('hija(maria, roberto) should be false', function () {
            assert(interpreter.checkQuery('hija(maria, roberto)') === false);
        });
        it('hijo(pepe, juan) should be true', function () {
            assert(interpreter.checkQuery('hijo(pepe, juan)'));
        });
    });

    describe('Query syntax', function () {

        it('varon(juan) should be true', function () {
            assert(interpreter.verificarSintaxisQuery('varon(juan)') === true);
        });
        it('hijo(juan, pepe) should be true', function () {
            assert(interpreter.verificarSintaxisQuery('hijo(juan, pepe)') === true);
        });
        it('varon juan should be false', function () {
            assert(interpreter.verificarSintaxisQuery('varon juan') === false);
        });
        it('hijo[juan, pepe] should be false', function () {
            assert(interpreter.verificarSintaxisQuery('hijo[juan, pepe]') === false);
        });
    });

    describe('Database syntax', function () {

        var rigthDB = db;
        var wrongDB1 = [
            "varon(juan)",
            "varon(pepe).",
            "hija(X, Y) :- mujer(X), padre(Y, X)."
         ];

         var wrongDB2 = [
            "varon(juan).",
            "varon(pepe).",
            "padre juan, pepe.",
            "hija(X, Y) :- mujer(X), padre(Y, X)."
         ];

        //La función devuelve -1 en caso de que toda la BDD sea correcta y sino retorna el número
        //de línea del primer error encontrado (Empezando a contar desde el cero como primer línea).
        it('rigthDB should be true', function () {
            assert(interpreter.verificarSintaxisBDD(rigthDB) == -1);
        });

        it('wrongDB1 should return 0', function () {
            assert(interpreter.verificarSintaxisBDD(wrongDB1) == 0);
        });

        it('wrongDB2 should return 2', function () {
            assert(interpreter.verificarSintaxisBDD(wrongDB2) == 2);
        });

    });

});


