$(document)
	.ajaxSuccess(function( event, request, settings ) {
		//see if the response has the LoginPage header. If it does, then we know is the login page
		//this is because when the session expires the sever sends a 302 (redirect) and the ajax follows the redirect automatically
		//so we're never able to capture the 302, we always get 200
		var loginHeader = request.getResponseHeader(erm.sessionManagement.loginHeader);
		 if(loginHeader && loginHeader !== ""){
			 erm.sessionManagement.redirectToLogin();		        
		 } 		
	});
//do not cache any ajax requests
//IE was caching some requests
//AMV 3/3/2014
$.ajaxSetup({cache:false});
