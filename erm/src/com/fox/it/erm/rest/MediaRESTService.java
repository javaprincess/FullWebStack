package com.fox.it.erm.rest;

import java.util.List;

import javax.ejb.EJB;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


import com.fox.it.erm.Media;
import com.fox.it.erm.service.ErmProductVersionService;
import com.fox.it.erm.service.MediaService;
import com.fox.it.erm.util.ErmNodeAlt;

@Path("/Media")
public class MediaRESTService extends RESTService{
	@EJB
	private  MediaService mediaService;
	
	@EJB
	private ErmProductVersionService ermProductVersionService; 

	@GET
	public List<Media> get() {
		return mediaService.get();
	}

	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/mediaNodes")
	public	List<ErmNodeAlt> getMediaNodesAlt(){
		return mediaService.getTree();
//		return mediaService.loadMediaTreeAlt();
	}
	
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/js/mediaNodes")
	public Response getMediaNodesAsJS() {
		CacheControl cacheControl = getCache();
		List<ErmNodeAlt> nodes = getMediaNodesAlt();
		String variable = "mediaNodes";
		String js = getJsFromObject(variable, nodes);
		return Response.ok(js,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();
	}
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/js/media")	
	public Response getAllMediaAsJs() {
		CacheControl cacheControl = getCache();
		List<Media> media = mediaService.findAllIncludeInactive();
		String variable = "allMedia";
		String js = getJsFromObject(variable, media);
		return Response.ok(js,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();
		
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<Media> findAll() {
		return mediaService.findAll();
	}
			
}
