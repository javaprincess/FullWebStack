package com.fox.it.erm.reports.factory.products;


import com.fox.it.erm.reports.factory.ERMReport;
import com.fox.it.erm.reports.factory.ERMReportFactory;

public class DistributionRightsExcelReportBean extends ERMReport {
	
	
	
	static public class Class extends ERMReportFactory {
		//static ERMReportFactory report =  new Class();
		
		public Class() {
			super("distributionRightsExcelReport");
		}
		
		public ERMReport newReport() {
			return new DistributionRightsExcelReportBean(this);
		}
		
	}
	
	public DistributionRightsExcelReportBean() {
		
	}
	
	public DistributionRightsExcelReportBean(Class drrClass) {
		
	}
	

}
