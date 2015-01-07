package com.fox.it.erm.service.impl;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fox.it.erm.service.JsonService;

public class JacksonJsonService implements JsonService {
	private static final Logger logger = Logger.getLogger(JacksonJsonService.class.getName());
	
	
	private Logger getLogger(){
		return logger;
	}
	
	@Override
	public String toJson(Object o) {
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			String	json = objectMapper.writeValueAsString(o);
			return json;			
		} catch (JsonProcessingException e) {
			getLogger().log(Level.SEVERE,"Error converting obect to Json "+ o,e);
			throw new RuntimeException("Error converting obect to Json "+ o,e);
		}
	}
	
	public <T> T toObject(String s, Class<T> clazz) {
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			return objectMapper.readValue(s, clazz);
		} catch (JsonProcessingException e) {
			getLogger().log(Level.SEVERE,"Error converting json to object Json: "+ s + " class: " + clazz,e);
			throw new RuntimeException("Error converting obect to Json "+ s,e);
		} catch (IOException e) {
			getLogger().log(Level.SEVERE,"Error converting json to object Json: "+ s + " class: " + clazz,e);
			throw new RuntimeException("Error converting obect to Json "+ s,e);

		}

	}

}
