package com.fox.it.erm.service.impl;

import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.eclipse.persistence.config.CacheUsage;
import org.eclipse.persistence.config.HintValues;
import org.eclipse.persistence.config.QueryHints;

import com.fox.it.erm.service.PropertiesService;



public class ServiceBase {

	private static final Logger logger = Logger.getLogger(ServiceBase.class.getName());
	
	private static final String RELOAD_CACHE_PROPERTY_NAME= "cache.reload";
	
	@Inject
	private EntityManager em;	

	@Inject
	private DBContextSetter contextSetter;
	
	@Inject
	private FoxipediaUserSetter foxipediaUserSetter;
	
	
	
	@Inject
	@EJB
	private PropertiesService propertiesService;
	
	
	
	private Logger getLogger() {
		return logger;
	}
	
	protected EntityManager getEntityManager() {
		return em;
	}
	
	public void setNoCacheHints(Query query) {
		query.setHint(QueryHints.CACHE_USAGE, CacheUsage.DoNotCheckCache);
		query.setHint(QueryHints.REFRESH, HintValues.TRUE);					
	}	
	
	
	public void setUserInDBContext(String userId,Boolean isBusiness) {
		getLogger().info("Setting user id in db context: " + userId + " isBusiness: " + isBusiness);
		contextSetter.set(userId, isBusiness);
	}
	
	
	protected void setUserInDBContext(String userId, Boolean isBusiness, Boolean isFoxipediaSearch) {
		getLogger().info("Setting user id in db context: " + userId + " isBusiness: " + isBusiness + " isFoxipediaSearch: " + isFoxipediaSearch);
		contextSetter.set(userId, isBusiness, isFoxipediaSearch);		
	}
	
	
	protected void clearContext() {
		contextSetter.clear();
		foxipediaUserSetter.clear();		
	}
	
	protected void setUserInDBAndFoxipediaContext(String userId, Boolean isBusiness, Boolean isFoxipediaSearch) {
		setUserInDBContext(userId, isBusiness, isFoxipediaSearch);
		if (userId!=null&&Boolean.TRUE.equals(isFoxipediaSearch)) {
			foxipediaUserSetter.set(userId);
		} else {
			foxipediaUserSetter.clear();
		}
	}
	
	protected String getLastModifiedTableSQL(String tableName) {
		String sql = "select max(greatest(crt_dt,nvl(upd_dt,to_date('01-01-1900','dd-mm-yyyy')))) from " + tableName;
		return sql;
	}

	protected Date getLastModified(String tableName) {
		String sql= getLastModifiedTableSQL(tableName);
		Query q = getEntityManager().createNativeQuery(sql);
		Date date = (Date)q.getSingleResult();
		return date;		
	}
	
	protected boolean shouldReload(List<?> list) {
		if (list==null||list.isEmpty()) return true;
		return false;
	}
	
	protected boolean shouldRefreshCache() {
		String value = propertiesService.getValue(RELOAD_CACHE_PROPERTY_NAME);
		if (value==null||value.trim().isEmpty()) return true;
		return value.equalsIgnoreCase("true");
	}
	
	protected boolean shouldRefreshCache(List<?> list) {
		if (shouldReload(list)) return true;
		return shouldRefreshCache();
	}
	
	

}
