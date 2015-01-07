package com.fox.it.erm.rest;

import java.util.logging.Logger;

import javax.ws.rs.POST;
import javax.ws.rs.Path;

import com.fox.it.erm.Cache;

@Path("/admin")
public class AdminRESTService extends RESTService {
	private static final Logger logger = Logger.getLogger(AdminRESTService.class.getName());
	
	public AdminRESTService() {

	}
	
	private Logger getLogger() {
		return logger;
	}

	@POST
	@Path("/cache/refresh")
	public void resfrehsCache() {
		getLogger().info("Setting  cache refresh value to true");
		Cache.invalidate();
	}
	
	@POST
	@Path("/cache/clearrefresh")	
	public void clearRefrehsChache() {
		getLogger().info("Clearing cache refresh value");
		Cache.clearRefresh();
		
	}
	
	@POST
	@Path("/cache/refresh/server")
	public void resfrehsCacheServer() {
		getLogger().info("Setting  cache refresh value to true");
		Cache.invalidateServer();
	}
	
	@POST
	@Path("/cache/clearrefresh/server")	
	public void clearRefrehsChacheServer() {
		getLogger().info("Clearing cache refresh value");
		Cache.clearRefreshServer();
		
	}
	

}
