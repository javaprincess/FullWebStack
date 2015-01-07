package com.fox.it.erm.service.impl;

import javax.inject.Inject;

import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.util.RightStrandUpdateObject;

public class JsonToRightStrandUpdateObjectConverter extends JsonToObjectConverterBase<RightStrandUpdateObject>{

	@Inject
	public JsonToRightStrandUpdateObjectConverter(JsonService jsonService) {
		super(jsonService, RightStrandUpdateObject.class);
	}

	
}
