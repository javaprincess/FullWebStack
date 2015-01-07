package com.fox.it.erm.service.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.Predicate;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.ErmProductRestriction;


public class ErmProductRestrictionSearchCriteria extends SearchCriteria<ErmProductRestriction>{

	public ErmProductRestrictionSearchCriteria(EntityManager em) {
		super(em, ErmProductRestriction.class);
	}

	public ErmProductRestrictionSearchCriteria setFoxVersionId(Long foxVersionId) {
		equal("foxVersionId", foxVersionId);
		return this;
	}
	
	public ErmProductRestrictionSearchCriteria setRestrictionId(Long restrictionId) {
		equal("restrictionCdId",restrictionId);
		return this;
	}
	
	public ErmProductRestrictionSearchCriteria setIsBusiness(boolean isBusiness) {
		String fieldName="";
		if (isBusiness) {
			fieldName="businessInd";
		} else {
			fieldName="legalInd";
		}
		equal(fieldName,true);
		return this;
	}
	
	public ErmProductRestrictionSearchCriteria setDoNotLicenseCriteria(List<Long> ids) {
		Predicate predicate = null;
		predicate = getPredicateBulder().in("foxVersionId", ids);
		add(predicate);
		predicate = getPredicateBulder().equal("restrictionCdId", ProductVersionSaveServiceBean.DO_NOT_LICENSE_ID);
		add(predicate);
		return this;			
	}
	public ErmProductRestrictionSearchCriteria setDoNotLicenseCriteria(Long id) {
		Predicate predicate = null;
		predicate = getPredicateBulder().equal("foxVersionId", id);
		add(predicate);
		predicate = getPredicateBulder().equal("restrictionCdId", ProductVersionSaveServiceBean.DO_NOT_LICENSE_ID);
		add(predicate);
		return this;			
	}
	
	
	public ErmProductRestrictionSearchCriteria setIds(List<Long> ids) {
		in("productRestrictionId",ids);
		return this;
	}
	
}
