package com.fox.it.erm.reports.factory;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import com.fox.it.erm.reports.enums.FileType;
import com.fox.it.erm.reports.factory.products.DistributionRightsExcelReportBean;
import com.fox.it.erm.reports.factory.products.DistributionRightsPreviewReportBean;
import com.fox.it.erm.reports.factory.products.ProductInquiryExcelReportBean;
import com.fox.it.erm.reports.factory.products.ProductInquiryPreviewReportBean;
import com.fox.it.erm.reports.factory.products.RightsAsEnteredExcelReportBean;
import com.fox.it.erm.reports.factory.products.RightsAsEnteredPreviewReportBean;


public abstract class ERMReportFactory {
	
	private static List<ERMReport> reportList = new ArrayList<ERMReport>();
	protected static ApplicationContext ctx;
	
	
	private ERMReport reportBean;
	
	public abstract ERMReport newReport();
	
	protected ERMReportFactory(String beanName) {
		reportBean = (ERMReport) ctx.getBean(beanName);
		
	}
	
	public static void register() {
		reportList.add(new DistributionRightsExcelReportBean.Class().getReportBean());
		reportList.add(new DistributionRightsPreviewReportBean.Class().getReportBean());
		reportList.add(new ProductInquiryExcelReportBean.Class().getReportBean());
		reportList.add(new ProductInquiryPreviewReportBean.Class().getReportBean());
		reportList.add(new RightsAsEnteredExcelReportBean.Class().getReportBean());
		reportList.add(new RightsAsEnteredPreviewReportBean.Class().getReportBean());
	}
	
	public ERMReport getReportBean() {
		return reportBean;
	}
	
	//public static void addReport(ERMReport report) {
	//	reportList.add(report);
	//}
	
	public static List<ERMReport> getErmReportList() {
		return reportList;
	}
	
	public static void setContext(ApplicationContext context) {
		
		ctx = context;
		
	}
	
	public ApplicationContext getContext() {
		return ctx;
	}


	
	
	
	/*public String getFileType(String reportName, int reportFormat) {
		
		String IBIF_ex = null;
		final int EXCEL = FileType.EXCEL.getId().intValue();
		final int PDF = FileType.PDF.getId().intValue();
		final int HTML = FileType.HTML.getId().intValue();
		
		
	
		
		//NEED A FACTORY HERE
		if (reportName.equals("DRR") || reportName.equals("RER") || reportName.equals("PIR")) {

			if (reportName.equals("DRR")) {
				switch (reportFormat) {
				case 1:
					IBIF_ex = "distribution_rigths_excel.fex";
					break;
				case 3:
					IBIF_ex = "distribution_rights.fex";
					break;
				} //switch
			} //inner if

			if (reportName.equals("RER")) {
				switch (reportFormat) {
				case 1: 
					IBIF_ex = "rights_strands_as_entered_excel.fex";
					break;
				case 3:
					IBIF_ex = "rights_strands_as_entered.fex";
					break;
				}
			} //inner if
		
			if (reportName.equals("PIR")) {
				switch (reportFormat) {
				case 1:
					IBIF_ex = "product_inquiry_excel.fex";
					break;
				case 2:
					IBIF_ex = "product_inquiry_pdf.fex";
					break;
				case 3:
					IBIF_ex = "product_inquiry.fex";
					break;
				}
			} //inner if
		} //outer if

		return IBIF_ex;
		}
		*/
}
