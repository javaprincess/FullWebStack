package com.fox.it.erm.service.xproduct.delete;

import javax.inject.Inject;

import com.fox.it.erm.service.comments.CommentsService;

public class DeleteCommentsProcessor implements XProductSectionDeleteProcessor{

	private final CommentsService commentsService;
	
	@Inject
	public DeleteCommentsProcessor(CommentsService commentsService) {
		this.commentsService = commentsService;
	}

	@Override
	public void delete(Long foxVersionId, String userId, boolean isBusiness) {
		commentsService.deleteHeaderComments(foxVersionId, userId, isBusiness);
			
	}

}
