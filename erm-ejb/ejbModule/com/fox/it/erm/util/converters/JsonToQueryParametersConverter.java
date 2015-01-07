package com.fox.it.erm.util.converters;

import javax.inject.Inject;

import com.fox.it.erm.query.QueryParametersWrapper;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.impl.JsonToObjectConverterBase;

public class JsonToQueryParametersConverter extends JsonToObjectConverterBase<QueryParametersWrapper> {

		@Inject
		public JsonToQueryParametersConverter(JsonService jsonService) {
			super(jsonService,QueryParametersWrapper.class);
		}
}
