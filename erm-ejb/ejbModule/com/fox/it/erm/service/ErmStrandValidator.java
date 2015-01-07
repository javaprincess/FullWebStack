package com.fox.it.erm.service;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.ErmValidation;

/**
 * Validates the right strands.
 * -Ensure that strands are not overlapping
 * -Validate that the strands are updatable based on the type of strands (business or legal)  
 * 
 * @author AndreasM
 *
 */
public interface ErmStrandValidator {
	
	/**
	 * Validates that the strands are editable by the user according to the user type and on whether the strands are legal or business
	 * @param isBusiness
	 * @param strands
	 * @return
	 */
	ErmValidation isUpdatable(boolean isBusiness,@NotNull List<ErmProductRightStrand> strands);
	

	ErmValidation isUpdatable(boolean isBusiness,ErmProductRightStrand strand);
	
	/**
	 * Validates the right strand against the other right strands for overlapping.
	 * @param rightStrand
	 * @param other
	 * @return An ErmStrandValidation object. The object will have  isValid=true if the validation is successful.
	 * In case of error. The message property will indicate the validation error 
	 */
	ErmValidation  validateOverlapping(ErmProductRightStrand rightStrand,List<ErmProductRightStrand> other);

}
