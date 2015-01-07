package com.fox.it.erm.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.security.Principal;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@SuppressWarnings("serial")
@WebServlet(name="SecurityServlet", urlPatterns={"/p/user"}) 
public class SecurityServlet extends HttpServlet {

	private static final Logger logger = Logger.getLogger(SecurityServlet.class.getName());
	
	
	
	
	private Logger getLogger() {
		return logger;
	}
	
	
	private void setNoCache(HttpServletResponse response) {
		response.setHeader("Cache-control", "no-cache, no-store");
		response.setHeader("Pragma", "no-cache");
		response.setHeader("Expires", "-1");		
	}
	
	
	
	private void printUser(HttpServletResponse response,String userJson) throws IOException{
		setNoCache(response);
		PrintWriter writer = response.getWriter();
		writer.println(userJson);
	}
	
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		getLogger().info("SecurityServlet.doGet");
		Principal principal = request.getUserPrincipal();
		if (principal==null) {
			getLogger().info("No user logged in. No action will be perfomed");
			return;
		}
		getLogger().info("User " + principal.getName() + " logged in");
		String userJson = (String) request.getSession().getAttribute(Attributes.USER_JSON);
		printUser(response, userJson);
	}

	
	
}
