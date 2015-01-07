package com.fox.it.erm;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;

public class RestrictionGroupSearchCriteria extends SearchCriteria<RestrictionGroup>{

	public RestrictionGroupSearchCriteria(EntityManager em) {
		super(em, RestrictionGroup.class);
	}

	
}
