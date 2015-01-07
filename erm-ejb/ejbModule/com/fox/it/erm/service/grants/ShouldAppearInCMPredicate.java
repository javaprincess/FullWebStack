package com.fox.it.erm.service.grants;

import com.fox.it.erm.ProductGrantComment;
import com.google.common.base.Predicate;

public class ShouldAppearInCMPredicate implements Predicate<ProductGrantComment>{

	public ShouldAppearInCMPredicate() {
	}
	
	public boolean apply(ProductGrantComment comment) {
		Long grantCodeId = comment.getGrantCodeId();
		Long entityTypeId = comment.getEntityTypeId();
		if (IncludeCommentInCMPredicate.getSubrithsTypes().contains(grantCodeId)) {
			return true;
		}
		return (IncludeCommentInCMPredicate.getGrantTypes().contains(grantCodeId) && IncludeCommentInCMPredicate.isCMEntityType(entityTypeId));
	}

}
