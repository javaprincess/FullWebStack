package com.fox.it.erm.service.impl;

import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.util.ErmContractInfoCreateObject;

public class JsonToErmContractInfoObject extends JsonToObjectConverterBase<ErmContractInfoCreateObject> {
	public JsonToErmContractInfoObject(JsonService jsonService) {
		super(jsonService, ErmContractInfoCreateObject.class);
	}
}
