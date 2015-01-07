package com.fox.it.erm.copy;

import java.util.List;

import javax.inject.Inject;

import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.service.ErmProductRestrictionService;

public class XProductCopyInfoCodesFinder {

	private final ErmProductRestrictionService service;
	@Inject
	public XProductCopyInfoCodesFinder(ErmProductRestrictionService service) {
		this.service = service;
	}
	
	public List<ErmProductRestriction> find(Long foxVersionId, boolean isBusiness) {
		return service.findAllProductRestrictions(foxVersionId, isBusiness);
	}

}
