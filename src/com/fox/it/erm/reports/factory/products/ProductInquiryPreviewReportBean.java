package com.fox.it.erm.reports.factory.products;


import com.fox.it.erm.reports.factory.ERMReport;
import com.fox.it.erm.reports.factory.ERMReportFactory;


public class ProductInquiryPreviewReportBean extends ERMReport {
	
	static public class Class extends ERMReportFactory {
		static ERMReportFactory report =  new Class();
		
		public Class() {
			super("productInquiryPreviewReport");
		}
		
		public ERMReport newReport() {
			return new ProductInquiryPreviewReportBean(this);
		}
		
	}
	
	public ProductInquiryPreviewReportBean() {
		
	}
	
	public ProductInquiryPreviewReportBean(Class pirClass) {
		
	}
	

}
