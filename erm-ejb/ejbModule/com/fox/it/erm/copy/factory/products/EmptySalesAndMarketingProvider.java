package com.fox.it.erm.copy.factory.products;


import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.copy.factory.EmptyProductGrantProviderBase;
import com.fox.it.erm.enums.EntityCommentCategory;



public class EmptySalesAndMarketingProvider extends EmptyProductGrantProviderBase   {


	

	
	private static final Long entityCommentCategoryId = EntityCommentCategory.SALES_AND_MARKETING.getId();
	
	
	public EmptySalesAndMarketingProvider() {

	}
	
	public EmptySalesAndMarketingProvider getEmptySalesAndMarketingProvider() {
		return new EmptySalesAndMarketingProvider(em);
	}
	
	
	
	@Inject
	public EmptySalesAndMarketingProvider(EntityManager em) {
		super(em,entityCommentCategoryId);
	}

}
