package com.fox.it.erm.service.impl;

import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.ErmValidationException;

public class ProductAdoptValidator extends ProductValidator {

	private static final String operation = "adopt";
	
	public void validateAdoptProductRestriction(ErmProductRestriction restriction, boolean isBusiness) throws ErmValidationException{
		this.validateProductRestriction(restriction, isBusiness, operation);
	}
}
