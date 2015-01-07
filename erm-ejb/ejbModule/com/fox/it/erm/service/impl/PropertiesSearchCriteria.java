package com.fox.it.erm.service.impl;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.Properties;

public class PropertiesSearchCriteria extends SearchCriteria<Properties> {

	public PropertiesSearchCriteria(EntityManager em) {
		super(em, Properties.class);
	}
	
	public PropertiesSearchCriteria setName(String name) {
		equal("name",name);
		return this;
	}
	
	public PropertiesSearchCriteria setPrefix(String prefix) {
		like("name", prefix+"%");
		return this;
	}

}
