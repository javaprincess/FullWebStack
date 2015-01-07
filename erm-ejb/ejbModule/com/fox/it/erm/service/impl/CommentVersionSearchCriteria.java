package com.fox.it.erm.service.impl;

import java.util.List;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.comments.CommentVersion;

public class CommentVersionSearchCriteria extends SearchCriteria<CommentVersion> {

	public CommentVersionSearchCriteria(EntityManager em) {
		super(em, CommentVersion.class);
		//sort ascending
		addSort("id",true);
	}
	
	public CommentVersionSearchCriteria setCommentId(Long commentId) {
		equal("currentCommentId",commentId);
		return this;
	}
	
	public CommentVersionSearchCriteria setCommentIds(List<Long> commentIds) {
		in("currentCommentId",commentIds);
		return this;
	}

}
