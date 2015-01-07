package com.fox.it.erm.copy;

import javax.inject.Inject;

import com.fox.it.erm.enums.CopySection;




/**
 * Gets the data to copy for a product
 * @author AndreasM
 *
 */
public class XProductCopyDataProvider {

	private final XProductCopyStrandsFinder strandsFinder;
	private final XProductCopyInfoCodesFinder infoCodesFinder;
	private final XProductCopyClearanceMemoFinder clearanceMemoFinder;
	private final XProductCopyCommentsFinder commentsFinder;
	private final XProductCopySubrightsFinder subrightsFinder;
	private final XProductCopySalesAndMarketingFinder salesAndMarketingFinder;
	private final XProductContactsFinder contactsFinder;
	private final XProductContractualPartyFinder contractualPartyFinder;
	
	@Inject
	public XProductCopyDataProvider(XProductCopyStrandsFinder strandsFinder,
									XProductCopyInfoCodesFinder infoCodesFinder,
									XProductCopyClearanceMemoFinder clearanceMemoFinder,
									XProductCopyCommentsFinder commentsFinder,
									XProductCopySubrightsFinder subrightsFinder,
									XProductCopySalesAndMarketingFinder salesAndMarketingFinder,
									XProductContactsFinder contactsFinder,
									XProductContractualPartyFinder contractualPartyFinder
									) {
		this.strandsFinder = strandsFinder;
		this.infoCodesFinder = infoCodesFinder;
		this.clearanceMemoFinder = clearanceMemoFinder;
		this.commentsFinder = commentsFinder;
		this.subrightsFinder = subrightsFinder;
		this.salesAndMarketingFinder = salesAndMarketingFinder;
		this.contactsFinder = contactsFinder;
		this.contractualPartyFinder = contractualPartyFinder;
	}
	
	
	
	public XProductCopyData get(Long foxVersionId,XProductSections sections,boolean isBusiness)  {
		XProductCopyData copyData = new XProductCopyData();
		for (String section: sections.getSections()) {
			CopySection copySection = CopySection.valueOf(section);
			switch (copySection) {
			case STRANDS: copyData.setStrands(strandsFinder.find(foxVersionId, isBusiness));				
				break;
			case CLEARANCE_MEMO: copyData.setClearanceMemo(clearanceMemoFinder.find(foxVersionId, sections.getClearanceMemoCommentIds()));
								 copyData.setClearanceMemoNodeIds(sections.getClearanceMemoCommentIds());
				break;
			case COMMENTS: copyData.setComments(commentsFinder.find(foxVersionId, isBusiness));
				break;
			case INFO_CODES: copyData.setRestrictions(infoCodesFinder.find(foxVersionId, isBusiness));
				break;
			case SALES_AND_MARKETING:  copyData.setSalesAndMarketing(salesAndMarketingFinder.find(foxVersionId));
				break;
			case SUBRIGHTS: copyData.setSubrights(subrightsFinder.find(foxVersionId));
				break;
			case CONTACTS: copyData.setContacts(contactsFinder.findContacts(foxVersionId));
				break;
			case CONTRACTUAL_PARTIES: copyData.setCotracts(contractualPartyFinder.findContracts(foxVersionId));
				break;
			
			}
		}
		
		return copyData;
	}

}
