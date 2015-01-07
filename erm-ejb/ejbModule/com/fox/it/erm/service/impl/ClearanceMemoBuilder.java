package com.fox.it.erm.service.impl;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import com.fox.it.erm.ClearanceMemo;
import com.fox.it.erm.ClearanceMemoNode;
import com.fox.it.erm.ClearanceMemoToc;
import com.fox.it.erm.EntityAttachment;
import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.service.comments.CommentsService;
import com.google.common.base.Function;
import com.google.common.collect.Maps;


public class ClearanceMemoBuilder {

	private final List<ClearanceMemoToc> toc;
	private final Map<Long,ClearanceMemoNode> nodesMap = new LinkedHashMap<>();
	private final Map<Long,Comment> commentsMap;
	private final boolean includeText;
	private final HashMap<Long, List<Long>> mappedRightStrandsMap;
	private final Map<Long,List<EntityAttachment>> attachmentsMap;
	private final HashMap<Long, List<Long>> mappedRightStrandRestrictionsMap;
	private final HashMap<Long, List<Long>> mappedProductInfoCodesMap;
	private HashMap<Long, Boolean> reviewedByLegalMap;
	private HashMap<Long, Boolean> reviewedByBusinessMap;
	
	private Logger logger = Logger.getLogger(ClearanceMemoBuilder.class.getName());
	
	public ClearanceMemoBuilder(List<ClearanceMemoToc> toc,List<Comment> comments,Map<Long,List<EntityAttachment>> attachments,boolean includeText, HashMap<Long, List<Long>> mappedRightStrandsMap, 
			HashMap<Long, List<Long>> mappedRightStrandRestrictionsMap, HashMap<Long, List<Long>> mappedProductInfoCodesMap, HashMap<Long, Boolean> reviewedByLegalMap, HashMap<Long, Boolean> reviewedByBusinessMap) {			
		this.toc = toc;
		this.includeText = includeText;
		commentsMap = toCommentMap(comments);
		this.attachmentsMap = attachments;
		this.mappedRightStrandsMap = mappedRightStrandsMap;
		this.mappedRightStrandRestrictionsMap = mappedRightStrandRestrictionsMap;
		this.mappedProductInfoCodesMap = mappedProductInfoCodesMap;
		this.reviewedByLegalMap = reviewedByLegalMap;
		this.reviewedByBusinessMap = reviewedByBusinessMap;
	}
		
	private Map<Long, Comment> toCommentMap(List<Comment> comments) {
		Map<Long,Comment> map = Maps.uniqueIndex(comments, new Function<Comment,Long>() {
			  public Long apply(Comment comment) {
			  	return comment.getId();
			  }});
		return map;
	}


 

	private ClearanceMemoNode getNode(Long id, CommentsService commentsService) {
		if (nodesMap.containsKey(id)) {
			return nodesMap.get(id);
		}
		
		ClearanceMemoNode node = new ClearanceMemoNode();
		Comment comment = commentsMap.get(id);
		if (comment!=null) {
			node.setTitle(comment.getShortDescription());
			node.setCommentStatus(comment.getCommentStatus());
			node.setShowPublic(comment.getPublicInd() == null || comment.getPublicInd() != 0);
			List<EntityAttachment> attachments = attachmentsMap.get(id);
			node.setAttachments(attachments);
			if (includeText) {
				node.setText(comment.getLongDescription());
			}				
		}
		node.setId(id);
		nodesMap.put(id, node);
		return node;
	}
	
	
	/**
	 * Builds the clearance memos structure.
	 * Assumes the List is sorted by parent id and child sequence
	 * @param toc
	 */
	/**
	 * @param commentsService
	 * @return
	 */
	public ClearanceMemo buildClearanceMemo(CommentsService commentsService) {
		logger.info("Building ClearanceMemo ");		
		ClearanceMemo clearanceMemo = new ClearanceMemo();
	    HashMap<Long, Boolean> commentIdMatch = new HashMap<Long, Boolean>();
		for (ClearanceMemoToc t: toc) {						
			Long parentId = t.getParentCommentId();
			Long childId = t.getChildCommentId();
			ClearanceMemoNode child = getNode(childId, commentsService);
			child.setTocID(t.getId());			
			child.setChildSequence(t.getChildSequece());
			child.setReviewedByLegalIndicator(reviewedByLegalMap);
			child.setReviewedByBusinessIndicator(reviewedByBusinessMap);
			child.setMappedRightStrandsForNode(mappedRightStrandsMap);
			child.setMappedRightStrandRestrictionsForNode(mappedRightStrandRestrictionsMap);
			child.setMappedProductInfoCodesForNode(mappedProductInfoCodesMap);			
			child.setIgnoreTitle(t.isIgnoreTitle());
			if (parentId!=null) {
				ClearanceMemoNode parent = getNode(parentId, commentsService);		
				parent.setReviewedByLegalIndicator(reviewedByLegalMap);
				parent.setReviewedByBusinessIndicator(reviewedByBusinessMap);
				parent.setMappedRightStrandsForNode(mappedRightStrandsMap);
				parent.setMappedRightStrandRestrictionsForNode(mappedRightStrandRestrictionsMap);
				parent.setMappedProductInfoCodesForNode(mappedProductInfoCodesMap);		  
				parent.addChild(child);				
			}
			if (!commentsMap.containsKey(parentId)) {
				clearanceMemo.setRootNodeId(parentId);
				clearanceMemo.add(child);
			}			
		}		
		
		int currentLevel = 1;		
		long currentSequence = 1;
		for (ClearanceMemoNode node : clearanceMemo.getNodes()) {
		  node.setLinkIndicator(commentIdMatch);		  
		  node.setReviewedByLegalIndicator(reviewedByLegalMap);
		  node.setReviewedByBusinessIndicator(reviewedByBusinessMap);		  		  		  
		  node.setMappedRightStrandsForNode(mappedRightStrandsMap);
		  node.setMappedRightStrandRestrictionsForNode(mappedRightStrandRestrictionsMap);
		  node.setMappedProductInfoCodesForNode(mappedProductInfoCodesMap);		  		  
		  setLevel(node, currentLevel);
		  setSequence(node, currentSequence++);
		}
		return clearanceMemo;		
	}
	
	private void setLevel(ClearanceMemoNode node, int level) {
		node.setLevel(level);
		if (node.getChildren().size() > 0) {		  
		  for (ClearanceMemoNode childNode : node.getChildren()) {
		    setLevel(childNode, (level+1));
		  }
		}
	}
	
	private void setSequence(ClearanceMemoNode node, long sequence) {
		node.setChildSequence(sequence++);
		if (node.getChildren().size() > 0) {		  
		  sequence = 1l;
		  for (ClearanceMemoNode childNode : node.getChildren()) {			 
		    setSequence(childNode, sequence++);
		  }
		}
	}
	

}
