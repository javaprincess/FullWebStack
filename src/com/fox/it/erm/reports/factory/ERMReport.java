package com.fox.it.erm.reports.factory;

public abstract class ERMReport {
	
	protected String reportName;
	protected String shortName;
	protected String fexFileName;
	
	
	public String createShortName(String reportName, String reportFormat) {
		StringBuilder shortName = new StringBuilder(reportName);
		shortName.append(reportFormat);
		return shortName.toString();
	}
	
	
	public String getReportName() {
		return this.reportName;
	}
	
	public String getShortName() {
		return this.shortName;
	}
		
	public String getFexFileName() {
		return this.fexFileName;
	}


	public void setReportName(String reportName) {
		this.reportName = reportName;
	}


	public void setShortName(String shortName) {
		this.shortName = shortName;
	}


	public void setFexFileName(String fexFileName) {
		this.fexFileName = fexFileName;
	}

}
