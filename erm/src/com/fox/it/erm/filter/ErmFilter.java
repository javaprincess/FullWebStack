package com.fox.it.erm.filter;

import java.io.IOException;
import java.security.Principal;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.fox.it.erm.User;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.SecurityService;
import com.fox.it.erm.service.impl.JacksonJsonService;
import com.fox.it.erm.servlet.Attributes;

/**
 * ERM filter makes sure the the session contains the User object
 * Configuration is in web.xml
 */
public class ErmFilter implements Filter {
	@EJB
	private SecurityService securityService;

	private static final Logger logger = Logger.getLogger(ErmFilter.class.getName());
	
	private JsonService jsonService = new JacksonJsonService();

	
    /**
     * Default constructor. 
     */
    public ErmFilter() {
    }

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
	}
	
	private Logger getLogger() {
		return logger;
	}
	
	private String toJson(User user)  {
		return jsonService.toJson(user);
	}
	
	
	private boolean hasAccessToApp(User user) {
		return user!=null&&user.hasERMRole();
	}
	
	private void doGetUserAndStoreInSession(HttpServletRequest request) {
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute(Attributes.USER);
		try {
		if (user==null) {
			getLogger().info("ErmFilter.doFilter. Fetching user info and putting it on session");			
			Principal principal = request.getUserPrincipal();
			if (principal==null) {
				getLogger().log(Level.SEVERE,"Principal is null. Invalidating session");
				session.invalidate();				
				return;
			}
			String username  = principal.getName();
			user = securityService.get(username);			
			if (user==null) {
				user = new User();
				user.setUserId(username);
			}
			if (!hasAccessToApp(user)) {
				getLogger().log(Level.SEVERE,"User " + username + " does not have ERM role. Invalidating session");
				//user does not have the erm role
				session.invalidate();
				return;
			}
			String userJson = "erm_user="+toJson(user);
			session.setAttribute(Attributes.USER, user);
			session.setAttribute(Attributes.USER_JSON, userJson);
		}
		} catch(Exception e) {
		  getLogger().log(Level.SEVERE,"Exception doGetUserAndStoreInSession ", e);		  
		}
	}
	

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		doGetUserAndStoreInSession((HttpServletRequest)request);
		chain.doFilter(request, response);
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
	}

}
