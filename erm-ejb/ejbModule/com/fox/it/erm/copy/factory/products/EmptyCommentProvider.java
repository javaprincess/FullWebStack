package com.fox.it.erm.copy.factory.products;

import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import com.fox.it.erm.copy.factory.EmptyCommentsProviderBase;

public class EmptyCommentProvider extends EmptyCommentsProviderBase {

		
	public EmptyCommentProvider() {

	}
		
		
	public EmptyCommentProvider(EntityManager em) {
		super(em);
		//TODO change this don't need the comment type because header comments can be of multiple types
	}

	@Override
	public Map<Long, Boolean> getEmpty(List<Long> foxVersionIds,
			boolean isBusiness) {
		List<Long> ids = getFoxVersionIdsForProducts(foxVersionIds, isBusiness);
		return toMap(foxVersionIds,ids);		
	}



}
