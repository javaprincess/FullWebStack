<%@ page import="com.fox.it.erm.Version" %>
<%
response.setDateHeader("Expires", 0); //prevents caching at the proxy server
response.setHeader("Cache-Control", "max-stale=0"); // HTTP 1.1
%>
<!doctype html>
<html lang="en" style="height : 100%;">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge" >
  <title>ERM</title>
  <!-- do not move from here -->
  <!-- they need to be before other kendo files -->
  <link href="css/kendo.common.min.css" rel="stylesheet" />
  <link href="css/kendo.default.min.css" rel="stylesheet" />     
  
  
  <!-- static files that won't change (libs) -->
  <!--  jQuery upgrade -->
  <script src="lib/jquery/jquery.min.js"></script>
  <!--  script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script -->
  
  <!--  new bootstrap but old bootstrap-tooltip..couldn't find one on the CDN -->
  <script src="lib/bootstrap/bootstrap.min.js"></script>
  <!-- script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script -->
  <script src="lib/bootstrap/bootstrap-tooltip.js"></script> 
       
  <script src="lib/diff/diff_match_patch.js"></script>
  <script src="lib/handlebars/handlebars.js"></script>
  
  <!-- script src="http://cdn.kendostatic.com/2014.2.1008/js/kendo.all.min.js"></script -->
  <script src="lib/kendo/kendo.web.min.js"></script>
  
  <!--  angularjs 1.3.4 upgrade -->
  <script src="lib/angular/angular.js"></script>
  <script src="lib/angular/angular-resource.js"></script>
  <!--  script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.4/angular.min.js"></script -->
  <!--  script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.4/angular-resource.js"></script -->
  <!--  script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.4/angular-route.js"></script -->
  
  <link rel="stylesheet" href="css/bootstrap.min.css"  media="screen" />
  <link rel="stylesheet" href="font-awesome/css/font-awesome.min.css"  media="screen" />
          
  <!-- end static files -->
  
  <!-- styles and icons -->
  <link rel="shortcut icon" href="img/icons/favicon.ico" type="image/x-icon">
  <link rel="icon" href="img/icons/favicon.ico" type="image/x-icon">
  <link rel="stylesheet" href="css/guide.css?<%=Version.V %>"/>  
  <link rel="stylesheet" href="css/app.css?<%=Version.V %>"/>
  <link rel="stylesheet" href="css/app-rights.css?<%=Version.V %>"/>
  <link rel="stylesheet" href="css/edit-contractual-party.css?<%=Version.V %>"/>
  <link rel="stylesheet" href="css/edit-clearance-memo.css?<%=Version.V %>"/>      
  <!-- end styles and icons -->

  <script src="p/user"></script>
  <script src="rest/cookie"></script>

  <script src="lib/console/console.js?<%=Version.V %>"></script>
       
  <script src="js/erminit.js?<%=Version.V %>"></script> 
  <script src="js/kendoSharedFunctions.js?<%=Version.V %>"></script>
  <script src="js/security.js?<%=Version.V %>"></script>  
  <script src="js/confirmationPopup.js?<%=Version.V %>"></script>
  <script src="lib/erm/strings.js?<%=Version.V %>"></script>
  <script src="js/renderTemplate.js?<%=Version.V %>"></script>
  <script src="js/submitWarningErrorWindows.js?<%=Version.V %>" ></script>
  <script src="js/paths.js?<%=Version.V %>"></script>
  <script src="js/strandsActions.js?<%=Version.V %>"></script>  
  <script src="js/strandsGrid.js?<%=Version.V %>"></script>
  <script src="js/strandsGridFunctions.js?<%=Version.V %>"></script>
  <script src="js/productRestrictionsGrid.js?<%=Version.V %>"></script>  
  <script src="js/rightStrandElement.js?<%=Version.V %>"></script>	
  <script src="js/pdfobject.js?<%=Version.V %>"></script>	
  <script src="js/restriction.js?<%=Version.V %>"></script>
  <script src="js/rightStrand.js?<%=Version.V %>"></script>
  <script src="js/clearanceMemo.js?<%=Version.V %>"></script>
  <script src="js/clearanceMemoInitializeKendoElements.js?<%=Version.V %>"></script>	
  <script src="js/selector.js?<%=Version.V %>"></script>  
  <script src="js/infoCodeSelector.js?<%=Version.V %>"></script>
  <script src="js/kendoElementUtil.js?<%=Version.V %>"></script>
  <script src="js/InfoCodePopupWindow.js?<%=Version.V %>"></script>
  <script src="js/rightStrandModification.js?<%=Version.V %>"></script>
  <script src="js/copyRightStrand.js?<%=Version.V %>"></script>
  <script src="js/createRightStrand.js?<%=Version.V %>"></script>	
  <script src="js/reportManagement.js?<%=Version.V %>"></script>	
  <script src="js/reportElements.js?<%=Version.V %>"></script>	  
  <script src="js/sessionManagement.js?<%=Version.V %>"></script>  
  <script src="js/ProductDetail.js?<%=Version.V %>"></script>
  <script src="js/commentsAndAttachments.js?<%=Version.V %>"></script> 
  <script src="js/subrights.js?<%=Version.V %>"></script>
  <script src="js/createRightStrand.js?<%=Version.V %>"></script>
  <script src="js/dynamicJSLoader.js?<%=Version.V %>"></script>        

 <!-- used to be at the bottom of page -->  
  <script src="js/app.js?<%=Version.V %>"></script>
  <script src="js/services.js?<%=Version.V %>"></script>
  <script src="js/controllers.js?<%=Version.V %>"></script>
  <script src="js/filters.js?<%=Version.V %>"></script>
  <script src="js/directives.js?<%=Version.V %>"></script>
  <script src="js/swfobject.js?<%=Version.V %>"></script>
  <script src="js/bindonce.min.js?<%=Version.V %>"></script>  
          
  
  <script>
  var foxVersionIdKendo = null;
  var foxIdKendo = null;
  var ermAppVersion = "<%=Version.VERSION%>";        
  </script>
</head>
<%@include file="body.html" %>
</html>
