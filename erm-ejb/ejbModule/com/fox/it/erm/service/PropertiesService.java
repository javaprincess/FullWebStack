package com.fox.it.erm.service;

import java.util.Map;

import javax.ejb.Local;

@Local
public interface PropertiesService {

	String getValue(String name);
	Map<String,String> getProperties(String prefix);
}
