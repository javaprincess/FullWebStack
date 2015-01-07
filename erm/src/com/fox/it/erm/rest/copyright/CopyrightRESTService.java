package com.fox.it.erm.rest.copyright;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.fox.it.erm.copyright.ERMCopyright;
import com.fox.it.erm.rest.RESTService;
import com.fox.it.erm.service.copyright.CopyrightService;


@Path("/copyright")
public class CopyrightRESTService extends RESTService {
	
	@EJB
	private CopyrightService ermCopyrightService;
	
	
	private static final Logger logger = Logger.getLogger(CopyrightRESTService.class.getName());
	
	/**
	 * Gets copyright information for each foxVersionId
	 * @param foxVersionId
	 * @return
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/{foxVersionId: \\d+}")
	public ERMCopyright retrieve(@PathParam("foxVersionId") Long foxVersionId) {
		
		logger.log(Level.INFO, "finding copyright information for foxVersionId: " + foxVersionId);
		
		
		return this.ermCopyrightService.findCopyrightById(foxVersionId);
		
	}
}
