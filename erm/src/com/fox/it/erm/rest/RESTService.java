package com.fox.it.erm.rest;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.User;
import com.fox.it.erm.cookie.DefaultErmCookieProvider;
import com.fox.it.erm.cookie.ErmCookieProvider;
import com.fox.it.erm.service.UserTypePredicate;
import com.fox.it.erm.service.impl.JacksonJsonService;
import com.fox.it.erm.service.impl.UserTypePredicateImpl;
import com.fox.it.erm.servlet.Attributes;
import com.fox.it.erm.util.JsValuesProvider;
import com.sun.jersey.core.spi.factory.ResponseBuilderImpl;

public class RESTService {
	private Logger logger = Logger.getLogger(RESTService.class.getName());
	
	private UserTypePredicate userTypePredicate=new UserTypePredicateImpl();
	
	@Inject
	private JsValuesProvider jsValuesProvider = new JsValuesProvider(new JacksonJsonService());
	
	
	private Logger getLogger() {
		return logger;
	}
	
	protected WebApplicationException getValidationException(String message) {
		ResponseBuilderImpl builder = new ResponseBuilderImpl();
		builder.status(Status.BAD_REQUEST);
		builder.entity(message);
		Response response = builder.build();
		return new WebApplicationException(response);
	}
	
	protected WebApplicationException getErmException(ErmException e) {
		ResponseBuilderImpl builder = new ResponseBuilderImpl();
		builder.status(Status.INTERNAL_SERVER_ERROR);
		builder.entity(e.getMessage());
		Response response = builder.build();
		return new WebApplicationException(response);
		
	}
	
	protected CacheControl getCache() {
		int seconds = (3600*24*30) * 6; //six months
		CacheControl cacheControl = new CacheControl();
		cacheControl.setMaxAge(seconds);
		return cacheControl;
	}
	
	protected User getUser(HttpServletRequest request){
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute(Attributes.USER);
		return user;
	}
	
	protected String getUserId(HttpServletRequest request) {
		User user = getUser(request);
		if (user==null) return null;
		return user.getUserId().toUpperCase();
	}
	
	protected boolean isBusiness(HttpServletRequest request){
		User user = getUser(request);
		if (user==null)
			throw new RuntimeException("Cannot find user object in session. Please logout and loging again");
		return userTypePredicate.isBusiness(user);
	}
	
	protected String getJsFromObject(String variable, Object o) {
		return jsValuesProvider.getJsFromObject(variable, o);
	}
	
	protected String getJsFromObject(String variable, Object o, boolean incrementCount ) {
		return jsValuesProvider.getJsFromObject(variable, o, incrementCount);
	}
	
	private void throwUnathorized(User user,String message) {
		if (message==null) {
			message = "Unauthorized to peform operation";
		}
		if (user==null) {
			message = "User is null. " + message;
		} else {
			message = "User: " + user.getUserId() + message;
		}
		try {
			throw new UnauthorizedException(message);
		} catch (UnauthorizedException e) {
			getLogger().log(Level.SEVERE,"Unauthorized access. " + message,e);
			throw e;
		}
	}
	
	private void checkSecurityRole(User user, String roles[], String message) {
		if (user.hasAnyRole(roles)) return;
		throwUnathorized(user,message);
	}
	
	protected void checkSecurityRole(HttpServletRequest request,String[] roles,String message) {
		User user = getUser(request);
		checkSecurityRole(user, roles, message);
	}
	
	
	
	
	private boolean hasFunctionPoint(User user, String functionPoint,String privilege,String operation) {
		return user.hasFunctionPoint(functionPoint,privilege, operation);
	}
	
	private boolean hasFunctionPoint(User user, PrivFPointOper functionPoint) {
		return hasFunctionPoint(user, functionPoint.getFunctionPoint(),functionPoint.getPrivilege(),functionPoint.getOperation());
	}
	
	
	private void checkSecurityFunctionPoint(User user, PrivFPointOper[] functionPoints) {
		if (functionPoints==null||functionPoints.length==0) return;
		boolean has = false;
		for (PrivFPointOper functionPoint: functionPoints) {
			has = hasFunctionPoint(user, functionPoint);
			if (has) return;
		}
		throwUnathorized(user," does not have necessary privileges");		
	}

	protected void checkSecurityFunctionPoint(HttpServletRequest request, PrivFPointOper[] functionPoints) {
		User user = getUser(request);		
		if (user==null) throwUnathorized(user,"User is not authenticated");
		checkSecurityFunctionPoint(user, functionPoints);
	}
	
	
	protected Response setUserCookie(HttpServletRequest request) {
		String domain = "foxinc.com";
		String userId = getUserId(request);
		ErmCookieProvider cookieProvider = new DefaultErmCookieProvider();
		Cookie cookie = cookieProvider.get(userId,domain);
		NewCookie nc = new NewCookie(cookie);
		return Response.ok().cookie(nc).build();
		
	}
	
	
	

}
