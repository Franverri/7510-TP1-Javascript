var Interpreter = function () {

	var db;

	//Verifica que la linea tenga la sintaxys correcta
	function verificarSintaxisLinea(linea){
		return ((linea.includes("(")) && (linea.includes(")")) && (linea.includes(".")));
	}

	//Verifica que la consulta tenga la sintaxys correcta
	this.verificarSintaxisQuery = function(query){
		query = query + ".";
		return (verificarSintaxisLinea(query));
	}

	//Verifica que la BDD tenga la sintaxis correcta (Todas las lineas deben ser correctas)
	this.verificarSintaxisBDD = function(listaBDD){
		var i = 0;
		//var correcta = true;
		var lineaError = -1;
		//while((i < listaBDD.length) && (correcta === true)){
		while((i < listaBDD.length) && (lineaError == -1)){
			if(!verificarSintaxisLinea(listaBDD[i])){
				//correcta = false;
				lineaError = i;
			}
			i++;
		}
		//return correcta;
		return lineaError;
	}

	//Genera la lista solo con las reglas
	function generarListaReglas(linea){
		if(linea.includes(":-")){
			//return (linea);
			return (crearRegla(linea));
		} else {
			return "";
		}
	}

	//Verifica si el fact esta en la BDD
	function evaluarFact(consulta, listaBDD){
		var consultaConPunto = (consulta+".");
		return (listaBDD.includes(consultaConPunto));
	}

	//Evalua todos los facts que incluye la regla
	function evaluarVariosFacts(factsAsociados, listaBDD){
		factsAsociados = factsAsociados.replace("),", ");");
		var listaFacts = factsAsociados.split("; ");
		var evaluacionFinal = true;
		var consultaSinPunto;
		for (var i = 0; i < listaFacts.length ; i++){
			if(i < (listaFacts.length - 1)){	
				consultaSinPunto = listaFacts[i];
			} else {
				consultaSinPunto = listaFacts[i].replace(".", "");
			}		
			if(evaluarFact(consultaSinPunto, listaBDD) === false){
				evaluacionFinal = false;
			}
		}
		return evaluacionFinal;
	}

	//Crea un Objeto regla a partir de la línea de la BDD que corresponda a una regla
	function crearRegla(linea){
		var nombreRegla = linea.substring(0, linea.indexOf("("));
		var variablesRegla = linea.substring(linea.indexOf("(")+1, linea.indexOf(")")).split(", ");
		var factsRegla = linea.substring(linea.indexOf(":-")+3);
		var regla = {
			nombre: nombreRegla,
			variables: variablesRegla,
			facts: factsRegla
		};
		return regla;
	}

	//Sustituye las variables de la regla por las ingresadas en la consulta para su posterior evaluación
	function sustituirVariables(regla, variablesConsulta){
		var factNuevo = regla.facts;
		for (var i = 0; i < variablesConsulta.length ; i++){
			factNuevo = factNuevo.replace(new RegExp(regla.variables[i], 'g'), variablesConsulta[i]);
		}
		return factNuevo;
	}

	//Determina si la consulta corresponde a una regla (devuel true) o a un fact (devuelve false)
	function identificarConsulta(consulta, listaReglas){
		var nombreConsulta = consulta.substring(0, consulta.indexOf("("));
		var esRegla = false;
		var i = 0;
		while((i < listaReglas.length) && (esRegla === false)){
			if(listaReglas[i].nombre == nombreConsulta){
				esRegla = true;
			}
			i++;
		}
		return esRegla;
	}

	//Devuelve la definición de la regla que estamos buscando
	function buscarRegla(consulta, listaReglas){
		var nombreConsulta = consulta.substring(0, consulta.indexOf("("));
		var encontrada = false;
		var reglaBuscada;
		var i = 0;
		while((i < listaReglas.length) && (encontrada === false)){
			if(listaReglas[i].nombre == nombreConsulta){
				encontrada = true;
				reglaBuscada = listaReglas[i];
			}
			i++;
		}
		return reglaBuscada;
	}

    this.parseDB = function (params, paramss, paramsss) {
    	db = params;
    }

    this.checkQuery = function (consulta) {
		var listaReglas = db.map(generarListaReglas).filter(Boolean);
		if(this.verificarSintaxisQuery(consulta)){
			if(this.verificarSintaxisBDD(db) == -1){
				//La BDD tiene una sintaxis correcta
				if(identificarConsulta(consulta, listaReglas)){
					//La consulta está asociada a una regla
					var variablesConsulta = consulta.substring(consulta.indexOf("(")+1, consulta.indexOf(")")).split(", ");
					var reglaAsociada = buscarRegla(consulta, listaReglas);
					var factsAsociados = sustituirVariables(reglaAsociada, variablesConsulta);
					return (evaluarVariosFacts(factsAsociados, db));
				} else {
					//La consulta está asociada a un fact
					return evaluarFact(consulta, db);
				}
			} else {
				//La BDD tiene errores de sintaxis
				return null;
			}			
		} else {
			//La consulta no está bien formulada
			return null;
		}

    }

}

module.exports = Interpreter;
