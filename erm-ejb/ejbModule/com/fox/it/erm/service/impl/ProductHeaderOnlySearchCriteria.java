package com.fox.it.erm.service.impl;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.ProductHeaderOnly;

public class ProductHeaderOnlySearchCriteria extends
		SearchCriteria<ProductHeaderOnly> {

	public ProductHeaderOnlySearchCriteria(EntityManager em) {
		super(em, ProductHeaderOnly.class);
	}
	
	public ProductHeaderOnlySearchCriteria setId(Long id) {
		equal("foxId",id);
		return this;
	}

}
