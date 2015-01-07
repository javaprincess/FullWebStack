package com.fox.it.erm.service.grants;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.grants.GrantCode;

public class GrantCodeSearchCriteria extends SearchCriteria<GrantCode> {

	public GrantCodeSearchCriteria(EntityManager em) {
		super(em, GrantCode.class);
	}
	
	public GrantCodeSearchCriteria setActive() {
		equal("activeFlag", "Y");
		return this;
	}

}
