package com.fox.it.erm.service.impl;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.TerritoryGroup;

public class TerritoryGroupSearchCriteria extends SearchCriteria<TerritoryGroup>{
	
	public TerritoryGroupSearchCriteria(EntityManager em) {
		super(em,TerritoryGroup.class);
	}
	
	public void setOwnerId(String userId) {
		equal("ownerId", userId.toUpperCase());
	}
}
