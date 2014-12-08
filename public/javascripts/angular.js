(function(){
    var app = angular.module('drudeLorentzApp', []);

    app.controller('materialController', function($scope, $http){
	$scope.materials = null;

	$http.get('/material')
	     .success( function(data) {
		 $scope.materials = data;
	     })
	    .error( function(data, status, headers, config){
		console.log('error retreiving materials');
	    })

	$scope.currentMaterial = null;

	$scope.editCurrentMaterial = function(item) {
	    $scope.currentMaterial = item;
	    console.log("current material = "+$scope.currentMaterial.name);
	}
    });

    app.controller('plotController', function($scope, $http){
	$scope.plot = [
	    { 'wmin' : 2,
	      'wmax' : 16,
	      'parameter' : n // n = refractive index, e = permittivity
	    }
	];

	$http.get('/plotparameters')
	     .success( function(data) {
		 $scope.plot = data;
	     })
	    .error( function(data, status, headers, config){
		console.log('error retreiving plot parameters');
	    })
    });


    app.directive('materialParameters',function(){});

    app.directive('plot',function(){});

})();