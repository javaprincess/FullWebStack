package com.fox.it.erm.service.impl;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.LanguageGroup;

public class LanguageGroupSearchCriteria extends SearchCriteria<LanguageGroup>{

	public LanguageGroupSearchCriteria(EntityManager em) {
		super(em, LanguageGroup.class);		
	}

	public void setOwnerId(String ownerId){
		equal("ownerId", ownerId.toUpperCase());
	}
}
