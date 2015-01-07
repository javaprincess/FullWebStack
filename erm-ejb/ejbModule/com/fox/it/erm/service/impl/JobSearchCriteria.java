package com.fox.it.erm.service.impl;

import java.util.Date;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.enums.JobStatus;
import com.fox.it.erm.jobs.Job;


public class JobSearchCriteria extends SearchCriteria<Job> {

	public JobSearchCriteria(EntityManager em) {
		super(em, Job.class);
		addSort("id", false);
	}
	
	public JobSearchCriteria setOwner(String owner) {
		equal("owner", owner);
		return this;
	}
	
	public JobSearchCriteria setNotCompleted() {
		notEqual("statusId", JobStatus.COMPLETED.getId());
		return this;
	}
	
	public JobSearchCriteria setStatus(Long statusId) {
		notEqual("statusId", statusId);
		return this;
	}
	
	
	public JobSearchCriteria setId(Long id) {
		equal("id",id);
		return this;
	}
	
	public JobSearchCriteria completedBefore(Date date) {
		le("completedDate",date);
		return this;
	}

}
