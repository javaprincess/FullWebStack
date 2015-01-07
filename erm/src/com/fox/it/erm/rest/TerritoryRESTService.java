package com.fox.it.erm.rest;

import java.util.List;

import javax.ejb.EJB;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fox.it.erm.Territory;
import com.fox.it.erm.service.TerritoryService;
import com.fox.it.erm.util.ErmNodeAlt;

@Path("/Territories")
public class TerritoryRESTService extends RESTService{
	
	@EJB
	private TerritoryService territoryService;
	
	
	
	@GET
    @Produces(MediaType.APPLICATION_JSON)	
	public List<Territory> findAll() {
		return territoryService.findAll();
	}
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/territoryNodes")
	public List<ErmNodeAlt> getTerritoryNodesAlt(){		
//		return territoryService.getTerritoryTreeAlt();
		return territoryService.getTree();
	}
	

	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/js/territoryNodes")
	public Response getTerritoryNodesAsJS() {
		CacheControl cacheControl = getCache();
		List<ErmNodeAlt> nodes = getTerritoryNodesAlt();
		String variable = "territoryNodes";
		String js = getJsFromObject(variable, nodes);
		return Response.ok(js,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();
	}
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/inactive/{territoryId: \\d+}/{isBusiness}")
	public List<Long> getInactiveToActiveTerritories(@PathParam("territoryId") Long id, @PathParam("isBusiness") boolean isBusiness) {
		List<Long> territories = territoryService.getInactiveToActiveTerritoriesMapping(id, isBusiness);
		return territories;
	}
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/js/territories")
	public Response getAllTerritoriesNodesAsJS() {
		CacheControl cacheControl = getCache();
		List<Territory> allTerritories = territoryService.findAllIncludeInactive();
		String variable = "allTerritories";
		String js = getJsFromObject(variable, allTerritories);
		return Response.ok(js,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();
	}

	
}
