package com.fox.it.erm.service.impl;

import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.util.DeleteRightsRestrictionStrandCreateObject;

public class JsonToDeleteRightsRestrictionStrandCreateObject extends JsonToObjectConverterBase<DeleteRightsRestrictionStrandCreateObject> {
	public JsonToDeleteRightsRestrictionStrandCreateObject(JsonService jsonService) {
		super(jsonService, DeleteRightsRestrictionStrandCreateObject.class);
	}
}
