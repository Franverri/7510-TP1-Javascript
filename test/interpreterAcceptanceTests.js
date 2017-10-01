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

    describe('Substitue vars in rules', function () {

        var regla1 = {
            nombre: "hijo",
            variables: ["X", "Y"],
            facts: "varon(X), padre(Y, X)."
        };
        var varConsulta1 = ["juan", "pepe"];
        it('Query "hijo(juan, pepe)" should return varon(juan), padre(pepe, juan).', function () {
            assert(interpreter.sustituirVariables(regla1, varConsulta1) == "varon(juan), padre(pepe, juan).");
        });

        var regla2 = {
            nombre: "cuatro",
            variables: ["X", "Y", "Z", "K"],
            facts: "uno(Y), dos(Y, X), cuatro(K, Z, Y, X)."
        };
        var varConsulta2 = ["club", "ferro", "carril", "oeste"];
        it('Query "cuatro(club, ferro, carril, oeste)" should return uno(ferro), dos(ferro, club), cuatro(oeste, carril, ferro, club).', function () {
            assert(interpreter.sustituirVariables(regla2, varConsulta2) == "uno(ferro), dos(ferro, club), cuatro(oeste, carril, ferro, club).");
        });
    });

    describe('Multiple facts evaluation', function () {

        var threeFacts = "varon(juan), varon(pepe), mujer(maria).";
        it('varon(juan), varon(pepe), mujer(maria) should be true', function () {
            assert(interpreter.evaluarVariosFacts(threeFacts, db) === true);
        });

        var twoFacts = "varon(juan), padre(juan, pepe).";
        it('varon(juan), padre(juan, pepe) should be true', function () {
            assert(interpreter.evaluarVariosFacts(twoFacts, db) === true);
        });

        var oneWrongFacts = "varon(juan), padre(maria, pepe).";
        it('varon(juan), padre(maria, pepe) should be false', function () {
            assert(interpreter.evaluarVariosFacts(oneWrongFacts, db) === false);
        });
    });

    describe('Identify query', function () {

        var regla2 = {
            nombre: "hijo",
            variables: ["X", "Y"],
            facts: "varon(X), padre(Y, X)."
        };

        var regla3 = {
            nombre: "hija",
            variables: ["X", "Y"],
            facts: "mujer(X), padre(Y, X)."
        };

        var listaReglas = [regla2, regla3];

        //Devuelve true en caso de que sea una regla o false en caso contrario
        it('varon(juan) should be false', function () {
            assert(interpreter.identificarConsulta("varon(juan)", listaReglas) === false);
        });

        it('hijo(juan, pepe) should be true', function () {
            assert(interpreter.identificarConsulta("hijo(juan, pepe)", listaReglas) === true);
        });

    });

});


