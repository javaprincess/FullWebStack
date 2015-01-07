package com.fox.it.erm.service.impl;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.ProductVersionAltId;

public class ProductVersionAltIdSearchCriteria extends
		SearchCriteria<ProductVersionAltId> {

	public ProductVersionAltIdSearchCriteria(EntityManager em) {
		super(em, ProductVersionAltId.class);
	}
	
	public ProductVersionAltIdSearchCriteria setFoxVersionId(Long foxVersionId) {
		equal("foxVersionId",foxVersionId);
		return this;
	}
	
	public ProductVersionAltIdSearchCriteria setType(String type) {
		equal("type",type);
		return this;
	}

}
