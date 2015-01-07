package com.fox.it.erm.service.grants;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.grants.GrantStatus;

public class GrantStatusSearchCriteria extends SearchCriteria<GrantStatus> {

	public GrantStatusSearchCriteria(EntityManager em) {
		super(em, GrantStatus.class);
	}

}
