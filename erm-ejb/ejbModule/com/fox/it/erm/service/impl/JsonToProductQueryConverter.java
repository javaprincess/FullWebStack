package com.fox.it.erm.service.impl;

import javax.inject.Inject;

import com.fox.it.erm.ProductQuery;
import com.fox.it.erm.service.JsonService;

public class JsonToProductQueryConverter extends JsonToObjectConverterBase<ProductQuery>{
	@Inject
	public JsonToProductQueryConverter(JsonService jsonService) {
		super(jsonService,ProductQuery.class);
	}
}
