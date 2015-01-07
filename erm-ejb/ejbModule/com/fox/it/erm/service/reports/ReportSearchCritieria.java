package com.fox.it.erm.service.reports;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.reports.Reports;

public class ReportSearchCritieria extends SearchCriteria<Reports> {

	public ReportSearchCritieria(EntityManager em) {
		super(em, Reports.class);
	}
	
	public ReportSearchCritieria setDefault() {
		setDescriptionNotNull();
		orderByOrder();
		return this;
	}
	
	public ReportSearchCritieria setDescriptionNotNull() {
		isNotNull("description");
		return this;		
	}
	
	public ReportSearchCritieria orderByOrder() {
		addSort("order");
		return this;		
	}
	

}
