package com.fox.it.erm.service.impl;

import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.validation.constraints.NotNull;

import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.ErmValidation;
import com.fox.it.erm.service.ErmStrandValidator;
import com.fox.it.erm.util.StrandDescriptionProvider;

public class ErmStrandValidatorImpl implements ErmStrandValidator {

	@Inject
	private OverlapValidator overlapValidator;
	
	@Inject
	private EntityManager em;
	
	public ErmStrandValidatorImpl() {
	}

	
	private ErmValidation getValid() {
		ErmValidation validation = new ErmValidation();
		validation.setValid(true);
		return validation;
	}
	@Override
	public ErmValidation isUpdatable(boolean isBusiness,
			@NotNull List<ErmProductRightStrand> strands) {
		for (ErmProductRightStrand strand: strands) {
			ErmValidation isUpdatable = isUpdatable(isBusiness, strand);
			if (!isUpdatable.isValid()) {
				return isUpdatable;
			}
		}
		return getValid();
 	}
	
	private String getUserTypeDescription(boolean isBusiness) {
		return isBusiness? " Business":"Legal";
	}

	private String getStrandDescription(ErmProductRightStrand strand) {
		return StrandDescriptionProvider.getStrandDescription(em, strand);
		
	}
	
	@Override
	public ErmValidation isUpdatable(boolean isBusiness,
			ErmProductRightStrand strand) {

		if (strand.isNew()) {
			return getValid();
		}
		
		boolean isValid =  (isBusiness && !strand.isBusiness()||
							!isBusiness && !strand.isLegal());
		if (isValid) return getValid();
		ErmValidation validation = new ErmValidation();
		validation.setValid(false);
		validation.setMessage("Can not update strand " + strand.getRightStrandId() + " " + getStrandDescription(strand) + ". User type is: " + getUserTypeDescription(isBusiness) + " but right strand is " + strand.getTypeDescription());
		return validation;		
	}

	private ErmValidation getOverlapValidation(ErmProductRightStrand strand, ErmProductRightStrand existing) {
		ErmValidation validationError = new ErmValidation();
		validationError.setValid(false);
		String message = "Strand " + getStrandDescription(strand) + " overlaps with strand " + getStrandDescription(existing);
		validationError.setMessage(message);
		return validationError;
	}
	
	@Override
	public ErmValidation validateOverlapping(
			ErmProductRightStrand rightStrand, List<ErmProductRightStrand> other) {
		for (ErmProductRightStrand existing:other) {
			if (!(rightStrand==existing)) {
				boolean isOverlap = overlapValidator.isOverlap(rightStrand, existing);
				if (isOverlap) {
					return getOverlapValidation(rightStrand, existing);
				}
			}
		}
		return getValid();
	}

}
