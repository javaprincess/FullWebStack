package com.fox.it.erm.service.impl;

import java.util.logging.Logger;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.fox.it.erm.FoxipediaUser;

public class FoxipediaUserSetter {
	private static final Logger logger = Logger.getLogger(FoxipediaUserSetter.class.getName());

	private final EntityManager em;
	
	@Inject
	public FoxipediaUserSetter(EntityManager em) {
		this.em = em;
	}

	
	private Logger getLogger() {
		return logger;
	}
	
	private void deleteAll() {
		getLogger().info("Deleting foxipedia context");		
		String sql = "delete from FoxipediaUser";
		Query q = em.createQuery(sql);
		q.executeUpdate();		
		em.flush();
	}
	
	private void create(String userId) {
		FoxipediaUser user = new FoxipediaUser();
		user.setUserId(userId);
		//TODO set martham to test
//		user.setUserId("MARTHAM");
		em.persist(user);
		em.flush();
	}
	
	public void set(String userId) {
		getLogger().info("Setting userId "  + userId + " in foxipedia context");
		deleteAll();
		create(userId);

	}
	
	public void clear() {
		deleteAll();
	}
	
	

}
