package com.fox.it.erm.service.impl;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.SystemSecKey;

public class SystemSecKeySearchCriteria extends
		SearchCriteria<SystemSecKey> {

	public SystemSecKeySearchCriteria(EntityManager em) {
		super(em, SystemSecKey.class);
	}
	
	public SystemSecKeySearchCriteria setKey(String key) {
		equal("key",key);
		return this;
	}
	
	public SystemSecKeySearchCriteria setName(String name) {
		equal("name",name);
		return this;
	}

}
