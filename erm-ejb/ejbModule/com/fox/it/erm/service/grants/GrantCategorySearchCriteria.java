package com.fox.it.erm.service.grants;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.grants.GrantCategory;

public class GrantCategorySearchCriteria extends SearchCriteria<GrantCategory> {

	public GrantCategorySearchCriteria(EntityManager em) {
		super(em, GrantCategory.class);
	}

}
