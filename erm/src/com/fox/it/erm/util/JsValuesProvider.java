package com.fox.it.erm.util;

import javax.inject.Inject;

import com.fox.it.erm.service.JsonService;


public class JsValuesProvider {
	private String cacheObject= "erm.dbvalues";	
	private final JsonService jsonService;
	
	@Inject
	public JsValuesProvider(JsonService jsonService) {
		this.jsonService = jsonService;
	}
	
	private String getJs(String var, String value) {
		return getCacheObject() + "." + var + "=" + value + ";\n";
	}
	
	public String getIncrementLoaderCount() {
		return "erm.dynamicJSLoadedCounter++;";
	}
	
	public String getJsFromObject(String var, Object value,boolean incrementCount) {
		String str =  jsonService.toJson(value);
		String js =  getJs(var,str);
		if (incrementCount) {
			js+=getIncrementLoaderCount();
		}
		return js;
	}
	
	public String getJsFromObject(String var, Object value) {
		return getJsFromObject(var, value, true);
	}
	
	private String getCacheObject() {
		return cacheObject;
	}
	
	

}
