package com.fox.it.erm.service.reports;

import java.util.List;

import javax.ejb.Local;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.reports.Reports;


@Local
public interface ReportsService {
	
	public List<Reports> findAllReports() throws ErmException;
	
	public ReportsProxy findAllReportMetadata(String userId, boolean isBusiness) throws ErmException;

	public ReportMetaData submit(String json, Long reportFormat, String reportName,  String userId,  boolean isBusiness) throws ErmException;
	
	public String buildReportsURL(String userId, 
			Long savedQueryId, 
			String reportNameStr, 
			String reportNameFormat);	
	
	public ReportMetaData runQuery(String json, String userId, boolean isBusiness) throws ErmException; 
}
