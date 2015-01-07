package com.fox.it.erm.copy;

import java.util.List;

import javax.inject.Inject;

import com.fox.it.erm.ErmContractInfo;
import com.fox.it.erm.service.ContractualPartyService;

public class XProductContractualPartyFinder {

	
	private final ContractualPartyService service;
	
	@Inject
	public XProductContractualPartyFinder(ContractualPartyService service) {
		this.service = service;
	}
	
	public List<ErmContractInfo> findContracts(Long foxVersionId) {
		return service.findErmContractsByFoxVersionID(foxVersionId);
	}

}
