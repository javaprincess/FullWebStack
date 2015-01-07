package com.fox.it.erm.rest;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

@Path("/cookie")
public class CookieRESTService extends RESTService {

	public CookieRESTService() {
	}
	
	@GET
	public Response setUserCookie(@Context HttpServletRequest request) {
		return super.setUserCookie(request);
	}

}
