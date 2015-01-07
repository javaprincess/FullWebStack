package com.fox.it.erm.copy;

import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.enums.EntityCommentCategory;

public class XProductCopySalesAndMarketingFinder extends
		XProductCopyGrantFinder {

	private final Long categoryId = EntityCommentCategory.SALES_AND_MARKETING.getId();
	
	@Inject
	public XProductCopySalesAndMarketingFinder(EntityManager em) {
		super(em);
	}
	
	public List<EntityComment> find(Long foxVersionId) {
		return super.find(foxVersionId, categoryId);
	}

}
