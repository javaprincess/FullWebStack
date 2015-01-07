package com.fox.it.erm.util;

import java.sql.Connection;

import javax.inject.Inject;
import javax.persistence.EntityManager;

public class EntityManagerConnectionProvider {

	private EntityManager em;
	
	@Inject
	public EntityManagerConnectionProvider(EntityManager em) {
		this.em=em;
	}
	
	public Connection get() {
		java.sql.Connection connection = em.unwrap(java.sql.Connection.class);
		return connection;
	}

}
