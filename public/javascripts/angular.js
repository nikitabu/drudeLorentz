(function(){
    // initialize angularjs module
    var app = angular.module('drudeLorentzApp', []);

    // define primary app controller
    app.controller('materialController', function($scope, $http){
	// initialize materials object to null
	$scope.materials = null;

	// fill the materials object with an async GET request for a JSON object (from the database)
	$http.get('/material')
	     .success( function(data) {
		 $scope.materials = data;
		 $scope.currentMaterial = data[0];

		 $scope.name = "\mathrm{Material: }" + $scope.currentMaterial.name;
		 $scope.eps0 = "\epsilon_0 = " + $scope.currentMaterial.eps0;
		 $scope.meff = "m^{*} = " + $scope.currentMaterial.meff;
		 $scope.f0 = "f_0 = " + $scope.currentMaterial.f0;
		 $scope.g0 = "\gamma_0 = " + $scope.currentMaterial.g0;
		 $scope.f1 = "f_1 = " + $scope.currentMaterial.f1;
		 $scope.g1 = "\gamma_1 = " + $scope.currentMaterial.g1e;
		 $scope.w1 = "\omega_1 = " + $scope.currentMaterial.w1;
		 $scope.f2 = "f_2 = " + $scope.currentMaterial.f2;
		 $scope.g2 = "\gamma_2 = " + $scope.currentMaterial.g2;
		 $scope.w2 = "\omega_2 = " + $scope.currentMaterial.w2;
	     })
	    .error( function(data, status, headers, config){
		console.log('error retreiving materials');
	    })

	// changes the current material
	$scope.editCurrentMaterial = function(item) {
	    $scope.currentMaterial = item;
	    $scope.expression = "testing"+$scope.currentMaterial.name;

	    $scope.name = "\mathrm{Material: }" + $scope.currentMaterial.name;
	    $scope.eps0 = "\epsilon_0 = " + $scope.currentMaterial.eps0;
	    $scope.meff = "m^{*} = " + $scope.currentMaterial.meff;
	    $scope.f0 = "f_0 = " + $scope.currentMaterial.f0;
	    $scope.g0 = "\gamma_0 = " + $scope.currentMaterial.g0;
	    $scope.f1 = "f_1 = " + $scope.currentMaterial.f1;
	    $scope.g1 = "\gamma_1 = " + $scope.currentMaterial.g1e;
	    $scope.w1 = "\omega_1 = " + $scope.currentMaterial.w1;
	    $scope.f2 = "f_2 = " + $scope.currentMaterial.f2;
	    $scope.g2 = "\gamma_2 = " + $scope.currentMaterial.g2;
	    $scope.w2 = "\omega_2 = " + $scope.currentMaterial.w2;

	    console.log("current material name = " + $scope.currentMaterial.name);
	    console.log("current material id = " + $scope.currentMaterial._id);
	}

	$scope.deleteCurrentMaterial = function() {
	    console.log("executing delete material code");
	    $http.delete('/deletematerial/' + $scope.currentMaterial.name).
		success(function(){console.log("deleted material")}).
		error(function(){console.log("error deleting material")});
	}

	// sets current material colors
	$scope.currentClass= function(name){
	    if(name == $scope.currentMaterial.name)
		return "btn-success";
	    else
		return "btn-primary";
	}

	// define the primary drude-lorentz model formula for mathjax
	$scope.drudelorentz = "\epsilon = \epsilon_{\infty} - \frac{\omega_p^2}{\omega^2 - i \gamma} + \frac{f_1 \omega_{1}^2}{\omega_1^2 - \omega^2 - i \gamma_1} + \frac{f_2 \omega_{2}^2}{\omega_2^2 - \omega^2 - i \gamma_2}";

    });

    // define the plot controller (maybe merge with the primary controller?) 
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

    // latex/mathjax directive
    app.directive("mathjaxBind", function() {
	return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
		$scope.$watch($attrs.mathjaxBind, function(value) {
                    var $script = angular.element("<script type='math/tex'>")
			.html(value == undefined ? "" : value);
                    $element.html("");
                    $element.append($script);
                    MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
		});
            }]
	};
    });

})();
