package com.fox.it.erm.factories.reports;

import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;


import com.fox.it.erm.ErmException;
import com.fox.it.erm.query.QueryParameters;
import com.fox.it.erm.query.SavedQuery;


//the version that uses the Factory is in the Spring Integration Samples Project
//this implementation doesn't use the Factory Pattern
public class DRCReport implements ERMReport {

	@Inject
	EntityManager eM;
	
	private String reportHeader;
	private String reportFooter;
	private List<QueryParameters> reportRowsList;
	
	@Override
	public String getContent() throws ErmException {
		return null;
	}

	@Override
	public String getHeader() throws ErmException {
		return reportHeader;
	}

	@Override
	public String getFooter() throws ErmException {
		return reportFooter;
	}

	@SuppressWarnings("unchecked")
	@Override
	public ERMReport createReport(Long reportId, Long queryId) throws ErmException {
		//use queryId to pick up the query name from the SVD_QRY table
		
		DRCReport report = new DRCReport();
		SavedQuery savedQuery = null;
//		ParameterInfo info = null;
	
		try {

			savedQuery = eM.find(SavedQuery.class, queryId);
			
			reportHeader = savedQuery.getName();
			
			setReportHeader(reportHeader);
			
			
			//info = eM.find(ParameterInfo.class, reportId);
			
		
			//reportFooter = info.getFooterLabel();
//			System.out.println("burn: " +  queryId);
			
			
			//setReportFooter(reportFooter);
			
			//use queryId to pick up all the rows that match the queryId in the SVD_QRY_PARAMS
			//get: 1) param_nm, 2) part_id, 3) param_val, 4) param_txt, 5) crt_dt
			//Query query =  eM.createQuery("SELECT m from QueryParameters m where m.queryId = :queryId");
			
			
			//query.setParameter("queryId", queryId);
					
			
			
			//reportRowsList = query.getResultList();
			
			reportRowsList = eM.createQuery("SELECT m from QueryParameters m where m.queryId = :queryId")
					.setParameter("queryId", queryId)
					.getResultList();
			
			setReportRowsList(reportRowsList);
			
		} catch (Exception e) {
			throw new ErmException("something bad happened when trying to get the queryParameters for queryId: " + queryId + " " + e.getLocalizedMessage());
		}
		
		return report;
	}

	public String getReportHeader() {
		return reportHeader;
	}

	public void setReportHeader(String reportHeader) {
		this.reportHeader = reportHeader;
	}

	public String getReportFooter() {
		return reportFooter;
	}

	public void setReportFooter(String reportFooter) {
		this.reportFooter = reportFooter;
	}


	public  List<QueryParameters> getReportRowsList() {
		return reportRowsList;
	}

	public void setReportRowsList(List<QueryParameters> reportRowsList) {
		this.reportRowsList = reportRowsList;
	}
	
	
	

}
