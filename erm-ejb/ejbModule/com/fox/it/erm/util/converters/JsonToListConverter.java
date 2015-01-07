package com.fox.it.erm.util.converters;

import java.util.List;

import javax.inject.Inject;

import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.impl.JsonToObjectConverterBase;

@SuppressWarnings("rawtypes")
public class JsonToListConverter extends JsonToObjectConverterBase<List> {

	@Inject
	public JsonToListConverter(JsonService jsonService) {
		super(jsonService, List.class);
	}
}
