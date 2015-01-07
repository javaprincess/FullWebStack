package com.fox.it.erm.util.converters;

import com.fox.it.erm.copy.XProductCopySpecAndSectionsObject;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.impl.JsonToObjectConverterBase;

public class JsonToXProductCopySpecAndSectionsCreateObject extends JsonToObjectConverterBase<XProductCopySpecAndSectionsObject> {
	public JsonToXProductCopySpecAndSectionsCreateObject(JsonService jsonService) {
		super(jsonService, XProductCopySpecAndSectionsObject.class);
	}
}
