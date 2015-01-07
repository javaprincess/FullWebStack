package com.fox.it.erm.service.impl;

import java.util.List;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.comments.Comment;

public class CommentSearchCriteria extends SearchCriteria<Comment> {

	public CommentSearchCriteria(EntityManager em) {
		super(em, Comment.class);
	}
	
	public CommentSearchCriteria setId(Long id) {
		equal("id", id);
		return this;
	}
	
	public CommentSearchCriteria setIds(List<Long> ids) {
		in("id", ids);
		return this;
	}
	
	public CommentSearchCriteria setCommentTypeId(Long commentTypeId){
		equal("commentTypeId", commentTypeId);
		return this;
	}
	
	public CommentSearchCriteria setIsBusiness() {
		equal("businessInd",Boolean.TRUE);
		return this;
	}
	
	public CommentSearchCriteria setIsLegal() {
		equal("legalInd",Boolean.TRUE);
		return this;
	}

}
