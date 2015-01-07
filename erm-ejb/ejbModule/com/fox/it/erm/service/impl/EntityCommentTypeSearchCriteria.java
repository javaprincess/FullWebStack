package com.fox.it.erm.service.impl;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.EntityCommentType;

public class EntityCommentTypeSearchCriteria extends
		SearchCriteria<EntityCommentType> {
	
	public EntityCommentTypeSearchCriteria(EntityManager em) {
		super(em,EntityCommentType.class);
	}
	
	public void setCategoryId(Long id) {
		equal("categoryId", id);
	}

}
