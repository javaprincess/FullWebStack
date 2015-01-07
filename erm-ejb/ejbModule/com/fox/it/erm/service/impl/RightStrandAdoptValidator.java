package com.fox.it.erm.service.impl;

import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.RightStrandBase;

public class RightStrandAdoptValidator extends RightStrandValidator {

	private static final String operation = "adopt ";
	
	public void validate(RightStrandBase strand, boolean isBusiness) throws ErmValidationException{
		validateAdoptSecurity(strand,isBusiness,operation);
	}
	
	public void validateRestriction(ErmProductRightRestriction restriction, boolean isBusiness) throws ErmValidationException{
		validateAdoptRestrictionSecurity(restriction, isBusiness, operation);
	}
}
