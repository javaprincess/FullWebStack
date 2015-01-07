package com.fox.it.erm.service.grants;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.grants.GrantType;

public class GrantTypeSearchCriteria extends SearchCriteria<GrantType> {

	public GrantTypeSearchCriteria(EntityManager em) {
		super(em, GrantType.class);

	}

}
