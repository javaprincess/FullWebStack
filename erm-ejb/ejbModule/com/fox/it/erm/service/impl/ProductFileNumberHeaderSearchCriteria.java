package com.fox.it.erm.service.impl;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.ProductFileNumberHeader;

public class ProductFileNumberHeaderSearchCriteria extends
		SearchCriteria<ProductFileNumberHeader> {

	public ProductFileNumberHeaderSearchCriteria(EntityManager em) {
		super(em, ProductFileNumberHeader.class);
	}
	
	public ProductFileNumberHeaderSearchCriteria setFoxVersionId(Long foxVersionId) {
		equal("foxVersionId",foxVersionId);
		return this;
	}

}
