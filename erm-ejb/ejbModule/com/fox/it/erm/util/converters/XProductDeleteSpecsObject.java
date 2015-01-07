package com.fox.it.erm.util.converters;

import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.impl.JsonToObjectConverterBase;
import com.fox.it.erm.service.xproduct.delete.XProductDeleteSpec;

public class XProductDeleteSpecsObject extends JsonToObjectConverterBase<XProductDeleteSpec> {

	public XProductDeleteSpecsObject(JsonService jsonService) {
		super(jsonService, XProductDeleteSpec.class);
	}

}
