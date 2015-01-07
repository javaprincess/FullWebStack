package com.fox.it.erm.service.reports;

import java.util.List;
import java.util.logging.Logger;



import javax.persistence.EntityManager;

import com.fox.it.erm.query.QuerySearchCriteria;
import com.fox.it.erm.query.SavedQuery;
import com.fox.it.erm.reports.Reports;


public class ReportsProxy {
	
	private EntityManager eM;
	
	private List<Reports> reportsList;
	
	private List<SavedQuery> queryList;
	
	private Logger logger = Logger.getLogger(ReportsProxy.class.getName());
	
	public ReportsProxy(String userId, EntityManager eM) {
		this.eM = eM;
		
		findAllMetadata(userId);
	}
	
	private List<Reports> getReports() {
		ReportSearchCritieria criteria = new ReportSearchCritieria(eM);
		List<Reports> reports = criteria.setDefault().getResultList();
		return reports;
	}
	
	private List<SavedQuery> getQueries(String userId) {
		QuerySearchCriteria criteria = new QuerySearchCriteria(eM);
		return criteria.setCreatedByPredicate(userId).setNameNotNull().sortCreateDate(false).getResultList();
	}
	
	private void findAllMetadata(String userId) {
			logger.info("calling the reportsService.findAllReports method");
//			setReportsList(
//				eM.createQuery("SELECT r from Reports r where r.description is not null order by r.order").getResultList());
			List<Reports> reports = getReports();
			setReportsList(reports);
			
			if (userId!=null) {
				userId = userId.toUpperCase();
			}
			List<SavedQuery> savedQueries = getQueries(userId);
			setQueryList(savedQueries);

//			setQueryList(
//					eM.createQuery("SELECT q from SavedQuery q where UPPER(q.createName)= :userIdString and q.name is not null order by q.createDate desc")
//					.setParameter("userIdString", userId)
//					.getResultList());
		
	}


	public List<Reports> getReportsList() {
		return reportsList;
	}

	public void setReportsList(List<Reports> reportsList) {
		this.reportsList = reportsList;
	}

	public List<SavedQuery> getQueryList() {
		return queryList;
	}

	public void setQueryList(List<SavedQuery> queryList) {
		this.queryList = queryList;
	}

}
