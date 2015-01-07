package com.fox.it.erm.service.query;

import javax.persistence.criteria.Predicate;

import com.fox.it.erm.query.QuerySearchCriteria;
import com.fox.it.erm.query.QuerySearchObject;
import com.google.common.base.Strings;

public class QuerySearchObjectToQuerySearchCriteriaConverter {

	/**
	 * 
	 * @param qso
	 * @param qsc
	 * @param userId
	 * @param excludeUserId
	 */
	public void convert(QuerySearchObject qso, QuerySearchCriteria qsc, String userId, boolean excludeUserId){
		if(qso != null && qsc != null){
			String queryName = qso.getQueryName();
			if(!Strings.isNullOrEmpty(queryName)){
				qsc.setQueryNamePredicate(queryName);
			}
			else {
				Predicate p = qsc.getPredicateBulder().ne("name", null);
				qsc.add(p);
			}
			
			String personalTag = qso.getPersonalTag();
			if(!Strings.isNullOrEmpty(personalTag)){
				qsc.setPersonalTagPredicate(personalTag);
			}
			
			String comment = qso.getComment();
			if(!Strings.isNullOrEmpty(comment)){
				qsc.setCommentPredicate(comment);
			}
			
			Long sourceReportId = qso.getSourceReportId();
			if(sourceReportId != null && sourceReportId > 0){
				qsc.setSourceReportIdPredicate(sourceReportId);
			}
			
			String publicFlag = qso.getPublicFlag();
			if(!Strings.isNullOrEmpty(publicFlag)){
				qsc.setPublicFlagPredicate(publicFlag);
			}
			
			String createName = qso.getCreateName();
			if(!Strings.isNullOrEmpty(createName)){
				qsc.setCreatedByPredicate(createName);
			}
			
			if(excludeUserId){
				Predicate p = qsc.getPredicateBulder().ne("createName", userId);
				qsc.add(p);
			}
			
			
		}
	}
	
	/**
	 * 
	 * @param qso
	 * @param qsc
	 * @param userId
	 */
	public void convertToUserSavedQueriesCriteria(QuerySearchObject qso, QuerySearchCriteria qsc, String userId){
		if(qso != null && qsc != null){
			String queryName = qso.getQueryName();
			if(!Strings.isNullOrEmpty(queryName)){
				qsc.setQueryNamePredicate(queryName);
			}
			
			String personalTag = qso.getPersonalTag();
			if(!Strings.isNullOrEmpty(personalTag)){
				qsc.setPersonalTagPredicate(personalTag);
			}
			
			String comment = qso.getComment();
			if(!Strings.isNullOrEmpty(comment)){
				qsc.setCommentPredicate(comment);
			}
			
			Long sourceReportId = qso.getSourceReportId();
			if(sourceReportId != null && sourceReportId > 0){
				qsc.setSourceReportIdPredicate(sourceReportId);
			}
			/*
			String publicFlag = qso.getPublicFlag();
			if(!Strings.isNullOrEmpty(publicFlag)){
				qsc.setPublicFlagPredicate(publicFlag);
			}
			*/
			String createName = userId;
			if(!Strings.isNullOrEmpty(createName)){
				qsc.setCreatedByPredicate(createName);
			}
			
		}
	}
}
