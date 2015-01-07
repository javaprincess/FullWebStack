package com.fox.it.erm.util.converters;

import javax.inject.Inject;

import com.fox.it.erm.query.SavedQuery;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.impl.JsonToObjectConverterBase;

public class JsonToSavedQueryConverter extends JsonToObjectConverterBase<SavedQuery> {

	@Inject
	public JsonToSavedQueryConverter(JsonService jsonService) {
		super(jsonService,SavedQuery.class);
	}
}
