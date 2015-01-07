package com.fox.it.erm.service.impl;
import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.ErmProductVersion;

public class ErmProductVersionSeachCriteria extends SearchCriteria<ErmProductVersion>{

	public ErmProductVersionSeachCriteria(EntityManager em) {
		super(em,ErmProductVersion.class );
	}
	
	public ErmProductVersionSeachCriteria setFoxVersionId(Long foxVersionId) {
		equal("foxVersionId",foxVersionId);
		return this;
	}


}
