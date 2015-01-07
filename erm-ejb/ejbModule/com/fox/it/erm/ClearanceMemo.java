package com.fox.it.erm;

import java.util.ArrayList;
import java.util.List;

import com.fox.it.erm.comments.EntityComment;

/**
 * Class represent a Clearance Memo in a tree like structure
 * @author AndreasM
 *
 */
public class ClearanceMemo {
	private Long foxVersionId;
	private Long rootNodeId;
	private List<ClearanceMemoNode> nodes;
	private EntityComment entityComment;
	
	
	
	public Long getFoxVersionId() {
		return foxVersionId;
	}

	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}

	public List<ClearanceMemoNode> getNodes() {
		if (nodes==null) {
			nodes = new ArrayList<>();
		}
		return nodes;
	}
	
	
	
	public Long getRootNodeId() {
		return rootNodeId;
	}

	public void setRootNodeId(Long rootNodeId) {
		this.rootNodeId = rootNodeId;
	}

	public void setNodes(List<ClearanceMemoNode> nodes) {
		this.nodes = nodes;
	}

	public void add(ClearanceMemoNode node) {
		getNodes().add(node);
	}
	
	
	public ClearanceMemoNode addHeader(String title) {
		ClearanceMemoNode node = new ClearanceMemoNode(title);
		add(node);
		return node;
	}
	
	public void setChildSequence() {
		long i = 1;
		for (ClearanceMemoNode node:getNodes()) {			
			node.setChildSequence(i++);			
			node.setChildSequence();
		}
	}
	
	public ClearanceMemoNode findNodeByTitle(String title) {
		for (ClearanceMemoNode node: getNodes()) {
			ClearanceMemoNode matching = node.findByTitle(title);
			if (matching!=null) {
				return matching;
			}
		}
		return null;
	}
  	
	
	public void clearIds() {
		this.rootNodeId  = null;
		for (ClearanceMemoNode node: getNodes()) {
			node.clearCommentIds();
		}
	}

	public EntityComment getEntityComment() {
		return entityComment;
	}

	public void setEntityComment(EntityComment entityComment) {
		this.entityComment = entityComment;
	}
	
	
	/**
	 * Validates the ClearanceMemo
	 * If the length exceeds the filed length for title, throws an exception
	 * @throws ErmValidationException
	 */
	public void validate() throws ErmValidationException {
		for (ClearanceMemoNode node: getNodes()) {
			node.validate();
		}
	}
	
	public void copyOriginalId() {
		for (ClearanceMemoNode node: getNodes()) {
			node.walkCopyOriginalId();
		}		
	}
	
	public ClearanceMemoNode findById(Long id) {
		for (ClearanceMemoNode node: getNodes()) {
			ClearanceMemoNode match = node.findById(id);
			if (match!=null) {
				return match;
			}
		}
		return null;
	}
	
	public int getNumberOfNodes() {
		int numberOfNodes = 0;
		for (ClearanceMemoNode node: getNodes()) {
			numberOfNodes+=node.getNumberOfNodes();
		}
		return numberOfNodes;
	}

}
