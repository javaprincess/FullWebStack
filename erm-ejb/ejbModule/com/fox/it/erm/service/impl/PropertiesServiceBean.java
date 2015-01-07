package com.fox.it.erm.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.Properties;
import com.fox.it.erm.service.PropertiesService;

@Stateless
public class PropertiesServiceBean implements PropertiesService {

	@Inject
	private EntityManager em;
	
	public PropertiesServiceBean() {
	}
	
	private PropertiesSearchCriteria getCriteria() {
		return new PropertiesSearchCriteria(em);
	}

	@Override
	public String getValue(String name) {
		Properties property =  getCriteria().setName(name).getSingleResult();
		if (property==null) return null;
		return property.getValue();
	}

	@Override
	public Map<String, String> getProperties(String prefix) {
		List<Properties> properties = getCriteria().setPrefix(prefix).getResultList();
		Map<String,String> map = new HashMap<String, String>();
		for (Properties p: properties) {
			map.put(p.getName(), p.getValue());	
		}
		return map;
	}

}
