package com.fox.it.erm.factories.reports;


public abstract class ReportsFactory {
	
	private String reportType;

	private Long reportId;
	
	public ReportsFactory(String rType) {
		
		reportType = rType;
	}
	
	public ReportsFactory(Long id) {
		reportId = id;
	}

	public String getReportType() {
		return reportType;
	}


	public Long getReportId() {
		return reportId;
	}

	

	//all of the reports HAVE to implement processData
	//because they each represent a special type of report
	//and this is the entry point for clients to access 
	//a given report
	//for instance, to get to the DRCReport, clients will call
	//DRCReportClass.createReport and get back a ReportFactoryProduct that
	//then then can call the product.getContent() on
	public abstract void processData();


}
