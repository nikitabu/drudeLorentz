(function(){

    // initialize angularjs module
    var app = angular.module('drudeLorentzApp', []);

    // plotting directive
    app.directive("plotGraph", function() {

	var link = function($scope,el) {
	    var vis = d3.select(el[0]).append('svg');

	    var lineData = [
		{
		       'x': $scope.wmin,
		       'y': 5
		}, {
		   'x': 0.4,
		   'y': 20
		}, {
		   'x': 0.5,
		   'y': 10
		}, {
		   'x': 0.6,
		   'y': 40
		}, {
		   'x': 1,
		   'y': 5
		}, {
		   'x': $scope.wmax,
		   'y': 60
	       }];

	       WIDTH = 550,
	       HEIGHT = 400,
	       MARGINS = {
		   top: 20,
		   right: 20,
		   bottom: 20,
		   left: 50
	       },
	       xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function (d) {
		   return d.x;
	       }),
		
		d3.max(lineData, function (d) {
		    return d.x;
		        })
	       ]),

	       yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function (d) {
		   return d.y;
	       }),
		d3.max(lineData, function (d) {
		   return d.y;
		         })
		]),

	       xAxis = d3.svg.axis()
		   .scale(xRange)
		   .tickSize(3)
		   .tickSubdivide(true),

	       yAxis = d3.svg.axis()
		   .scale(yRange)
		   .tickSize(3)
		   .orient("left")
		   .tickSubdivide(true);

	       vis.append("svg:g")
		   .attr("class", "x axis")
		   .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
		   .call(xAxis);

	       vis.append("svg:g")
		   .attr("class", "y axis")
		   .attr("transform", "translate(" + (MARGINS.left) + ",0)")
		   .call(yAxis);

	       var lineFunc = d3.svg.line()
		   .x(function (d) {
		       return xRange(d.x);
		   })
		   .y(function (d) {
		       return yRange(d.y);
		   })
		   .interpolate('linear');

	       vis.append("svg:path")
		   .attr("d", lineFunc(lineData))
		   .attr("stroke", "blue")
		   .attr("stroke-width", 2)
		   .attr("fill", "none");

	       vis.append("div"); 

    	       var watchCallback = function(){
		   console.log("triggered watch callback");
	       }
	
	       $scope.$watch($scope.wmin, watchCallback());
	       $scope.$watch($scope.wmax, watchCallback());
	       $scope.$watch($scope.currentMaterial, watchCallback());

	       }

	return {
	   restrict : "E",
	   link : link	       
	}
    });


    // define primary app controller
    app.controller('materialController', function($scope, $http){

	// initialize materials object to null
	$scope.materials = null;

	// initialize min/max plot parameters
	$scope.wmin = 0.3;
	$scope.wmax = 1.55;

	// initialize new/old material indicator for edit material service
	$scope.newMaterial = false;

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
		 $scope.g1 = "\gamma_1 = " + $scope.currentMaterial.g1;
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
	    // not adding a new material
	    $scope.newMaterial = false;

	    // set current material
	    $scope.currentMaterial = item;
	    
	    // update latex
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
	}

	$scope.createNewMaterial = function() {
	    $scope.newMaterial = true;

	    $scope.currentMaterial.name = "New";
	    $scope.currentMaterial.eps = 0;
	    $scope.currentMaterial.meff = 0;
	    $scope.currentMaterial.f0 = 0;
	    $scope.currentMaterial.g0 = 0;
	    $scope.currentMaterial.f1 = 0;
	    $scope.currentMaterial.g1e = 0;
	    $scope.currentMaterial.w1 = 0;
	    $scope.currentMaterial.f2 = 0;
	    $scope.currentMaterial.g2 = 0;
	    $scope.currentMaterial.w2 = 0;
            $scope.currentMaterial.f3 = 0;
	    $scope.currentMaterial.g3 = 0;
	    $scope.currentMaterial.w3 = 0;
	    $scope.currentMaterial.f4 = 0;
	    $scope.currentMaterial.g4 = 0;
	    $scope.currentMaterial.w4 = 0;
	    $scope.currentMaterial.f5 = 0;
	    $scope.currentMaterial.g5 = 0;
	    $scope.currentMaterial.w5 = 0;

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
            restrict : "A",
            controller : ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
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
