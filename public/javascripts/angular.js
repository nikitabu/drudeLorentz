(function(){
    // initialize angularjs module
    var app = angular.module('drudeLorentzApp', []);

    // define primary app controller
    app.controller('materialController', function($scope, $http){

	// initialize materials object to null
	$scope.materials = null;

	// initialize min/max plot parameters
	$scope.wmin = 0.3;
	$scope.wmax = 1.55;

	// fill the materials object with an async GET request for a JSON object (from the database)
	$http.get('/material')
	     .success( function(data) {
		 $scope.materials = data;
		 $scope.currentMaterial = data[0];

		 $scope.name = "\mathrm{Material: }" + $scope.currentMaterial.name;
		 $scope.eps = "\epsilon_\infty = " + $scope.currentMaterial.eps;
		 $scope.meff = "m^{*} = " + $scope.currentMaterial.meff;
		 $scope.f0 = "f_0 = " + $scope.currentMaterial.f0;
		 $scope.g0 = "\gamma_0 = " + $scope.currentMaterial.g0;
		 $scope.f1 = "f_1 = " + $scope.currentMaterial.f1;
		 $scope.g1 = "\gamma_1 = " + $scope.currentMaterial.g1e;
		 $scope.w1 = "\omega_1 = " + $scope.currentMaterial.w1;
		 $scope.f2 = "f_2 = " + $scope.currentMaterial.f2;
		 $scope.g2 = "\gamma_2 = " + $scope.currentMaterial.g2;
		 $scope.w2 = "\omega_2 = " + $scope.currentMaterial.w2;
		 $scope.f3 = "f_3 = " + $scope.currentMaterial.f3;
		 $scope.g3 = "\gamma_3 = " + $scope.currentMaterial.g3;
		 $scope.w3 = "\omega_3 = " + $scope.currentMaterial.w3;
		 $scope.f4 = "f_4 = " + $scope.currentMaterial.f4;
		 $scope.g4 = "\gamma_4 = " + $scope.currentMaterial.g4;
		 $scope.w4 = "\omega_4 = " + $scope.currentMaterial.w4;
		 $scope.f5 = "f_5 = " + $scope.currentMaterial.f5;
		 $scope.g5 = "\gamma_5 = " + $scope.currentMaterial.g5;
		 $scope.w5 = "\omega_5 = " + $scope.currentMaterial.w5;
	     })
	    .error( function(data, status, headers, config){
		console.log('error retreiving materials');
	    })

	// changes the current material
	$scope.editCurrentMaterial = function(item) {
	    $scope.currentMaterial = item;
	    $scope.expression = "testing"+$scope.currentMaterial.name;

	    $scope.name = "\mathrm{Material: }" + $scope.currentMaterial.name;
	    $scope.eps = "\epsilon_\infty = " + $scope.currentMaterial.eps;
	    $scope.meff = "m^{*} = " + $scope.currentMaterial.meff;
	    $scope.f0 = "f_0 = " + $scope.currentMaterial.f0;
	    $scope.g0 = "\gamma_0 = " + $scope.currentMaterial.g0;
	    $scope.f1 = "f_1 = " + $scope.currentMaterial.f1;
	    $scope.g1 = "\gamma_1 = " + $scope.currentMaterial.g1e;
	    $scope.w1 = "\omega_1 = " + $scope.currentMaterial.w1;
	    $scope.f2 = "f_2 = " + $scope.currentMaterial.f2;
	    $scope.g2 = "\gamma_2 = " + $scope.currentMaterial.g2;
	    $scope.w2 = "\omega_2 = " + $scope.currentMaterial.w2;
            $scope.f3 = "f_3 = " + $scope.currentMaterial.f3;
	    $scope.g3 = "\gamma_3 = " + $scope.currentMaterial.g3;
	    $scope.w3 = "\omega_3 = " + $scope.currentMaterial.w3;
	    $scope.f4 = "f_4 = " + $scope.currentMaterial.f4;
	    $scope.g4 = "\gamma_4 = " + $scope.currentMaterial.g4;
	    $scope.w4 = "\omega_4 = " + $scope.currentMaterial.w4;
	    $scope.f5 = "f_5 = " + $scope.currentMaterial.f5;
	    $scope.g5 = "\gamma_5 = " + $scope.currentMaterial.g5;
	    $scope.w5 = "\omega_5 = " + $scope.currentMaterial.w5;

	    console.log("current material name = " + $scope.currentMaterial.name);
	    console.log("current material id = " + $scope.currentMaterial._id);
	}

	// deletes the current material from both the database and the angular model
	$scope.deleteCurrentMaterial = function() {
	    // delete from database
	    $http.delete('/deletematerial/' + $scope.currentMaterial.name).
		success(function(){
		    console.log("deleted material")
		}).
		error(function(){console.log("error deleting material")});
	    // delete from angular (FIX, if there was an error removing from the db, the material will still be removed from angular!)
	    $scope.materials.splice($scope.materials.indexOf($scope.currentMaterial), 1);
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
