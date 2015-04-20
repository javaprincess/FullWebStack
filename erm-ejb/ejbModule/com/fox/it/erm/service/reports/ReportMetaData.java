package com.fox.it.erm.service.reports;


public class ReportMetaData {
	
	private String reportURL;
	private Long queryId;
	private String userName;
	private String reportNameStr;
	private String reportNameFormat;
	private String reportNameType;
	
	public ReportMetaData() {
		
	}
	
	public ReportMetaData(String reportName, String reportFormat) {
		setReportNameStr(reportName);
		setReportNameType(reportFormat);
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

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getReportNameStr() {
		return reportNameStr;
	}

	public void setReportNameStr(String reportNameStr) {
		this.reportNameStr = reportNameStr;
	}

	public String getReportNameFormat() {
		return reportNameFormat;
	}

	public void setReportNameFormat(String reportNameFormat) {
		this.reportNameFormat = reportNameFormat;
	}

	public String getReportNameType() {
		return reportNameType;
	}

	public void setReportNameType(String reportNameType) {
		this.reportNameType = reportNameType;
	}
	
	

}
