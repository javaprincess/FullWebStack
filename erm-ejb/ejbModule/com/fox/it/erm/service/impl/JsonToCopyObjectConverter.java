package com.fox.it.erm.service.impl;

import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.util.CopyObject;

public class JsonToCopyObjectConverter extends
		JsonToObjectConverterBase<CopyObject> {

	public JsonToCopyObjectConverter(JsonService jsonService) {
		super(jsonService, CopyObject.class);
	}

}
