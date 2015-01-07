package com.fox.it.erm.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/heartbeat")
public class HeartbeatService {

	/**
	 * We use this service for check to see if the session is still alive particularly for
	 * the Javascript popup windows on the client
	 * @return
	 */
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Path("/check")
	public List<Boolean> heartbeatCheck(){
		List<Boolean> b = new ArrayList<Boolean>();
		b.add(Boolean.TRUE);
		return b;
	}
}
