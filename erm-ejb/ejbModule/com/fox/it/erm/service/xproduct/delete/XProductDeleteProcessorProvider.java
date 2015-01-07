package com.fox.it.erm.service.xproduct.delete;


import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import com.fox.it.erm.copy.XProductSections;
import com.fox.it.erm.enums.CopySection;
import com.fox.it.erm.service.ClearanceMemoService;
import com.fox.it.erm.service.ProductService;
import com.fox.it.erm.service.RightStrandSaveService;
import com.fox.it.erm.service.comments.CommentsService;


public class XProductDeleteProcessorProvider {

	private final ClearanceMemoService clearanceMemoService;
	private final CommentsService commentsService;
	private final ProductService productService;
	private final RightStrandSaveService rightStrandSaveService;
	
	@Inject
	public XProductDeleteProcessorProvider(ClearanceMemoService clearanceMemoService,ProductService productService, RightStrandSaveService rightStrandSaveService,CommentsService commentsService) {
		this.clearanceMemoService = clearanceMemoService;
		this.productService = productService;
		this.rightStrandSaveService = rightStrandSaveService;
		this.commentsService = commentsService;
	}
	
	
	private XProductSectionDeleteProcessor get(String section) {
		//TODO implement
		CopySection copySection = CopySection.valueOf(section);
		
		switch (copySection) {
		case CLEARANCE_MEMO: return getClearanceMemoProcessor();
		case COMMENTS: return getCommentsProcessor();
		case INFO_CODES: return getInfoCodesProcessor();
		case STRANDS: return getStrandsProcessor();
//		case SUBRIGHTS: return getSubrightsProcessor();
//		case SALES_AND_MARKETING: return getSalesAndMarketingProcessor();		
		}
		return null;
	}
	
	private XProductSectionDeleteProcessor getStrandsProcessor() {
		return new DeleteStrandsProcessor(rightStrandSaveService);
	}


	private XProductSectionDeleteProcessor getInfoCodesProcessor() {
		return new DeleteInfoCodesProcessor(productService);
	}


	private XProductSectionDeleteProcessor getCommentsProcessor() {
		return new DeleteCommentsProcessor(commentsService);
	}


	private XProductSectionDeleteProcessor getClearanceMemoProcessor() {
		return new DeleteClearanceMemoProcessor(clearanceMemoService);
	}


	public List<XProductSectionDeleteProcessor> get(XProductSections sections) {
		List<XProductSectionDeleteProcessor> processors = new ArrayList<>();
		for (String section: sections.getSections()) {
			XProductSectionDeleteProcessor processor = get(section);
			if (processor!=null) {
				processors.add(processor);
			}
		}
		
		return processors;
	}
	
	

}
