package com.fox.it.erm.service.impl;

import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.util.ProductRestrictionCreateObject;

public class JsonToProductRestrictionCreateObjectConverter extends JsonToObjectConverterBase<ProductRestrictionCreateObject> {

	public JsonToProductRestrictionCreateObjectConverter(JsonService jsonService) {
		super(jsonService, ProductRestrictionCreateObject.class);
	}

}
