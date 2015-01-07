package com.fox.it.erm.copy;

import java.util.List;

import javax.inject.Inject;

import com.fox.it.erm.ErmProductContact;
import com.fox.it.erm.service.ContractualPartyService;

public class XProductContactsFinder {

	private final ContractualPartyService service;
	
	@Inject
	public XProductContactsFinder(ContractualPartyService service) {
		this.service = service;
	}
	
	public List<ErmProductContact> findContacts(Long foxVersionId) {
		List<ErmProductContact> contacts = service.findAllContactsForProduct(foxVersionId);
		return contacts;
	}

}
