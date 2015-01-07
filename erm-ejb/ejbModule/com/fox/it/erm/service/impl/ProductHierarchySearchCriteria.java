package com.fox.it.erm.service.impl;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.ProductHierarchy;

public class ProductHierarchySearchCriteria extends SearchCriteria<ProductHierarchy>{

	public ProductHierarchySearchCriteria(EntityManager em) {
		super(em, ProductHierarchy.class);
	}
	
	
	@Override
	protected void setHints(TypedQuery<ProductHierarchy> query) {
	}


	public ProductHierarchySearchCriteria setHierarchyCode(String hierarchyCode) {
		equal("hierarchyCode", hierarchyCode);
		return this;
	}
	
	public ProductHierarchySearchCriteria setParentFoxId(Long foxId) {
		equal("parentFoxId",foxId);
		return this;		
	}
	
	public ProductHierarchySearchCriteria setParentFoxVersionId(Long foxVersionId) {
		equal("parentFoxVersionId", foxVersionId);
		return this;		
	}
	
	public ProductHierarchySearchCriteria setChildFoxVersionId(Long foxVersionId){
		equal("childFoxVersionId", foxVersionId);
		return this;
	}

}
