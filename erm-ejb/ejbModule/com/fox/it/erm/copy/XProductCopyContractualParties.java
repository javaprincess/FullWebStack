package com.fox.it.erm.copy;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import com.fox.it.erm.ErmContractInfo;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.service.ContractualPartyService;
import com.google.common.base.Function;
import com.google.common.collect.Maps;

public class XProductCopyContractualParties implements
		XProductSectionCopyProcessor {

	private final ContractualPartyService service;
	
	@Inject
	public XProductCopyContractualParties(ContractualPartyService service) {
		this.service = service;
	}

	private void copyContracts(Long toFoxVersionId,List<ErmContractInfo> contracts,String userId,boolean isBusiness) throws ErmValidationException, ErmException {
		List<ErmContractInfo> existingContracts =  service.findErmContractsByFoxVersionID(toFoxVersionId);
		Map<Long,ErmContractInfo> map = Maps.uniqueIndex(existingContracts, new Function<ErmContractInfo,Long>(){
			@Override
			public Long apply(ErmContractInfo c) {
				return c.getFoxEntityPartyId();
			}				
		});
		List<ErmContractInfo> save = new ArrayList<>();
		for (ErmContractInfo contract: contracts) {
			Long partyId = contract.getContractualPartyId();
			if (!map.containsKey(partyId)) {
				ErmContractInfo c = new ErmContractInfo();
				c.copyBasicFrom(contract);
				save.add(c);
			}
		}
		service.saveErmContractsByFoxVersionID(toFoxVersionId, userId, isBusiness, save);		
		
	}
	
	@Override
	public void copy(Long fromFoxVersionId, Long toFoxVersionId,
			XProductCopyData data, String userId, boolean isBusiness)
			throws ErmException {
		if (data.getCotracts()!=null) {
			copyContracts(toFoxVersionId,data.getCotracts(),userId,isBusiness);
		}

	}

}
