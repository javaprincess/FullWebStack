package com.fox.it.erm.copy;

import java.util.List;

import javax.inject.Inject;

import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.service.comments.CommentsService;

public class XProductCopyCommentsFinder {
	private final CommentsService commentsService;
	
	@Inject
	public XProductCopyCommentsFinder(CommentsService commentsService) {
		this.commentsService = commentsService;
	}
	
	public List<EntityComment> find(Long foxVersionId, boolean isBusiness) {
		return commentsService.findEntityCommentsToCopy(foxVersionId, isBusiness);
	}

}
