package com.fox.it.erm.copy;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.enums.CopySection;
import com.fox.it.erm.service.ClearanceMemoService;
import com.fox.it.erm.service.ContractualPartyService;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.service.grants.GrantsService;
import com.fox.it.erm.service.impl.CopyStrandsProcessor;
import com.fox.it.erm.service.impl.ProductInfoCodeCopyProcessor;

public class XProductCopyProcessorProvider {

	private final EntityManager em;
	private final CopyStrandsProcessor copyStrandsProcessor;
	private final ProductInfoCodeCopyProcessor infoCodeProcessor;
	private final ClearanceMemoService clearanceMemoService;
	private final CommentsService commentsService;
	private final GrantsService grantsService;
	private final ContractualPartyService contractualPartyService;
 
	
	@Inject
	public XProductCopyProcessorProvider(EntityManager em,CopyStrandsProcessor copyStrandsProcessor,ProductInfoCodeCopyProcessor infoCodeProcessor,ClearanceMemoService clearanceMemoService,CommentsService commentsService,GrantsService grantsService,ContractualPartyService contractualPartyService) {
		this.em = em;
		this.copyStrandsProcessor = copyStrandsProcessor;
		this.infoCodeProcessor = infoCodeProcessor;
		this.clearanceMemoService = clearanceMemoService;
		this.commentsService = commentsService;
		this.grantsService = grantsService;
		this.contractualPartyService = contractualPartyService;
	}
	
	private XProductSectionCopyProcessor getStrandsProcessor() {
		return new XProductCopyStrands(copyStrandsProcessor);
	}
	
	private XProductSectionCopyProcessor getInfoCodesProcessor() {
		return new XProductCopyInfoCodes(infoCodeProcessor);
	}
	
	private XProductSectionCopyProcessor getClearanceMemoProcessor() {
		return new ClearanceMemoCopyProcessor(clearanceMemoService);
	}
	
	private XProductSectionCopyProcessor getCommentsProcessor() {
		return new XProductCopyComments(commentsService);		
	}
	
	private XProductCopyContacts getContactsProcessor() {
		return new XProductCopyContacts(contractualPartyService);
	}
	
	private XProductCopyContractualParties getContractualPartiesProcessor() {
		return new XProductCopyContractualParties(contractualPartyService);
	}
	


	
	private XProductSectionCopyProcessor getSubrightsProcessor() {
		return new XProductCopySubrights(em, grantsService, commentsService);
	}
	
	private XProductSectionCopyProcessor getSalesAndMarketingProcessor() {
		return new XProductCopySalesAndMarketing();
	}
	
	
	private XProductSectionCopyProcessor get(String section) {
		CopySection copySection = CopySection.valueOf(section);
		switch (copySection) {
		case CLEARANCE_MEMO: return getClearanceMemoProcessor();
		case COMMENTS: return getCommentsProcessor();
		case INFO_CODES: return getInfoCodesProcessor();
		case SALES_AND_MARKETING: return getSalesAndMarketingProcessor();
		case STRANDS: return getStrandsProcessor();
		case SUBRIGHTS: return getSubrightsProcessor();
		case CONTACTS: return getContactsProcessor();
		case CONTRACTUAL_PARTIES: return getContractualPartiesProcessor();
		}
		return null;
	}
	
	public List<XProductSectionCopyProcessor> get(XProductSections sections) {
		List<XProductSectionCopyProcessor> processors = new ArrayList<>();
		for (String section: sections.getSections()) {
			XProductSectionCopyProcessor processor = get(section);
			if (processor!=null) {
				processors.add(processor);
			}
		}
		
		return processors;
	}

}
