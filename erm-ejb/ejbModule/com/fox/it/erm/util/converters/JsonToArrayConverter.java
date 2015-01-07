package com.fox.it.erm.util.converters;

import javax.inject.Inject;

import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.impl.JsonToObjectConverterBase;

public class JsonToArrayConverter extends JsonToObjectConverterBase<String[]> {

	@Inject
	public JsonToArrayConverter(JsonService jsonService) {
		super(jsonService,String[].class);
	}
}
