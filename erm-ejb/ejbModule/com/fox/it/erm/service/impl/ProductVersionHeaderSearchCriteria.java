package com.fox.it.erm.service.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.validation.constraints.NotNull;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.ProductVersionHeader;

public class ProductVersionHeaderSearchCriteria extends
		SearchCriteria<ProductVersionHeader> {

	public ProductVersionHeaderSearchCriteria(EntityManager em) {
		super(em, ProductVersionHeader.class);
	}
	
	
	public ProductVersionHeaderSearchCriteria setFoxProductId(@NotNull Long foxProductId) {
		equal("foxId", foxProductId);
		return this;
	}
	
	public ProductVersionHeaderSearchCriteria setFoxProductIds(@NotNull List<Long> foxProductIds) {
		in("foxId", foxProductIds);
		return this;
	}
	
	public ProductVersionHeaderSearchCriteria excludeFoxVersionIds(List<Long> ids) {
		String field = "foxVersionId";
		for (Long id:ids) {
			notEqual(field, id);
		}
		return this;
	}
	
	
	public void sortByTitle() {
		addSort("title");
	}
	
	public void sortByVersionTitle() {
		addSort("versionTitle");
	}
	
	public ProductVersionHeaderSearchCriteria setFoxVersionId(Long foxVersionId) {
		equal("foxVersionId",foxVersionId);
		return this;
	}
	

}
