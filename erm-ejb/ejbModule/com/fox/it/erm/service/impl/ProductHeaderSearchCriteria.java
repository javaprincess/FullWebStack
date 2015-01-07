package com.fox.it.erm.service.impl;

import java.util.List;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.ProductHeader;

public class ProductHeaderSearchCriteria extends SearchCriteria<ProductHeader> {
	private  String strandsQuery;

	
	public ProductHeaderSearchCriteria(EntityManager em) {
		super(em, ProductHeader.class);
	}

	public ProductHeaderSearchCriteria setId(Long foxId) {
		equal("foxId",foxId);
		return this;
	}
	
	public ProductHeaderSearchCriteria setIds(List<Long> foxIds) {
		in("foxId",foxIds);
		return this;
	}
	
	public ProductHeaderSearchCriteria sortByTitle() {
		addSort("title");
		return this;
	}
	
	public String getStrandsQuery() {
		return strandsQuery;
	}

	public ProductHeaderSearchCriteria setStrandsQuery(String strandsQuery) {
		this.strandsQuery = strandsQuery;
		return this;
	}
	
	
}
