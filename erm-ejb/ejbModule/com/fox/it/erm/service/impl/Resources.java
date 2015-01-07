package com.fox.it.erm.service.impl;

import javax.enterprise.inject.Produces;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

public class Resources{

	@PersistenceContext(name="primary")
    @Produces	
	private EntityManager em;
	
	
}
