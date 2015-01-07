package com.fox.it.erm.service.grants;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.grants.SalesAndMarketingCategory;

public class SalesAndMarketingCategorySearchCriteria extends
		SearchCriteria<SalesAndMarketingCategory> {

	public SalesAndMarketingCategorySearchCriteria(EntityManager em) {
		super(em, SalesAndMarketingCategory.class);
	}
	
	public SalesAndMarketingCategorySearchCriteria setCategoryId(Long categoryId) {
		equal("categoryId",categoryId);
		return this;
	}

}
