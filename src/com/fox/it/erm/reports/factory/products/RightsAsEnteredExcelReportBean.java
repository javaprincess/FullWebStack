package com.fox.it.erm.reports.factory.products;

import com.fox.it.erm.reports.factory.ERMReport;
import com.fox.it.erm.reports.factory.ERMReportFactory;


public class RightsAsEnteredExcelReportBean extends ERMReport {
	
	static public class Class extends ERMReportFactory {
		static ERMReportFactory report =  new Class();
		
		public Class() {
			super("rightsAsEnteredExcelReport");
		}
		
		public ERMReport newReport() {
			return new RightsAsEnteredExcelReportBean(this);
		}
		
	}
	
	public RightsAsEnteredExcelReportBean() {
		
	}
	
	public RightsAsEnteredExcelReportBean(Class rerClass) {
		
	}
	

}
