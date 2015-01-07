package com.fox.it.erm.rest;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.Restriction;
import com.fox.it.erm.service.RestrictionGroupService;
import com.fox.it.erm.service.RestrictionService;
import com.fox.it.erm.service.RightStrandSaveService;

@Path("Restrictions")
public class RestrictionRESTService extends RESTService{

	@EJB
	private RestrictionService restrictionService;
	
	@EJB
	private RightStrandSaveService rightStrandSaveService;
	
	@EJB
	private RestrictionGroupService restrictionGroupService;
	
	private static final Logger logger = Logger.getLogger(RestrictionRESTService.class.getName());

	@GET
    @Produces(MediaType.APPLICATION_JSON)	
	@Path("/type/{typeId: \\d+}")
	public List<Restriction> findByTypeId(@PathParam("typeId") Integer typeId) {
		return restrictionService.findByTypeId(typeId);
	}

	@GET
    @Produces(MediaType.APPLICATION_JSON)		
	public List<Restriction> findAll() {
		return restrictionService.findAll();
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/sortedByCode")
	public List<Restriction> findAllSortedByCode(){
		return restrictionService.findAllSortedByCode();
	}
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/js/sortedByCode")
	public Response getRestrictionsAsJS() {
		CacheControl cacheControl = getCache();
		List<Restriction> restrictions = findAllSortedByCode();
		String variable = "restrictions";
		String js = getJsFromObject(variable, restrictions);
		return Response.ok(js,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();
	}
	
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/group")
	public Object findAllRestrictionGroups(){
		return this.restrictionGroupService.findAllRestrictionGroups();
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/update")
	public List<Long> updateRestriction(@Context HttpServletRequest request){
		String jsonData = request.getParameter("q");
		try{
			String userId = getUserId(request);
			boolean isBusiness = isBusiness(request);
			return rightStrandSaveService.saveStrandRestrictions(jsonData, userId, isBusiness);
		}
		catch(ErmException e){
			logger.log(Level.SEVERE,"Error updating right strands with json: " + jsonData,e);
			throw getErmException(e);
		}
		
	}
}
