package com.fox.it.erm;

import java.util.List;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;

public class ContractualPartyCriteria {
	
	public static class ContractualPartiesCriteria extends SearchCriteria<ErmParty> {
		public ContractualPartiesCriteria(EntityManager em) {
			super(em, ErmParty.class);
			equal("partyTypeCode", "CONTPTY");
			addSort("displayName");
		}
	}	
	public static ContractualPartiesCriteria getContractualPartiesCriteria(EntityManager em) {
		return new ContractualPartiesCriteria(em);
	}
	
	
	public static class FoxEntitiesCriteria extends SearchCriteria<ErmParty> {
		public FoxEntitiesCriteria(EntityManager em) {
			super(em, ErmParty.class);
			equal("partyTypeCode", "FOXENTTY");
			addSort("displayName");
		}
	}	
	public static FoxEntitiesCriteria getFoxEntitiesCriteria(EntityManager em) {
		return new FoxEntitiesCriteria(em);
	}
	
	public static class ContactsCriteria extends SearchCriteria<ErmParty> {
		public ContactsCriteria(EntityManager em,List<Long> partyIds) {
			super(em, ErmParty.class);
			for (Long partyId: partyIds)
			  notEqual("partyId", partyId);						
			equal("activeFlag", "Y");
			addSort("displayName");
		}
		
		public ContactsCriteria(EntityManager em){
			super(em, ErmParty.class);
			equal("activeFlag", "Y");
		}
	}	
	public static ContactsCriteria getContactsCriteria(EntityManager em, List<Long> partyIds) {		
		return new ContactsCriteria(em, partyIds);
	}
	
	public static ContactsCriteria getContactsCriteria(EntityManager em) {
		return new ContactsCriteria(em);
	}
	
	public static class SearchContactsCriteria extends SearchCriteria<ErmParty> {
		public SearchContactsCriteria(EntityManager em, ErmParty ermParty, List<Long> partyIds) {
			super(em, ErmParty.class);
			for (Long partyId: partyIds)
			  notEqual("partyId", partyId);			
			equal("activeFlag", ermParty.getActiveFlag());
			if (ermParty.getGivenName() != null && !ermParty.getGivenName().equalsIgnoreCase(""))
			  likeUpper("givenName", "%"+ermParty.getGivenName()+"%");
			if (ermParty.getFamilyName() != null && !ermParty.getFamilyName().equalsIgnoreCase(""))
			  likeUpper("familyName", "%"+ermParty.getFamilyName()+"%");
			if (ermParty.getPartyTypeCode() != null && !ermParty.getPartyTypeCode().equalsIgnoreCase(""))
			  equal("partyTypeCode", ermParty.getPartyTypeCode());
			if (ermParty.getJobTitle() != null && !ermParty.getJobTitle().equalsIgnoreCase(""))
			  likeUpper("jobTitle", "%"+ermParty.getJobTitle()+"%");
			if (ermParty.getOrganizationName() != null && !ermParty.getOrganizationName().equalsIgnoreCase(""))
			  likeUpper("organizationName", "%"+ermParty.getOrganizationName()+"%");
			if (ermParty.getOrganizationTypeCode() != null && !ermParty.getOrganizationTypeCode().equalsIgnoreCase(""))
			  equal("organizationTypeCode", ermParty.getOrganizationTypeCode());
			if (ermParty.getDepartment() != null && !ermParty.getDepartment().equalsIgnoreCase(""))
			  likeUpper("department", "%"+ermParty.getDepartment()+"%");
			addSort("displayName");
		}					
	}	
	public static SearchContactsCriteria getSearchContactsCriteria(EntityManager em, ErmParty ermParty, List<Long> partyIds) {		
		return new SearchContactsCriteria(em, ermParty, partyIds);
	}
		
	
	public static class ContactCriteria extends SearchCriteria<ErmParty> {
		public ContactCriteria(EntityManager em, Long partyId) {
			super(em, ErmParty.class);			
			equal("partyId", partyId);			
		}					
	}	
	public static ContactCriteria getContactCriteria(EntityManager em, Long partyId) {		
		return new ContactCriteria(em, partyId);
	}
	
	public static class ProductContactsCriteria extends SearchCriteria<ErmProductContact> {
		public ProductContactsCriteria(EntityManager em, Long foxVersionId) {
			super(em, ErmProductContact.class);			
			equal("foxVersionId", foxVersionId);
			equal("delInd", false);			
			addSort("createDate", false);
		}
	}
	public static ProductContactsCriteria getContactsForProductCriteria(EntityManager em, Long foxVersionId) {
		return new ProductContactsCriteria(em, foxVersionId);
	}	
	
	public static class ProductContactCriteria extends SearchCriteria<ErmProductContact> {
		public ProductContactCriteria(EntityManager em, Long productContactId) {
			super(em, ErmProductContact.class);			
			equal("productContactId", productContactId);
		}
	}
	public static ProductContactCriteria getContactForProductCriteria(EntityManager em, Long productContactId) {
		return new ProductContactCriteria(em, productContactId);
	}
	
	public static class ContractualPartyTypesCriteria extends SearchCriteria<ErmContractualPartyType> {
		public ContractualPartyTypesCriteria(EntityManager em) {
			super(em, ErmContractualPartyType.class);
			addSort("contractualPartyTypeDesc");
		}		
	}	
	public static ContractualPartyTypesCriteria getContractualPartyTypesCriteria(EntityManager em) {
		return new ContractualPartyTypesCriteria(em);
	}
	
	
	public static class PartyTypesCriteria extends SearchCriteria<ErmPartyType> {
		public PartyTypesCriteria(EntityManager em) {
			super(em, ErmPartyType.class);
			addSort("partyTypeDesc");
		}
	}	
	public static PartyTypesCriteria getPartyTypesCriteria(EntityManager em) {
		return new PartyTypesCriteria(em);
	}
	
	public static class ContactTypesCriteria extends SearchCriteria<ErmContactType> {
		public ContactTypesCriteria(EntityManager em) {
			super(em, ErmContactType.class);
			addSort("contactTypeDesc");
		}		
	}	
	public static ContactTypesCriteria getContactTypesCriteria(EntityManager em) {
		return new ContactTypesCriteria(em);
	}
	
	public static class AccessTypesCriteria extends SearchCriteria<ErmAccessType> {
		public AccessTypesCriteria(EntityManager em) {
			super(em, ErmAccessType.class);
			addSort("accessTypeDesc");
		}
	}	
	public static AccessTypesCriteria getAccessTypesCriteria(EntityManager em) {
		return new AccessTypesCriteria(em);
	}
	
	
	public static class OrganizationTypesCriteria extends SearchCriteria<ErmOrganizationType> {
		public OrganizationTypesCriteria(EntityManager em) {
			super(em, ErmOrganizationType.class);
			addSort("organizationTypeDesc");
		}
	}	
	public static OrganizationTypesCriteria getOrganizationTypesCriteria(EntityManager em) {
		return new OrganizationTypesCriteria(em);
	}
	
	public static class CountriesCriteria extends SearchCriteria<ErmCountry> {
		public CountriesCriteria(EntityManager em) {
			super(em, ErmCountry.class);
			addSort("countryDesc");
		}
	}	
	public static CountriesCriteria getCountriesCriteria(EntityManager em) {
		return new CountriesCriteria(em);
	}
	
	public static class ErmContractInfoCriteria extends SearchCriteria<ErmContractInfo> {
		public ErmContractInfoCriteria(Long foxVersionId, EntityManager em) {
			super(em, ErmContractInfo.class);
			equal("foxVersionId", foxVersionId);
			addSort("contractInfoId");
		}		
	}	
	public static ErmContractInfoCriteria getErmContractInfoCriteria(Long foxVersionId, EntityManager em) {
		return new ErmContractInfoCriteria(foxVersionId, em);
	}
	
	
	
	public static class ErmPartyByContractCriteria extends SearchCriteria<ErmParty> {
		public ErmPartyByContractCriteria(Long contractualPartyId, EntityManager em) {
			super(em, ErmParty.class);			
			equal("partyId", contractualPartyId);
		}		
	}	
	public static ErmPartyByContractCriteria getPartyByErmContractyCriteria(Long contractualPartyId, EntityManager em) {
		return new ErmPartyByContractCriteria(contractualPartyId, em);
	}
	
	

}
