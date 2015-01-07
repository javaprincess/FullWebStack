<% 	
	session.invalidate();	
	String contextPath = request.getContextPath();
	String loginRedirect = contextPath + "/login.jsp";
	response.sendRedirect(loginRedirect);	
%>