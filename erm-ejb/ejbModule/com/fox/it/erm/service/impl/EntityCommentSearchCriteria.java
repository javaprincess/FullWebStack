package com.fox.it.erm.service.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.enums.EntityType;

public class EntityCommentSearchCriteria extends SearchCriteria<EntityComment> {
	
	
	public EntityCommentSearchCriteria(EntityManager em) {
		super(em, EntityComment.class);
	}
	
	public EntityCommentSearchCriteria setId(Long id) {
		equal("id",id);
		return this;		
	}

	public EntityCommentSearchCriteria setEntityTypeIds(List<Long> ids) {
		in("entityTypeId", ids);
		return this;
	}
	
	public EntityCommentSearchCriteria setEntityTypeId(Long id) {
		equal("entityTypeId", id);
		return this;
	}
	
	public EntityCommentSearchCriteria setEntityId(Long id) {
		equal("entityId",id);
		return this;		
	}
	
	
	
	public EntityCommentSearchCriteria setEntityIds(List<Long> ids) {
		in("entityId",ids);
		return this;		
	}
	
	public EntityCommentSearchCriteria setCommentId(Long commentId) {
		equal("commentId",commentId);
		return this;
	}
	
	public EntityCommentSearchCriteria setCommentIds(List<Long> commentIds) {
		in("commentId",commentIds);
		return this;
	}	
	
	public EntityCommentSearchCriteria setCommentTypeId(Long id) {
		equal("entityCommentTypeId",id);
		return this;		
	}
	
	public EntityCommentSearchCriteria setFoxVersionId(Long foxVersionId) {
		setEntityTypeId(EntityType.PRODUCT_VERSION.getId().longValue());
		setEntityId(foxVersionId);
		return this;		
	}
	
	public EntityCommentSearchCriteria setFoxVersionIds(List<Long> foxVersionIds) {
		setEntityTypeId(EntityType.PRODUCT_VERSION.getId().longValue());
		setEntityIds(foxVersionIds);
		return this;				
	}
	
	public EntityCommentSearchCriteria setEntityCommentTypeIds(List<Long> entityCommentTypeIds) {
		in("entityCommentTypeId", entityCommentTypeIds);
		return this;		
	}
	
	public EntityCommentSearchCriteria excludeCommentType(Long entityCommentTypeId) {
		notEqual("entityCommentTypeId", entityCommentTypeId);
		return this;
	}
	
	public EntityCommentSearchCriteria excludeCommentTypeIds(List<Long> entityCommentTypeIds) {
		for (Long entityCommentTypeId: entityCommentTypeIds) {
			excludeCommentType(entityCommentTypeId);
		}
		return this;
	}

	private void setBusinessLegalFlag(String flag, boolean value) {
		Root<EntityComment> root = super.from();		
		@SuppressWarnings("rawtypes")
		Join comment = root.join("comment");
		CriteriaBuilder builder = builder();
		add(builder.equal(comment.get(flag), value));				
	}
	
	public EntityCommentSearchCriteria setIsBusiness() {
		setBusinessLegalFlag("businessInd", true);
		return this;
	}
	
	public EntityCommentSearchCriteria setIsLegal() {
		setBusinessLegalFlag("legalInd", true);
		return this;
	}
	
 
}
