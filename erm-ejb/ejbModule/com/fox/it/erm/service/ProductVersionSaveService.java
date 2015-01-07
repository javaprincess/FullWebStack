package com.fox.it.erm.service;

import java.util.List;

import javax.ejb.Local;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.util.ProductRestrictionCreateObject;

@Local
public interface ProductVersionSaveService {
	
	/**
	 * Saves the restrictions on a product versions.
	 * @param productVersionId
	 * @param userId
	 * @param isBusiness
	 */
	public List<ErmProductRestriction> saveRestrictions(String userId, boolean isBusiness,List<ErmProductRestriction> restrictions) throws ErmValidationException;

	
	public List<ErmProductRestriction> saveRestrictions(String userId, boolean isBusiness,ProductRestrictionCreateObject createObject) throws ErmValidationException;
	
	public List<ErmProductRestriction> saveRestrictions(String userId, boolean isBusiness,String  createObjectJson) throws ErmValidationException;		
	
	public void saveDoNotLicense(Long foxVersionId,String userId, boolean isBusiness, boolean doNotLicense) throws ErmValidationException;
	
	public void updateScripted(Long foxVersionId, String userId, boolean isScripted) throws ErmValidationException;
	
	public void updateFutureMedia(Long foxVersionId, String userId, Integer futureMediaInd);
	
	public void updateLegalConfirmationStatus(Long foxVersionId, String userId, Long legalConfirmationStatusId);
	
	public void updateFoxProducedInd(Long foxVersionId, String userId, Integer foxProducedInd) throws ErmValidationException;
	
	public void updateBusinessConfirmationStatus(Long foxVersionId,Long businessConfirmationStatus,String userId);
	

	@Deprecated
	public void deleteRestriction(String userId, boolean isBusiness, List<Long> restrictionId, Long foxVersionId) throws ErmValidationException;		

	/**
	 * 
	 * @param userId
	 * @param isBusiness
	 * @param isLegal
	 * @param restriction
	 * @return
	 * @throws ErmValidationException
	 */
	public ErmProductRestriction saveRestriction(String userId, boolean isBusiness,boolean isLegal,ErmProductRestriction restriction) throws ErmValidationException;	

	/**
	 * 
	 * @param userId
	 * @param isBusiness
	 * @param createObjectJson
	 * @return
	 * @throws ErmException
	 */
	public List<ErmProductRestriction> adoptRestrictions(String userId, boolean isBusiness,String  createObjectJson) throws ErmException;
}
