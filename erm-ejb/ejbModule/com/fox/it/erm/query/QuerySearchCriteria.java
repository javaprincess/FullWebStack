package com.fox.it.erm.query;

import java.util.List;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;

public class QuerySearchCriteria extends SearchCriteria<SavedQuery>{

	public QuerySearchCriteria(EntityManager em){
		super(em, SavedQuery.class);
	}
	
	public QuerySearchCriteria setQueryNamePredicate(String queryName){
		likeUpper("name", "%"+queryName+"%");
		return this;
	}
	
	public QuerySearchCriteria sortCreateDate(boolean asc) {
		addSort("createDate", asc);
		return this;
	}
	
	public QuerySearchCriteria setNameNotNull() {
		isNotNull("name");
		return this;
	}
	
	public QuerySearchCriteria setPersonalTagPredicate(String personalTag){
		likeUpper("prsnlTag", "%"+personalTag+"%");
		return this;
	}
	
	public QuerySearchCriteria setCommentPredicate(String comment){
		likeUpper("queryComment", "%"+comment+"%");
		return this;
	}
	
	public QuerySearchCriteria setSourceReportIdPredicate(Long reportId){
		equal("sourceReportId", reportId);
		return this;
	}
	
	public QuerySearchCriteria setCreatedByPredicate(String userId){
		equalUpper("createName", userId);
		return this;
	}
	
	public QuerySearchCriteria setExactMatchCreatedByPredicate(String userId){
		equal("createName", userId);	
		return this;
	}
	
	public QuerySearchCriteria setPublicFlagPredicate(String publicFlag){
		equalUpper("publicFlag", publicFlag);		
		return this;
	}
	
	/**
	 * 
	 * @param queryIds
	 * @return
	 */
	public QuerySearchCriteria setQueryIdsPredicate(List<Long> queryIds){
		in("id", queryIds);
		return this;
	}
}
