package com.fox.it.erm.copy.factory.products;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.copy.factory.EmptyProductGrantProviderBase;
import com.fox.it.erm.enums.EntityCommentCategory;


public class EmptySubrightsProvider extends EmptyProductGrantProviderBase { //implements EmptyProductProvider {

	private static final Long entityCommentCategoryId = EntityCommentCategory.SUBRIGHTS.getId();
	
	
	public EmptySubrightsProvider() {

	}

	
	@Inject
	public EmptySubrightsProvider(EntityManager em) {
		super(em,entityCommentCategoryId);
	}



}
