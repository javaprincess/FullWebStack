package com.fox.it.erm.service.impl;

import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.JsonToObjectConverter;

public class JsonToObjectConverterBase<T> implements JsonToObjectConverter<T> {
	private final JsonService jsonService;	
	private final Class<T> clazz;
	

	public JsonToObjectConverterBase(JsonService jsonService ,Class<T> clazz) {
		this.jsonService = jsonService;
		this.clazz = clazz;
	}
	
	
	
	@Override
	public T convert(String json) {
		T o = null;
		if (jsonService != null)
		  o =  jsonService.toObject(json, clazz);
		return o;
	}
	
}
