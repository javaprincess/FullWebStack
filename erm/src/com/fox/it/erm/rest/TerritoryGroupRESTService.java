package com.fox.it.erm.rest;

import java.util.List;

import javax.ejb.EJB;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.fox.it.erm.TerritoryGroup;
import com.fox.it.erm.service.TerritoryGroupService;

@Path("TerritoryGroups")
public class TerritoryGroupRESTService extends RESTService {

	@EJB
	private TerritoryGroupService territoryGroupService;
	
	@GET
    @Produces(MediaType.APPLICATION_JSON)	
	@Path("/{userId: .+}")
	public List<TerritoryGroup> getTerritoryGroups(@PathParam("userId") String userId) {
		userId = userId.toUpperCase();
		return territoryGroupService.findByOwner(userId);
	}
	
	@POST
	public TerritoryGroup saveTerritoryGroup(@QueryParam("t") String territoryGroupJson) {
		TerritoryGroup territoryGroup = null;
		territoryGroup = territoryGroupService.save(territoryGroup);
		return territoryGroup;
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Object getTerritoryGroups(){
		return territoryGroupService.loadAllTerritoryGroups();
	}
}
