package com.fox.it.erm.reports.factory.products;

import com.fox.it.erm.reports.factory.ERMReport;
import com.fox.it.erm.reports.factory.ERMReportFactory;


public class ProductInquiryExcelReportBean extends ERMReport {
	
	static public class Class extends ERMReportFactory {
		static ERMReportFactory report =  new Class();
		
		public Class() {
			super("productInquiryExcelReport");
		}
		
		public ERMReport newReport() {
			return new ProductInquiryExcelReportBean(this);
		}
		
	}
	
	public ProductInquiryExcelReportBean() {
		
	}
	
	public ProductInquiryExcelReportBean(Class pirClass) {
		
	}
	

}
