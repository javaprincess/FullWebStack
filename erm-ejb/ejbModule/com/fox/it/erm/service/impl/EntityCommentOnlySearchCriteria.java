package com.fox.it.erm.service.impl;

import java.util.List;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.comments.EntityCommentOnly;
import com.fox.it.erm.enums.EntityType;

public class EntityCommentOnlySearchCriteria extends
		SearchCriteria<EntityCommentOnly> {

	public EntityCommentOnlySearchCriteria(EntityManager em) {
		super(em, EntityCommentOnly.class);
	}
	
	public EntityCommentOnlySearchCriteria setId(Long id) {
		equal("id",id);
		return this;
	}
	
	public EntityCommentOnlySearchCriteria setEntityTypeId(Long id) {
		equal("entityTypeId", id);
		return this;
	}
	
	public EntityCommentOnlySearchCriteria setEntityId(Long id) {
		equal("entityId",id);
		return this;		
	}
	
	public EntityCommentOnlySearchCriteria setEntityIds(List<Long> ids) {
		in("entityId",ids);
		return this;		
	}
	
	public EntityCommentOnlySearchCriteria excludeCommentType(Long entityCommentTypeId) {
		notEqual("entityCommentTypeId", entityCommentTypeId);
		return this;
	}
	
	

	public EntityCommentOnlySearchCriteria setCommentId(Long commentId) {
		equal("commentId",commentId);
		return this;
	}
	
	
	
	public EntityCommentOnlySearchCriteria setCommentIds(List<Long> commentIds) {
		in("commentId",commentIds);
		return this;
	}
	
	public EntityCommentOnlySearchCriteria setCommentTypeId(Long id) {
		equal("entityCommentTypeId",id);
		return this;		
	}
	
	
	public EntityCommentOnlySearchCriteria setFoxVersionId(Long foxVersionId) {
		setEntityTypeId(EntityType.PRODUCT_VERSION.getId().longValue());
		setEntityId(foxVersionId);
		return this;		
	}
	
	

}
