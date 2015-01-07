package com.fox.it.erm.service.impl;

import java.util.List;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.ErmProductRightStrand;

public class RightStrandSearchCriteria extends SearchCriteria<ErmProductRightStrand>{

	private static final String ID_FIELD="rightStrandId";
	
	public RightStrandSearchCriteria(EntityManager em) {
		super(em, ErmProductRightStrand.class);
	}
	
	public RightStrandSearchCriteria setFoxVersionId(Long foxVersionId) {
		equal("foxVersionId", foxVersionId);
		return this;
	}
	
	
	public RightStrandSearchCriteria setId(Long id) {
		equal(ID_FIELD, id);
		return this;
	}
	
	public RightStrandSearchCriteria setIds(List<Long> ids) {
		if (ids.size()==1) {
			setId(ids.get(0));
		} else {
			in(ID_FIELD,ids);
		}
		return this;
	}
	
	
	
}
