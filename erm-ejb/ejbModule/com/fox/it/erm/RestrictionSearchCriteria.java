package com.fox.it.erm;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;

public class RestrictionSearchCriteria extends SearchCriteria<Restriction> {

	public RestrictionSearchCriteria(EntityManager em) {
		super(em, Restriction.class);
	}

	public void setTypeId(Integer typeId) {
		equal("restrictionTypeId",typeId);
	}
}
