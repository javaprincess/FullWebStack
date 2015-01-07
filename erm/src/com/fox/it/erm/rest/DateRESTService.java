package com.fox.it.erm.rest;

import javax.ejb.EJB;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.fox.it.erm.service.DateService;

@Path("/date")
public class DateRESTService extends RESTService{

	@EJB
	private DateService dateService;
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/code")
	public Object findAllDateCodes(){
		
		return dateService.findAllDateCodes();
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/partialCode")
	public Object findPartialDateCodes(){
		return dateService.findPartialDateCodes();
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/status")
	public Object findAllDateStatuses(){
		
		return dateService.findAllDateStatus();
	}
	
	
	
	
}
