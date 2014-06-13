package com.fox.it.erm.reports.factory.products;

import com.fox.it.erm.reports.factory.ERMReport;
import com.fox.it.erm.reports.factory.ERMReportFactory;


public class RightsAsEnteredPreviewReportBean extends ERMReport {
	
	static public class Class extends ERMReportFactory {
		static ERMReportFactory report =  new Class();
		
		public Class() {
			super("rightsAsEnteredPreviewReport");
		}
		
		public ERMReport newReport() {
			return new RightsAsEnteredPreviewReportBean(this);
		}
		
	}
	
	public RightsAsEnteredPreviewReportBean() {
		
	}
	
	public RightsAsEnteredPreviewReportBean(Class rerClass) {
		
	}
	

}
