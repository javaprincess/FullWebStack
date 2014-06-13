package com.fox.it.erm.reports.factory.products;

import com.fox.it.erm.reports.factory.ERMReport;
import com.fox.it.erm.reports.factory.ERMReportFactory;

public class DistributionRightsPreviewReportBean extends ERMReport {
	
	static public class Class extends ERMReportFactory {
		static ERMReportFactory report =  new Class();
		
		public Class() {
			super("distributionRightsPreviewReport");
		}
		
		public ERMReport newReport() {
			return new DistributionRightsPreviewReportBean(this);
		}
		
	}
	
	public DistributionRightsPreviewReportBean() {
		
	}
	
	public DistributionRightsPreviewReportBean(Class drrClass) {
		
	}
	

}
