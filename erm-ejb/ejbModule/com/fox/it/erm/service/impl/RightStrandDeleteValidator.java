package com.fox.it.erm.service.impl;

import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.RightStrandBase;

public class RightStrandDeleteValidator extends RightStrandValidator {
	private static final String operation = "delete ";
	
	
	public void validate(RightStrandBase strand, boolean isBusiness) throws ErmValidationException{
		validateSecurity(strand,isBusiness,operation);
	}

}
