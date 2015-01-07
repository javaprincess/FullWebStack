package com.fox.it.erm.copy;

import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.enums.EntityCommentCategory;

public class XProductCopySubrightsFinder extends XProductCopyGrantFinder {

	private static final Long categoryId = EntityCommentCategory.SUBRIGHTS.getId(); 
	
	@Inject
	public XProductCopySubrightsFinder(EntityManager em) {
		super(em);
	}
	
	public List<EntityComment> find(Long foxVersionId) {
		return super.find(foxVersionId, categoryId);
	}

}
