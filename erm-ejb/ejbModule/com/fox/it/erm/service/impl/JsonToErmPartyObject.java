package com.fox.it.erm.service.impl;

import com.fox.it.erm.ErmParty;
import com.fox.it.erm.service.JsonService;

public class JsonToErmPartyObject extends JsonToObjectConverterBase<ErmParty> {
	public JsonToErmPartyObject(JsonService jsonService) {
		super(jsonService, ErmParty.class);
	}
}