package com.fox.it.erm.service.query;

import com.fox.it.erm.query.QuerySearchObject;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.impl.JsonToObjectConverterBase;

public class JsonToQuerySearchObjectConverter extends JsonToObjectConverterBase<QuerySearchObject>{

	public JsonToQuerySearchObjectConverter(JsonService jsonService) {
		super(jsonService, QuerySearchObject.class);
	}
}
