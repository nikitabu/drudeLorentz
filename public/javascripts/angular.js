(function(){

    // INITIALIZE ANGULARJS MODULE
    var app = angular.module('drudeLorentzApp', []);

    // DEFINE THE PRIMARY CONTROLLER
    app.controller('materialController', function($scope, $http, $location, $window){

	// initialize materials object to null
	$scope.materials = null;

	// initialize min/max plot parameters
	$scope.wmin = 100;
	$scope.wmax = 600;

	// initialize new/old material indicator for edit material service
	$scope.newMaterial = false;

	// fill the materials object with an async GET request for a JSON object (from the database)
	$http.get('/material')
	     .success( function(data) {
		 $scope.materials = data;
		 $scope.currentMaterial = data[0];
	     })
	    .error( function(data, status, headers, config){
		console.log('error retreiving materials');
	    })

	// changes the current material
	$scope.editCurrentMaterial = function(item) {
	    // set current material
	    $scope.currentMaterial = item;
	}

	$scope.createNewMaterial = function() {
	    console.log("creating a new material")

	    $scope.currentMaterial.name = "New";
	    $scope.currentMaterial.eps = 0;
	    $scope.currentMaterial.meff = 0;
	    $scope.currentMaterial.wp = 0;
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

	$scope.addNewMaterial = function() {
	    console.log("adding a new material asynchronously through angular");

	    $http.post('/addmaterial', 
		       {
			   name : $scope.currentMaterial.name,
			   eps  : $scope.currentMaterial.eps,
			   meff : $scope.currentMaterial.meff,
			   wp   : $scope.currentMaterial.wp,
			   f0 : $scope.currentMaterial.f0,
			   g0 : $scope.currentMaterial.g0,
			   f1 : $scope.currentMaterial.f1,
			   g1 : $scope.currentMaterial.g1,
			   w1 : $scope.currentMaterial.w1,
			   f2 : $scope.currentMaterial.f2,
			   g2 : $scope.currentMaterial.g2,
			   w2 : $scope.currentMaterial.w2,
			   f3 : $scope.currentMaterial.f3,
			   g3 : $scope.currentMaterial.g3,
			   w3 : $scope.currentMaterial.w3,
			   f4 : $scope.currentMaterial.f4,
			   g4 : $scope.currentMaterial.g4,
			   w4 : $scope.currentMaterial.w4,
			   f5 : $scope.currentMaterial.f5,
			   g5 : $scope.currentMaterial.g5,
			   w5 : $scope.currentMaterial.w5
		       })
		.success(function()
			 {
		    	     console.log("succesfully added material to db");
			 })
		.error(function(){console.log("error adding material to db")})

	    $window.location.href="/";

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

    // LOCALIZE GLOBAL RESIZE EVENTS
    // localizes the global resize event by converting js events to angular scope events
    app.directive('resize', function($window) {
	return {
	    link: function(scope) {
		angular.element($window).on('resize', function(e) {
		    // Namespacing events with name of directive + event to avoid collisions
		    // console.log("window was resized");
		    scope.$broadcast('resize::resize');
		});
	    }
	}
    });

    // DIRECTIVE FOR BINDING LATEX TO ANGULAR
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

    // DIRECTIVE FOR GENERATING PLOTS
    app.directive("plotGraph", function() {

	var link = function($scope,el) 
	{
	    var vis = d3.select(el[0])
		.append('svg')
		.attr("class","main")
		.style('height',400)

	    var wavelengths = d3.range($scope.wmin,$scope.wmax,0.01*($scope.wmax-$scope.wmin));

	    var realPerm = function(lambda){
		// check if the currentMaterial has been defined, if not return 1, otherwise proceed
		if(typeof $scope.currentMaterial === 'undefined'){
		    return 1;
		}
		else{
		    var scope = {
			lam : 0.001*lambda,
			wc :  1.24086,
			wp :  $scope.currentMaterial.wp,
			eps : $scope.currentMaterial.eps,
			f0 :  $scope.currentMaterial.f0,
			g0 :  $scope.currentMaterial.g0,
			f1 :  $scope.currentMaterial.f1,
			g1 :  $scope.currentMaterial.g1,
			w1 :  $scope.currentMaterial.w1,
			f2 :  $scope.currentMaterial.f2,
			g2 :  $scope.currentMaterial.g2,
			w2 :  $scope.currentMaterial.w2,
			f3 :  $scope.currentMaterial.f3,
			g3 :  $scope.currentMaterial.g3,
			w3 :  $scope.currentMaterial.w3,
			f4 :  $scope.currentMaterial.f4,
			g4 :  $scope.currentMaterial.g4,
			w4 :  $scope.currentMaterial.w4,
			f5 :  $scope.currentMaterial.f5,
			g5 :  $scope.currentMaterial.g5,
			w5 :  $scope.currentMaterial.w5
		    };
		    
		    return math.eval('eps + re( -(f0*(wp^2)/( ((wc/lam)^2) - (i*g0*wc/lam)  ))+(f1*(wp^2)/( (w1^2) - ((wc/lam)^2) + (i*g1*wc/lam)  ))+(f2*(wp^2)/( (w2^2) - ((wc/lam)^2) + (i*g2*wc/lam)  ))+(f3*(wp^2)/( (w3^2) - ((wc/lam)^2) + (i*g3*wc/lam)  ))+(f4*(wp^2)/( (w4^2) - ((wc/lam)^2) + (i*g4*wc/lam)  ))+(f5*(wp^2)/( (w5^2) - ((wc/lam)^2) + (i*g5*wc/lam)  )) )',scope);
		    //return math.eval('1',scope);
		}
	    }

	    var imagPerm = function(lambda){
		// check if the currentMaterial has been defined, if not return 1, otherwise proceed
		if(typeof $scope.currentMaterial === 'undefined'){
		    return 1;
		}
		else{
		    var scope = {
			lam : 0.001*lambda,
			wc :  1.24086,
			wp :  $scope.currentMaterial.wp,
			eps : $scope.currentMaterial.eps,
			f0 :  $scope.currentMaterial.f0,
			g0 :  $scope.currentMaterial.g0,
			f1 :  $scope.currentMaterial.f1,
			g1 :  $scope.currentMaterial.g1,
			w1 :  $scope.currentMaterial.w1,
			f2 :  $scope.currentMaterial.f2,
			g2 :  $scope.currentMaterial.g2,
			w2 :  $scope.currentMaterial.w2,
			f3 :  $scope.currentMaterial.f3,
			g3 :  $scope.currentMaterial.g3,
			w3 :  $scope.currentMaterial.w3,
			f4 :  $scope.currentMaterial.f4,
			g4 :  $scope.currentMaterial.g4,
			w4 :  $scope.currentMaterial.w4,
			f5 :  $scope.currentMaterial.f5,
			g5 :  $scope.currentMaterial.g5,
			w5 :  $scope.currentMaterial.w5
		    };

		    return math.eval('im( -(f0*(wp^2)/( ((wc/lam)^2) - (i*g0*wc/lam)  ))+(f1*(wp^2)/( (w1^2) - ((wc/lam)^2) + (i*g1*wc/lam)  ))+(f2*(wp^2)/( (w2^2) - ((wc/lam)^2) + (i*g2*wc/lam)  ))+(f3*(wp^2)/( (w3^2) - ((wc/lam)^2) + (i*g3*wc/lam)  ))+(f4*(wp^2)/( (w4^2) - ((wc/lam)^2) + (i*g4*wc/lam)  ))+(f5*(wp^2)/( (w5^2) - ((wc/lam)^2) + (i*g5*wc/lam)  )) )',scope);
		}
	    }

	    //define plot extents 
	    var WIDTH = el[0].offsetWidth;  // get width from el[0], and setup two-way binding
	    var HEIGHT = Math.round(0.6*WIDTH); // change to 0.7 * WIDTH
	    var MARGINS = {
		top: 20,
		right: 20,
		bottom: 20,
		left: 50
	    };

	    // define range of x, with linear scaling
	    var xRange = d3.scale.
		linear().
		range([MARGINS.left, WIDTH - MARGINS.right]).
		domain([
		    d3.min(wavelengths),
		    d3.max(wavelengths)
		]);

	    var real = wavelengths.map(function(d){return realPerm(d)});
	    var imag = wavelengths.map(function(d){return imagPerm(d)});

	    // define range of y, with linear scaling
	    var yRange = d3.scale.
		linear().
		range([HEIGHT - MARGINS.top, MARGINS.bottom]).
		domain([
		    Math.min(d3.min(real),d3.min(imag)),
		    Math.max(d3.max(real),d3.max(imag)),
		]);

	    // define x axis object
	    var xAxis = d3.svg.axis()
		.scale(xRange)
		.tickSize(3)
		.tickSubdivide(true);

	    // define y axis object
	    var yAxis = d3.svg.axis()
		.scale(yRange)
		.tickSize(3)
		.orient("left")
		.tickSubdivide(true);

	    // append the x-axis to the svg
	    var xAxisObject = vis.append("svg:g")
		.attr("class", "axis xAxis")
		.attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
		.call(xAxis)	    

	    // append the y-axis to the svg
	    var yAxisObject = vis.append("svg:g")
		.attr("class", "axis yAxis")
		.attr("transform", "translate(" + (MARGINS.left) + ",0)")
		.call(yAxis)	    

	    // defined function to move tooltips
	    function mousemove() {                             
		var x0 = xRange.invert(d3.mouse(this)[0]);  //back out the wavelength from the current mouse x position [1] gives y-position
		var i = d3.bisectLeft(wavelengths, x0);     //compute the corresponding index in the wavelengths vector
		var w = wavelengths[i - 1];                 //compute wavelength (maybe not necessary?)

		var eR = yRange(realPerm(w));
		var eI = yRange(imagPerm(w));
		var xW = xRange(w);

		// console.log("(Wavelength, Permittivity) = (" + w + "," + realPerm(w) + ")");

		// if undefined, break out of the function
		if(typeof w ===  'undefined'){
		    console.log("tooltip undefined, w = " + w + ", i = " + i);
		    return false;
		}

		// move real cursor
		focus.select("circle.y1")            
		    .attr("transform",                         
			  "translate(" + xW + "," + eR + ")");        

		// move imag cursor
		focus.select("circle.y2")            
		    .attr("transform",                         
			  "translate(" + xW + "," + eI + ")");        

		focus.select(".xLine")
		    .attr("transform",
			  "translate(" + xW + "," + Math.min(eR,eI) + ")")
		    .attr("y2", HEIGHT - Math.min(eR,eI) - 15 );

		focus.select(".yRealLine")
		    .attr("transform",
			  "translate(" + (WIDTH*(-1) + MARGINS.left - 10) + "," + eR  + ")")
		    .attr("x2", (WIDTH*2) - MARGINS.right - MARGINS.left );

		focus.select(".yImagLine")
		    .attr("transform",
			  "translate(" + (WIDTH*(-1) + MARGINS.left - 10) + "," + eI  + ")")
		    .attr("x2", (WIDTH*2) - MARGINS.right - MARGINS.left );

		focus.select("text.yReal")
		    .attr("transform",                         
			  "translate(" + xW + "," + eR + ")")        
		    .text("(" + w + "," + realPerm(w).toFixed(2) + ")");

		focus.select("text.yImag")
		    .attr("transform",                         
			  "translate(" + xW + "," + eI + ")")        
		    .text("(" + w + "," + imagPerm(w).toFixed(2) + ")");

	    }   

	    // append a focus object to manage the tooltip
	    var focus = vis.append("g")
		.style("display","none");

	    // append a circular tooltip
	    focus.append("circle")
		.attr("class","y1")
		.style("fill","rgba(255,165,0,0.3)")
		.style("stroke","black")
		.attr("r","5");

	    focus.append("circle")
		.attr("class","y2")
		.style("fill","rgba(0,0,255,0.2)")
		.style("stroke","black")
		.attr("r","5");

	    // append the x line
	    focus.append("line")
		.attr("class", "xLine")
		.style("stroke", "black")
		.style("stroke-dasharray", "3,3")
		.style("opacity", 0.5)
		.attr("y1", 0)
		.attr("y2", HEIGHT);

	    // append the yReal line
	    focus.append("line")
		.attr("class", "yRealLine")
		.style("stroke", "black")
		.style("stroke-dasharray", "3,3")
		.style("opacity", 0.5)
		.attr("x1", WIDTH)
		.attr("x2", WIDTH);

	    // append the yImag line
	    focus.append("line")
		.attr("class", "yImagLine")
		.style("stroke", "black")
		.style("stroke-dasharray", "3,3")
		.style("opacity", 0.5)
		.attr("x1", WIDTH)
		.attr("x2", WIDTH);

	    // append the "invisible box" to detect mouse events
	    vis.append("rect")
		.attr("class","invisibleBox")
		.attr("width", WIDTH)
		.attr("height", HEIGHT)
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function() { focus.style("display", null); })
		.on("mouseout", function() { focus.style("display", "none"); })
		.on("mousemove", mousemove);

	    // define the line object
	    var lineReal = d3.svg.line()
		.x(function (d) {
		    return xRange(d);
		})
		.y(function (d,i) {
		    return yRange(real[i]);
		})
		.interpolate('linear');
	    
	    var lineImag = d3.svg.line()
		.x(function (d) {
		    return xRange(d);
		})
		.y(function (d,i) {
		    return yRange(imag[i]);
		})
		.interpolate('linear');

	    // append the line to the svg
	    var lineRealObject = vis.append("svg:path")
		.attr("d", lineReal(wavelengths))
		.attr("stroke", "blue")
		.attr("stroke-width", 2)
		.attr("fill", "none")
		.attr("class","lineReal");

	    var lineImagObject = vis.append("svg:path")
		.attr("d", lineImag(wavelengths))
		.attr("stroke", "orange")
		.attr("stroke-width", 2)
		.attr("fill", "none")
		.attr("class","lineImag");

	    var legend = vis.selectAll(".legend")
		.data(["orange","blue"])
		.enter().append("g")
		.attr("class","legend")
		.attr("transform", "translate(" + WIDTH + ",0)")
		.style("shape-rendering","crispEdges");

	    var xAxisLabel = vis.append("text")
		.attr("class", "xLabel d3text")
		.attr("text-anchor", "end")
		.text("Wavelength [nm]")
		.attr("transform","translate(" + Math.round(0.53*WIDTH + MARGINS.left) + "," + (Math.round(HEIGHT) + MARGINS.top) + ")")
		.style("shape-rendering","crispEdges");

	    var yAxisLabel = vis.append("text")
		.attr("class", "yLabel d3text")
		.attr("text-anchor", "end")
		.text("Permittivity")
		.attr("transform","translate(" + Math.round(0.3*MARGINS.left) + "," + (Math.round(0.45*HEIGHT) - MARGINS.top) + "),rotate(-90)")
		.style("shape-rendering","crispEdges");

	    legend.append("rect")
		.attr("x", -150 )
		.attr("width", 20)
		.attr("height", 20)
		.style("fill", "orange")
		.attr("y",30);

	    legend.append("text")
		.attr("x", -120)
		.attr("y", 40)
		.attr("dy", "0.35em")
		.text("Real Part");

	    legend.append("rect")
		.attr("x", -150 )
		.attr("width", 20)
		.attr("height", 20)
		.style("fill", "blue")
		.attr("y",60);

	    legend.append("text")
		.attr("x", -120)
		.attr("y", 70)
		.attr("dy", "0.35em")
		.text("Imaginary Part");

	    // place the value at the intersection
	    focus.append("text")
		.attr("class", "yReal")
		.style("opacity", 0.8)
		.attr("dx", 8)
		.attr("dy", "-.3em");

	    focus.append("text")
		.attr("class", "yImag")
		.style("opacity", 0.8)
		.attr("dx", 8)
		.attr("dy", "-.3em");

	    // not sure why this is necessary, but latex breaks if it's missing
	    vis.append("div"); 

	    // define the update script for watching
    	    var watchCallback = function()
	    {
		// update the wavelengths variable (if including var, then it defines a new wavelengths in the current function scope)
		wavelengths = d3.range($scope.wmin,$scope.wmax,0.005*($scope.wmax-$scope.wmin));

		//define plot extents
		WIDTH = el[0].offsetWidth;
		HEIGHT = Math.round(0.6*WIDTH);

		d3.select("svg").style('height',HEIGHT + MARGINS.top + MARGINS.bottom);

		// define range of x, with linear scaling
		xRange = d3.scale.
		    linear().
		    range([MARGINS.left, WIDTH - MARGINS.right]).
		    domain([
			d3.min(wavelengths),
			d3.max(wavelengths)
		    ]);

		real = wavelengths.map(function(d){return realPerm(d)});
		imag = wavelengths.map(function(d){return imagPerm(d)});

		// define range of y, with linear scaling
		yRange = d3.scale.
		    linear().
		    range([HEIGHT - MARGINS.top, MARGINS.bottom]).
		    domain([
			Math.min(d3.min(real),d3.min(imag)),
			Math.max(d3.max(real),d3.max(imag)),
		    ]);

		// update x axis object
		xAxis = d3.svg.axis()
		    .scale(xRange)
		    .tickSize(3)
		    .tickSubdivide(true);
	            
		// update y axis object
		yAxis = d3.svg.axis()
		    .scale(yRange)
		    .orient("left")
		    .tickSize(3)
		    .tickSubdivide(true);
	            
		// append the x-axis to the svg
		vis.select(".xAxis")
		    .transition().duration(1500).ease("sin-in-out")
		    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
		    .call(xAxis);

		// append the y-axis to the svg
		vis.selectAll(".yAxis")
		    .transition().duration(1500).ease("sin-in-out")
		    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
		    .call(yAxis);

		vis.selectAll(".legend")
		    .transition().duration(1500).ease("sin-in-out")
		    .attr("transform", "translate(" + WIDTH + ",0)");

		// define the line object
		var lineReal = d3.svg.line()
		    .x(function (d) {
			return xRange(d);
		    })
		    .y(function (d,i) {
			return yRange(real[i]);
		    })
		    .interpolate('linear');

		var lineImag = d3.svg.line()
		    .x(function (d) {
			return xRange(d);
		    })
		    .y(function (d,i) {
			return yRange(imag[i]);
		    })
		    .interpolate('linear');

		// append the line to the svg
		vis.select(".lineReal")
		    .transition().duration(1500).ease("sin-in-out")
		    .attr("d", lineReal(wavelengths) )
		    .attr("stroke", "orange")
		    .attr("stroke-width", 2)
		    .attr("fill", "none");

		// append the line to the svg
		vis.select(".lineImag")
		    .transition().duration(1500).ease("sin-in-out")
		    .attr("d", lineImag(wavelengths) )
		    .attr("stroke", "blue")
		    .attr("stroke-width", 2)
		    .attr("fill", "none");

		xAxisLabel.attr("transform","translate(" + Math.round(0.53*WIDTH + MARGINS.left) + "," + (Math.round(HEIGHT) + MARGINS.top) + ")");

		yAxisLabel.attr("transform","translate(" + Math.round(0.3*MARGINS.left) + "," + (Math.round(0.45*HEIGHT) - MARGINS.top) + "),rotate(-90)");
	
		// update focus size elements
		focus.select(".yRealLine")
		    .attr("x1", WIDTH );
		focus.select(".yImagLine")
		    .attr("x1", WIDTH );
		d3.select("rect.invisibleBox")
		    .attr("width", WIDTH)
		    .attr("height", HEIGHT);

	    } // end of watch callback function
	       
	    // declare watch functions
	    // need to call from inside a function() for some reason, otherwise it doesn't work
	    $scope.$watchGroup(['wmin','wmax','currentMaterial'], function(){watchCallback()})

	    $scope.$on('resize::resize', function() {watchCallback()});

	} // end of link function

	return {
	   restrict : "E",
	   scope : true,
	   link : link	       
	}
    });

    // DIRECTIVE FOR VALIDATING VALUE > MIN WAVELENGTH
    // not totally sure what "element" and "attributes" actually are
    app.directive('valueGreaterMin', function(){
	var link = function($scope, element, attributes, ngModel){
	    ngModel.$validators.valueGreaterMin = function(value){
		var status = value > $scope.wmin;
		return status;
	    }
	};

	return {
	    restrict : "A",
	    require : 'ngModel',
	    link : link
	};
    });

    // DIRECTIVE FOR VALIDATING VALUE < MAX WAVELENGTH
    // not totally sure what "element" and "attributes" actually are
    app.directive('valueLessMax', function(){
	var link = function($scope, element, attributes, ngModel){
	    ngModel.$validators.valueLessMax = function(value){
		var status = value < $scope.wmax;
		return status;
	    }
	};

	return {
	    restrict : "A",
	    require : 'ngModel',
	    link : link
	};
    });

})();
