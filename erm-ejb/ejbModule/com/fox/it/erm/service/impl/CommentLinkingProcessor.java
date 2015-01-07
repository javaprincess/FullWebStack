package com.fox.it.erm.service.impl;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.logging.Logger;

import javax.inject.Inject;

import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.enums.EntityCommentType;
import com.fox.it.erm.enums.EntityType;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.util.CommentCleanner;

public class CommentLinkingProcessor {
	private Logger logger = Logger.getLogger(CommentLinkingProcessor.class.getName());
	
	private final CommentsService commentsService;
	
	@Inject
	public CommentLinkingProcessor(CommentsService commentsService) {
		this.commentsService = commentsService;
	}
	
	private Logger getLogger() {
		return logger;
	}
	
	public void linkCommentToStrands(Comment comment,List<Long> ids,String userId) {
		if (ids==null||ids.isEmpty()) return;
		getLogger().info("Linking commment " + comment.getId() + " to  " + ids.size() + " strands");
		commentsService.linkCommentToEntities(comment, EntityType.STRAND.getId(), EntityCommentType.RIGHT_STRAND_COMMENT.getId(), ids, userId);		
	}
	
	public void linkCommentToStrands(Long commentId,List<Long> ids,String userId) {
		if (ids==null||ids.isEmpty()) return;
		getLogger().info("Linking commment " + commentId + " to  " + ids.size() + " strands");
		commentsService.linkCommentToEntities(commentId, EntityType.STRAND.getId(), EntityCommentType.RIGHT_STRAND_COMMENT.getId(), ids, userId);		
	}
	
	
	public void linkCommentToStrandInfoCodes(Comment comment,List<Long> ids,String userId) {
		if (ids==null||ids.isEmpty()) return;		
		getLogger().info("Linking commment " + comment.getId() + " to " + ids.size() + " info codes ");
		commentsService.linkCommentToEntities(comment, EntityType.STRAND_RESTRICTION.getId(), EntityCommentType.INFO_CODE.getId(), ids, userId);		
	}
	
	public void linkCommentToStrandInfoCodes(Long commentId,List<Long> ids,String userId) {
		if (ids==null||ids.isEmpty()) return;		
		getLogger().info("Linking commment " + commentId + " to " + ids.size() + " info codes ");
		commentsService.linkCommentToEntities(commentId, EntityType.STRAND_RESTRICTION.getId(), EntityCommentType.INFO_CODE.getId(), ids, userId);		
	}
	
	
	public void createLinkedCommentsForStrandInfoCodes(List<Long> ids,String subject,String text,String userId,boolean isBusiness) {
		if (text==null||text.trim().isEmpty()) return;
		Comment comment = CommentCleanner.getComment(subject,text,userId,isBusiness);
		commentsService.saveComment(comment, userId, isBusiness);		
		linkCommentToStrandInfoCodes(comment, ids, userId);		
	}
	
	
	public void createLinkedCommentsForRightRestrictions(Map<Long,List<Long>> commentToRestrictionIds,String userId, boolean isBusiness) {
		for (Entry<Long,List<Long>> entry: commentToRestrictionIds.entrySet()) {
			List<Long> ids = entry.getValue();
			Long commentId = entry.getKey();
			linkCommentToStrandInfoCodes(commentId, ids, userId);
		}
	}
	
	
	
	
	

}
