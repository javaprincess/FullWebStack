package com.fox.it.erm.service.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.Predicate;

import com.fox.it.criteria.PredicateBuilder;
import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.ClearanceMemoToc;

public class ClearanceMemoTocSearchCriteria extends SearchCriteria<ClearanceMemoToc>{

	public ClearanceMemoTocSearchCriteria(EntityManager em) {
		super(em, ClearanceMemoToc.class);
		addSort("parentCommentId");
		addSort("childSequece");
	}
	
	
	public ClearanceMemoTocSearchCriteria setParentId(Long parentId) {
		equal("parentCommentId", parentId);
		return this;
	}
	
	public ClearanceMemoTocSearchCriteria setChildId(Long childId) {
		equal("childCommentId",childId);
		return this;
	}
	
	public ClearanceMemoTocSearchCriteria setChildIds(List<Long> ids) {
		in("childCommentId",ids);
		return this;
	}
	
	public ClearanceMemoTocSearchCriteria setIds(List<Long> commentIds) {
		PredicateBuilder<ClearanceMemoToc> builder = getPredicateBulder();
		Predicate parentPredicate = builder.in("parentCommentId", commentIds);
		Predicate childPredicate = builder.in("childCommentId", commentIds);
		Predicate idsPredicate = builder.or(parentPredicate,childPredicate);
		add(idsPredicate);
		return this;
	}

}
