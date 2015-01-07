package com.fox.it.erm.service.grants;

import java.util.List;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.grants.ProductGrant;

public class ProductGrantSearchCriteria extends SearchCriteria<ProductGrant> {

	public ProductGrantSearchCriteria(EntityManager em) {
		super(em, ProductGrant.class);
	}
	
	public ProductGrantSearchCriteria setFoxVersionId(Long foxVersionId) {
		equal("foxVersionId", foxVersionId);
		return this;
	}
	
	public ProductGrantSearchCriteria setCodeId(Long grantCodeId) {
		equal("grantCodeId", grantCodeId);
		return this;		
	}
	
	public ProductGrantSearchCriteria setGrantStatusId(Long grantStatusId) {
		equal("grantStatusId", grantStatusId);
		return this;		
	}
	
	public ProductGrantSearchCriteria setId(Long id) {
		equal("id",id);
		return this;
	}
	
	public ProductGrantSearchCriteria setIds(List<Long> ids) {
		in("id",ids);
		return this;
	}

}
