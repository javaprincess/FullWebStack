package com.fox.it.erm.service.impl;

import javax.inject.Inject;

import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.util.RightStrandCreateObject;

public class JsonToCreateObjectConverter extends JsonToObjectConverterBase<RightStrandCreateObject>{

	@Inject
	public JsonToCreateObjectConverter(JsonService jsonService) {
		super(jsonService,RightStrandCreateObject.class);
	}

	

}
