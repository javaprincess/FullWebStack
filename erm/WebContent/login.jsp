<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page import="com.fox.it.erm.Version" %>
<%
	//DO NOT REMOVE
	//this is a header attribute to detect if a redirect is the login page
	//in every ajax call the interceptor looks for this header to determine if the redirect is a login page
	response.setHeader("LoginPage","login.jsp");
 %>
<!doctype html>
<%
response.setDateHeader("Expires", 0); //prevents caching at the proxy server
response.setHeader("Cache-Control", "max-stale=0"); // HTTP 1.1
%>
<html lang="en" ng-app="erm-login">
<head >
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge" >
  <meta HTTP-EQUIV="Pragma" CONTENT="no-cache">
  <meta HTTP-EQUIV="Expires" CONTENT="-1">   
  <title>ERM</title>
  <link rel="stylesheet" href="css/bootstrap.min.css?<%=Version.V %>"  media="screen" />
  <link rel="stylesheet" href="css/login.css?<%=Version.V %>" media="screen" />
  <script src="lib/angular/angular.js?<%=Version.V %>"></script>
  <script src="lib/angular/angular-resource.js?<%=Version.V %>"></script>  
  <script src="js/paths.js?<%=Version.V %>"></script>  
  <script src="js/app.js?<%=Version.V %>"></script>   
  <script src="js/filters.js?<%=Version.V %>"></script>
  <script src="js/directives.js?<%=Version.V %>"></script>
</head>
<body id="mainController" style="height : 100%; width : 98%; border : 0px; padding-left: 0.5%; margin-bottom : 0px;">
<c:if test="${not empty param.error }"> 
<c:set var="loginClass">foxLoginInvalid</c:set>
</c:if>
<c:if test="${empty param.error }"> 
<c:set var="loginClass">foxLogin</c:set>
</c:if>
<div class="${loginClass}">
<form method="post" action="j_security_check" class="foxLoginForm form-signin">
<div class="panel topDivHeader" style="width: 100%; height : 50px; margin-bottom : 0px; padding-bottom : 0px;">
	<div class="headDivInner">
		<p class="headerLeftText">20th Century Fox</p>
	</div>	
  <div class="card signin-card clearfix">
  	<div style="text-align: center;">
	  	<img src="/erm/img/ERM_500x500.png" width="80%" height="80%" />
		</div>
  	<div class="loginDescription">
  	Enterprise Rights Management (ERM) is a comprehensive legal and business rights management solution.
  	</div>
	  <div class="form-group">
	    <label class="control-label" for="j_username">Username</label>
	    <input type="text" name="j_username" id="j_username" placeholder="Username" autofocus autocomplete="off">
	  </div>
	  <div class="form-group">
	    <label class="control-label" for="j_password">Password</label>
	    <input type="password" name="j_password" id="j_password" placeholder="Password" autocomplete="off">
	  </div>
	  <div class="form-group">
	    <div class="controls">
	      <button type="submit" class="login-button login-button-submit btn">Sign in</button>
	    </div>
	  </div>
	  <c:if test="${not empty param.error }">
		  <div>
	      	<p class="text-danger"><c:out value="${param.error}"/></p>
	      </div>
	  </c:if>
	  <div class="browserWarning">  
	  	Supported web browsers:  IE9, IE10, Safari and Chrome.<BR/>Please use Chrome for the best browsing experience.
	  </div>
  </div> 
</div>
</form> 
  
</div>

</body>
</html>

