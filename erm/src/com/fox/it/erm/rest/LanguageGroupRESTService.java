package com.fox.it.erm.rest;

import javax.ejb.EJB;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.fox.it.erm.LanguageGroup;
import com.fox.it.erm.service.LanguageGroupService;

@Path("/LanguageGroup")
public class LanguageGroupRESTService {

	@EJB
	private LanguageGroupService languageGroupService;
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Object loadAllLanguageGroupAsArray(){
		Object o = languageGroupService.loadAllLanguageGroupAsArray();
		if(o != null){
			return o;
		}
		LanguageGroup[] l = new LanguageGroup[0];
		return l;
	}
}
