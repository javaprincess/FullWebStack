package com.fox.it.erm.service.impl;

import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.util.DeleteSavedQueryObject;

public class JsonToDeleteSavedQueryObjectConverter extends JsonToObjectConverterBase<DeleteSavedQueryObject> {

	public JsonToDeleteSavedQueryObjectConverter(JsonService jsonService){
		super(jsonService, DeleteSavedQueryObject.class);
	}
}
