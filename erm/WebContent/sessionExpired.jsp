Your session has expired
To log back in please click here: 
<a href="">Log in to ERM</a>
<%
    String redirectURL = "/erm/index.jsp?" + System.currentTimeMillis();
    response.sendRedirect(redirectURL);
%>

