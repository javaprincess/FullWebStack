package com.fox.it.erm.rest;

import java.util.List;

import javax.ejb.EJB;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fox.it.erm.Language;
import com.fox.it.erm.service.ErmProductVersionService;
import com.fox.it.erm.service.LanguageService;
import com.fox.it.erm.util.ErmNodeAlt;

@Path("/Language")
public class LanguageRESTService extends RESTService{
	
	@EJB
	private LanguageService languageService;
	
	@EJB
	private ErmProductVersionService ermProductVersionService;
	
	@GET
	public List<Language> getLanguages() {
		return languageService.get();
	}
	
	//@GET
	//@Produces(MediaType.APPLICATION_JSON)
	//@Path("/languageNodes")
//	public ErmNode<Language> getMediaNodes(){
//		return ermProductVersionService.loadLanguageTree();
//	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/languageNodes")
	public List<ErmNodeAlt> getLanguageNodesAlt(){
//		return languageService.getLanguageTreeAlt();
		return languageService.getTree();
	}
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/js/languageNodes")
	public Response getLanguageNodesAsJS() {
		CacheControl cacheControl = getCache();
		List<ErmNodeAlt> nodes = getLanguageNodesAlt();
		String variable = "languageNodes";
		String js = getJsFromObject(variable, nodes);
		return Response.ok(js,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();
	}
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/js/language")		
	public Response getAllLanguagesAsJs() {
		CacheControl cacheControl = getCache();
		List<Language> languages = languageService.findAll();
		String variable = "allLanguages";
		String js = getJsFromObject(variable, languages);
		return Response.ok(js,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();
		
	}

}
