package com.fox.it.erm.util.converters;

import javax.inject.Inject;

import com.fox.it.erm.grants.ProductGrant;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.impl.JsonToObjectConverterBase;

public class JsonToProductGrantConverter extends JsonToObjectConverterBase<ProductGrant>{
	@Inject
	public JsonToProductGrantConverter(JsonService jsonService) {
		super(jsonService,ProductGrant.class);
	}

}
