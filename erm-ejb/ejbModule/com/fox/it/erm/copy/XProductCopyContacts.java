package com.fox.it.erm.copy;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;


import com.fox.it.erm.ErmException;

import com.fox.it.erm.ErmProductContact;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.service.ContractualPartyService;
import com.google.common.base.Function;
import com.google.common.collect.Maps;

public class XProductCopyContacts implements XProductSectionCopyProcessor {

	private final ContractualPartyService service;
	
	@Inject
	public XProductCopyContacts(ContractualPartyService service) {
		this.service = service;
	}
	
	
	
	private void copyContacts(Long fromFoxVersionId, Long toFoxVersionId, List<ErmProductContact> contacts, String userId, boolean isBusiness) throws ErmValidationException, ErmException {
		List<ErmProductContact> productContacts = service.findAllContactsForProduct(toFoxVersionId);
		//		List<ErmParty> productContacts = service.findAllContacts(toFoxVersionId);
		Map<Long,ErmProductContact> map = Maps.uniqueIndex(productContacts, new Function<ErmProductContact,Long>(){

			@Override
			public Long apply(ErmProductContact p) {
				return p.getPartyId();
			}
			
		});
		for (ErmProductContact contact: contacts) {
			Long id = contact.getPartyId();
			if (!map.containsKey(id)) {
				Long accessTypeId = contact.getAccessTypeId();
				Long contactTypeId = contact.getContactTypeId();
				service.assignContactToProduct(toFoxVersionId, userId, isBusiness, id, accessTypeId,contactTypeId);
			}
		}
		
	}

	@Override
	public void copy(Long fromFoxVersionId, Long toFoxVersionId,
			XProductCopyData data, String userId, boolean isBusiness)
			throws ErmException {
		if (data.getContacts()!=null) {
			copyContacts(fromFoxVersionId, toFoxVersionId, data.getContacts(),userId,isBusiness);
		}
		
	}

}
