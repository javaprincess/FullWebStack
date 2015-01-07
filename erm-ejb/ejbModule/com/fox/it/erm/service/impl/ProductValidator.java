package com.fox.it.erm.service.impl;

import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.ErmValidationException;

public class ProductValidator {

	protected void validateProductRestriction(ErmProductRestriction restriction, boolean isBusiness, String operation) throws ErmValidationException{
		
		if(restriction.isBusiness() && !isBusiness) return;
		if(restriction.isLegal() && isBusiness) return;
		
		if(restriction.isBusiness()){
			throw new ErmValidationException(" Cannot "+operation+" business product info code "+restriction.getProductRestrictionId());
		}
		if(restriction.isLegal()){
			throw new ErmValidationException(" Cannot "+operation+" legal product info code "+restriction.getProductRestrictionId());
		}
	}
}
