var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('WeatherController', function WeatherController($scope) {
  
  $scope.init = function () {
  	$scope.data = rawData;
  	$scope.cities = [];
  	$scope.data.cidades.forEach(function (item) {
  		$scope.cities.push(item.nome);
  	});
  }

  $scope.update = function () {
  	$scope.data.cidades.forEach(function (obj) {
  		if(obj.nome === $scope.current) {
  			prepareSelected(obj);
  		}
  	});
  }

  function prepareSelected(read) {
  	var selection = {
  		max: false,
  		min: false,
  		nome: read.nome,
  		weekendAverage: 0,
  		previsaoDaSemana: read.previsaoDaSemana
  	};

  	read.previsaoDaSemana.forEach(function (prev) {
  		if(!selection.max || prev.temp > selection.max) selection.max = prev.temp;
  		if(!selection.min || prev.temp < selection.min) selection.min = prev.temp;
  		var formatted = prev.dia.split('/');
  		var date = new Date(parseInt(formatted[2]), parseInt(formatted[1] - 1), parseInt(formatted[0]));
  		if(date.getDay() === 0 || date.getDay() === 6) {
  			if(selection.weekendAverage === 0) selection.weekendAverage = prev.temp;
  			else selection.weekendAverage = (selection.weekendAverage + prev.temp) / 2;
  		}
  	});

  	$scope.selection = selection;
	drawChart();
  }

  function drawChart() {
  	if(!$("#weatherChart")[0]) return;
  	var data = $scope.selection.previsaoDaSemana;
  	var ctx = $("#weatherChart")[0].getContext("2d");
  	var cat = [], val = [];
  	data.forEach(function (item) {
  		cat.push(item.dia);
  		val.push(item.temp);
  	});
    var config = {
    	data: {
	        labels: cat,
	        datasets: [
	            {
	                label: "Temperaturas",
	                data: val
	            }
	        ]
	    },
	    type: 'line'
    };
    var myNewChart = new Chart(ctx, config);
  }

});
