package com.fox.it.erm.service.impl;

/**
 * Determines if a legal status should get a clearance memo indicator (black box)
 * @author AndreasM
 *
 */
public class ClearanceMemoInciatorLglConfStatusProvider {

	private static final Integer[] LEGAL_CONF_STATUS_CM = {1,2,100,110,111,112,113,114};
	
	public ClearanceMemoInciatorLglConfStatusProvider() {

	}
	
	
	public Integer[] getLegalIndicatorsWithCM() {
		return LEGAL_CONF_STATUS_CM;
	}
	
	public boolean shouldHaveCM(Number legalConfStatusId) {
		if (legalConfStatusId==null) return false;
		Integer id = legalConfStatusId.intValue();
		for (Integer legalConfStatus: LEGAL_CONF_STATUS_CM) {
			if (id.equals(legalConfStatus)) return true;
		}
		return false;
	}
	

}
