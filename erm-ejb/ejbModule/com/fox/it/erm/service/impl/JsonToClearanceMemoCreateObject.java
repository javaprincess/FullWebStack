package com.fox.it.erm.service.impl;

import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.util.ClearanceMemoEditorCreateObject;

public class JsonToClearanceMemoCreateObject extends JsonToObjectConverterBase<ClearanceMemoEditorCreateObject> {
	public JsonToClearanceMemoCreateObject(JsonService jsonService) {
		super(jsonService, ClearanceMemoEditorCreateObject.class);
	}
}
