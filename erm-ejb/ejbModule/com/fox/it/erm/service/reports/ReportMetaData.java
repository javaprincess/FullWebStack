package com.fox.it.erm.service.reports;


public class ReportMetaData {
	
	private String reportURL;
	private Long queryId;
	
	public ReportMetaData() {
		
	}
	
	public void setReportURL(String reportURL) {
		this.reportURL = reportURL;
	}


	public String getReportURL() {
		return reportURL;
	}

	public Long getQueryId() {
		return queryId;
	}

	public void setQueryId(Long queryId) {
		this.queryId = queryId;
	}
	
	

}
