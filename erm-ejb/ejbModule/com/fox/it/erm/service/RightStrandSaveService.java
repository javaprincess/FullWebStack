package com.fox.it.erm.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.ejb.Local;
import javax.validation.constraints.NotNull;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.ErmRightStrandSet;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.RightStrandSave;
import com.fox.it.erm.service.impl.CopyToProductsResponse;
import com.fox.it.erm.util.RestrictionObject;
import com.fox.it.erm.util.RightStrandCreateObject;
import com.fox.it.erm.util.RightStrandUpdateObject;

@Local
public interface RightStrandSaveService {

	/**
	 * Saves the list of right strands in the db.
	 * It validates that the strands are not overlapping. 
	 * If there's a validation error, none of the strands will be saved.
	 * After the validation succeeds then the strands will be saved to the db.
	 * After the strands are saved, the bitmaps are propagated to the required versions.
	 * @param strands
	 * @return
	 */
	public List<RightStrandSave> save(Long foxVersionId,boolean isBusiness,String userId,@NotNull List<ErmProductRightStrand> strands) throws ErmException;
	
	/**
	 * Creates a new right strand set
	 * @param foxVersionId
	 * @param name
	 * @param userId
	 * @return
	 */
	public ErmRightStrandSet createSet(Long foxVersionId,String name,String description,String userId);
	
	/**
	 * Create multiple right strands with the Cartesian product of the MTL contained in the RightStrandCreateObject object. 
	 * If the RightStrandCreateObject contains restrictions info, all the strands will be created with the same restrictions.
	 * Example:
	 * If the RightStrandCreateObject contains 2 medias, 3 territories and 1 language then 6 right strands will be created (2 X 3 x 1)
	 * @param r
	 * @param userId
	 * @param isBusiness
	 * @return
	 * @throws ErmException
	 */
	public List<Long> saveCreateObject(RightStrandCreateObject r,String userId, boolean isBusiness) throws ErmException;
	
	/**
	 * Updates the rights strands contained in the ids field for the RightsUpdateObject.
	 * The method will only update values when the field is not null in the RightStrandUpdateObject.
	 * 
	 * For example assume that mediaId is null in the RightStrandUpdateObject and territoryId is specified.
	 * In this case all the strands matching ids will have territory updated but not media.
	 * All strands will be updated with the same values.
	 * If a strand is shared then the strand will be unlinked and a new strand will be created.
	 * If the strand is not of the same type of the user (business/legal) then an exception is thrown.
	 * NOTE: The validation for overlapping is done by the db trigger
	 * @param r
	 * @param userId
	 * @param isBusiness
	 * @return
	 * @throws ErmException
	 */
	public List<Long> update(RightStrandUpdateObject r, String userId, boolean isBusiness) throws ErmException;
	
	
	public List<Long> saveStrandRestrictions(String editObject,String userId, boolean isBusiness) throws ErmException;	
	

	/**
	 * Deletes the strands with its associated data. If the strands or the strand restrictions are shared then the strand or restrictions become unshared
	 * @param userId
	 * @param isBusiness
	 * @param rightStrandIds
	 * @throws ErmException
	 */
	public void deleteRightStrand(String userId, boolean isBusiness,Long foxVersionId, List<Long> rightStrandIds);
	
	public void deleteRightStrands(Long foxVersionId, String userId, boolean isBusiness);
	
	/**
	 * Deletes the right restrictions contained in q.
	 * @param userId
	 * @param isBusiness
	 * @param q Represents an array of ids
	 * @throws ErmValidationException
	 */
	public void deleteRightRestriction(String userId, boolean isBusiness, String q) throws ErmException;

	/**
	 * Deletes the right restrictions by ids
	 * @param userId
	 * @param isBusiness
	 * @param restrictionId
	 * @param foxVersionId
	 * @throws ErmValidationException
	 */
	public void deleteRightRestriction(String userId, boolean isBusiness, List<Long> restrictionId, Long foxVersionId) throws ErmException;		
	
	
	/**
	 * This method is responsible for adopting/UnAdopting right strands. All the information pertaining to the operation is 
	 * contained in the RightStrandUpdateObject. All the fields except for the ids field, and for the processFlag field would
	 * be null. Once the update of the right strand has been done a store procedure is called to update the bitmaps.
	 * @param rightStrandUpdate
	 * @param userId
	 * @param isBusiness
	 * @return
	 * @throws ErmException
	 */
	public List<ErmProductRightStrand> adoptRightStrand(RightStrandUpdateObject rightStrandUpdate, String userId, boolean isBusiness) throws ErmException;
	
	/**
	 * This method is responsible for adopting erm right strand restrictions. It will validate that the restriction is properly
	 * adopted before processing with updating of the restrictions
	 * @param rightStrandUpdate
	 * @param userId
	 * @param isBusiness
	 * @return
	 * @throws ErmException
	 */
	public List<Long> adoptRestriction(RightStrandUpdateObject rightStrandUpdate, String userId, boolean isBusiness) throws ErmException;
	
	/**
	 * 
	 * @param rightStrandUpdate
	 * @param userId
	 * @param isBusiness
	 * @return
	 * @throws ErmException
	 */
	public Map<String, List<? extends Object>> adoptStrandsAndRestrictions(RightStrandUpdateObject rightStrandUpdate, String userId, boolean isBusiness) throws ErmException;

	
	public List<Long> copyStrands(Long foxVersionId, RightStrandUpdateObject update,String userId, boolean isBusiness) throws ErmException;
	
	public CopyToProductsResponse copyStrands(Long foxVersionId, List<Long> toFoxVersionIds,RightStrandUpdateObject update,String userId, boolean isBusiness);
	public CopyToProductsResponse copyProductInfoCodes(Long foxVersionId,List<Long> toFoxVersionIds, List<Long> infoCodeIds,String userId, boolean isBusiness);
	
	public void createLinkedCommentForStrands(List<Long> ids,String subject,String text,String userId,boolean isBusiness) throws ErmException;
	public void createCommentForStrands(List<Long> ids,String subject,String text,String userId,boolean isBusiness) throws ErmException;
	
	public void linkCommentToStrands(Long commentId, List<Long> ids,String userId);	

	/**
	 * 
	 * @param json
	 * @param userId
	 * @param isBusiness
	 * @return a List of the saved ids
	 */
	public  List<Long> getRightStrandsFromCreateObject(String json,String userId, boolean isBusiness) throws ErmException;
	
	
	public List<Long> syncReleaseDate(Long foxVersioId, Date date,String userId, boolean isBusiness) throws ErmException;

	/**
	 * Saves a list or strand restrictions without having to modify the parent strand
	 * @param rightRestrictions
	 * @param userId
	 * @param isBusiness
	 * @return
	 */
	public List<Long> saveStrandRestrictions(List<ErmProductRightRestriction> rightRestrictions,List<RestrictionObject> restrictions,String userId, boolean isBusiness);
}

