package com.fox.it.erm.service.impl;

import javax.inject.Inject;

import com.fox.it.erm.TerritoryGroup;
import com.fox.it.erm.service.JsonService;

public class JsonToTerritoryGroupConverter {
	private final JsonService jsonService;

	@Inject
	public JsonToTerritoryGroupConverter(JsonService jsonService) {
		this.jsonService = jsonService;
	}

	
	public TerritoryGroup convert(String json) {
		return jsonService.toObject(json, TerritoryGroup.class);
	}
}
