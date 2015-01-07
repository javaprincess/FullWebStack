package com.fox.it.erm.copy;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fox.it.erm.ClearanceMemo;
import com.fox.it.erm.ClearanceMemoNode;
import com.fox.it.erm.util.Visitor;

public class ClearanceMemoBuilderForCopy {

	
	public ClearanceMemoBuilderForCopy() {
	}
	
	private Visitor<ClearanceMemoNode> getVisitor(final ClearanceMemo copy) {
		return new Visitor<ClearanceMemoNode>() {

			@Override
			public void visit(ClearanceMemoNode o) {
				if (!o.isDeleted()) {
					//we need to add the node to the copy CM
					//first we need to find the parent in the current CM
					ClearanceMemoNode ancestor = o.getFirstNotDeletedAncestor();
					if (ancestor==null) {
						//there's no ancestor, it should be attached at the clearance memo
						ClearanceMemoNode copyNode = new ClearanceMemoNode();
						copyNode.copyContent(o);
						copyNode.setId(o.getId());
						copy.add(copyNode);
						
					} else {
						Long ancestorId = ancestor.getId();
						//now lets find the node with that id in the copy.
						//if its not found, then we need need to crate one
						ClearanceMemoNode copyAncestor = copy.findById(ancestorId);
						if (copyAncestor==null) {
							copyAncestor = new ClearanceMemoNode();
							copyAncestor.copyContent(ancestor);
							copyAncestor.setId(ancestorId);
							copy.add(copyAncestor);
						}
						ClearanceMemoNode copyNode = new ClearanceMemoNode();
						copyNode.copyContent(o);
						copyAncestor.addChild(copyNode);
					}	
				}
			}
			
		};
	}
	
	private void markAsDeleted(ClearanceMemo clearanceMemo,final List<Long> commentIds) {
		for (ClearanceMemoNode node: clearanceMemo.getNodes()) {
			node.walkWithRoot(new Visitor<ClearanceMemoNode>() {

				@Override
				public void visit(ClearanceMemoNode o) {
					if (!commentIds.contains(o.getId())) {
						o.setDeleted(true);
					}
				}
				
			});
		}
	}
	
	public ClearanceMemo getClearanceMemoForCommentIds(ClearanceMemo clearanceMemo,List<Long> commentIds) {

		//first the the clearance memo nodes
		markAsDeleted(clearanceMemo, commentIds);
		//now that we have the clearance memo, clone it but only with the comment ids that we have in the list
		Set<Long> commentIdsSet = new HashSet<>();
		commentIdsSet.addAll(commentIds);
		
		ClearanceMemo copy = new ClearanceMemo();
		Visitor<ClearanceMemoNode> visitor = getVisitor(copy);
		for (ClearanceMemoNode node:clearanceMemo.getNodes()) {
			node.walkWithRoot(visitor);
		}
		return copy;
	}
	

}
