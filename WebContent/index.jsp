<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
    
<%@ page import="com.fox.it.erm.reports.*"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Report Form</title>
</head>


 	<% 
 		String token = (String)request.getAttribute("IBToken");
		String userName = (String)request.getAttribute("ERMUserId");
   		String queryId = request.getAttribute("ERMQueryId").toString();
		String fexFileName = request.getAttribute("FEXFileName").toString();
		StringBuilder formAction = new StringBuilder("http://");
   		formAction.append(request.getAttribute("ServerConfig"));
   		formAction.append("/ibi_apps/WFServlet?IBIAPP_app=");
   		formAction.append(request.getAttribute("Env"));
   		formAction.append("/erm&IBIF_ex=");
   		formAction.append(fexFileName);
   		formAction.append("&IBToken=");
   		formAction.append(token);
   		
   		System.out.println("formAction: " + formAction.toString());
   		
   	%>
 	
 	
	<script type="text/javascript">
		window.onload = formSubmit;

		function formSubmit() {

     	 	document.forms[0].submit();
		}
	</script>
	

   		
	 <form action=<%=formAction.toString() %>  method="post">
            <input type="hidden" name="IN_USR_NM" value="<%= userName %>">
            <input type="hidden" name="IN_QRY_ID" value="<%= queryId %>">
            <!-- input TYPE='SUBMIT' VALUE="SUBMIT"  -->
      
     </form>
      
  
</body>
</html>