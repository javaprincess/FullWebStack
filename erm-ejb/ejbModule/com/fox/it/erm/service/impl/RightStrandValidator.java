package com.fox.it.erm.service.impl;

import java.util.logging.Level;
import java.util.logging.Logger;

import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.RightStrandBase;
import com.fox.it.erm.service.JsonService;

public class RightStrandValidator {
	
	private Logger logger = Logger.getLogger(RightStrandValidator.class.getName());
	
	
	private Logger getLogger() {
		return logger;
	}
	
	protected void validateSecurity(RightStrandBase strand, boolean isBusiness, String operation) throws ErmValidationException{
		if (strand.isBusiness()&&isBusiness) return;
		if (strand.isLegal()&&!isBusiness) return;

		if (strand.isBusiness()) {
			throw new ErmValidationException("Can not " + operation + " business strand " + strand.getRightStrandId()+", You must be a business user");
		}
		if (strand.isLegal()) {
			throw new ErmValidationException("Can not " + operation + " legal strand " + strand.getRightStrandId()+", You must be a legal user");			
		}
		
	}
	
	/**
	 * 
	 * @param strand
	 * @param isBusiness
	 * @param operation
	 * @throws ErmValidationException
	 */
	protected void validateAdoptSecurity(RightStrandBase strand, boolean isBusiness, String operation) throws ErmValidationException{				
		if(strand.isBusiness() && !strand.isLegal() && !isBusiness)return;
		if(strand.isLegal() && !strand.isBusiness() && isBusiness) return;

		
		if (strand.isBusiness() && strand.isLegal()) {
			getLogger().log(Level.SEVERE,"Strand " + strand.getRightStrandId() + " is already adopted");
			JsonService jsonService = new JacksonJsonService();
			String json = jsonService.toJson(strand);
			getLogger().log(Level.SEVERE,"Strand " + strand.getRightStrandId() + ":  " + json);			

		}
		
		
		if(strand.isBusiness() && isBusiness){
			throw new ErmValidationException("Cannot " + operation + " business strand " + strand.getRightStrandId()+", You must be a legal user");
		}
		
		if(strand.isLegal() && !isBusiness){
			throw new ErmValidationException("Cannot " + operation + " legal strand " + strand.getRightStrandId()+", You must be a business user");
		}
	}
	
	
	/**
	 * 
	 * @param restriction
	 * @param isBusiness
	 * @param operation
	 * @throws ErmValidationException
	 */
	protected void validateAdoptRestrictionSecurity(ErmProductRightRestriction restriction, boolean isBusiness, String operation) throws ErmValidationException{
		//TODO fix		
		//the last term in the check help insure that we do not adopt a restriction whose parent right strand has not yet been adopted
		boolean strandIsBusiness = restriction.getErmProductRightStrand().isBusiness();
		boolean strandIsLegal = restriction.getErmProductRightStrand().isLegal();
		if (restriction.isBusiness() && isBusiness ||
			restriction.isLegal() && !isBusiness) {
			String message = null;
			//restriction is already the same type
			if (isBusiness) {
				message = "Restriction is already business";
			} else {
				message = "Restriction is already legal";
			}
			throw new ErmValidationException(message);
		}
		
		if (strandIsBusiness && isBusiness) return;
		if (strandIsLegal && !isBusiness) return;
		
		throw new ErmValidationException("Cannot "+operation+" info code " + restriction.getRestriction().getDescription()+", the strand must be adopted first");
		

	}

}
