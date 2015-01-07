package com.fox.it.erm.query;



/**
 * 
 * @author tracyade
 * 
 * represents the information listed as static data of the save query params dialog box
 */
public class QueryHeader {
	
	private String userFullName;
	
	private String reportCreateDate;
	
	private String reportName;
	
	private Long queryId;



	public String getReportCreateDate() {
		return reportCreateDate;
	}

	public void setReportCreateDate(String reportCreateDate) {
		this.reportCreateDate = reportCreateDate;
	}

	public String getReportName() {
		return reportName;
	}

	public void setReportName(String reportName) {
		this.reportName = reportName;
	}

	public String getUserFullName() {
		return userFullName;
	}

	public void setUserFullName(String userFullName) {
		this.userFullName = userFullName;
	}

	public Long getQueryId() {
		return queryId;
	}

	public void setQueryId(Long queryId) {
		this.queryId = queryId;
	}
	
	

}
