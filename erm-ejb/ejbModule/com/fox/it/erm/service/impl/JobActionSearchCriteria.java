package com.fox.it.erm.service.impl;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.jobs.JobAction;

public class JobActionSearchCriteria extends SearchCriteria<JobAction> {

	public JobActionSearchCriteria(EntityManager em) {
		super(em, JobAction.class);
	}

	public JobActionSearchCriteria setId(Long id) {
		equal("id", id);
		return this;
	}
}
