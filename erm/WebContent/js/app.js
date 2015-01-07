'use strict';

// include bindonce
//angular.module('app', ['pasvaz.bindonce']);

// Declare app level module which depends on filters, and services
var app = angular.module('erm',[ "ngResource","pasvaz.bindonce"]);


app.config(function($httpProvider){

	//intercept ajax calls
	//we need this to detect when we got redirected to a login page in an ajax call
	$httpProvider.interceptors.push(function($q) {
	  return {	 
		   'request': function(config) { 
		        // do something on success
			    //append the timestamp so requests are never cached.
			    //IE was caching the requests, IE sucks!!
			    //AMV 3/3/2014
			    
			    if (config ) {
			    	if (!config.params) {
			    		config.params={};
			    	}			    				    	
			    	config.params["_"]=Date.now();
			    }
		        return config || $q.when(config);
		   },	    
		  'response': function(response) {	  		
	    	var loginHeader = response.headers(erm.sessionManagement.loginHeader);
			 if(loginHeader && loginHeader !== ""){
				 erm.sessionManagement.redirectToLogin();		        
			 } else {	
				 return response || $q.when(response);
			}
	    }
	  };
	});
	
});


app.config(function($routeProvider){
	$routeProvider.
				  when('/search',{templateUrl:'partials/search.html'}).
				  when('/rights',{templateUrl:'partials/search.html'}).
				  when('/rights/:foxVersionId',{templateUrl:'partials/rightsEdit.html'}).				  				 
				  otherwise({redirectTo:'/search'});
})
.run(function($log,initService) {
  $log.info("run block of app");
});


var login = angular.module('erm-login',[]);
login.config(function($routeProvider){
	$routeProvider.
	  when('/error',{templateUrl:'partials/loginError.html'});
	
});