package com.fox.it.erm.service;

import java.util.List;
import java.util.Map;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.ErmRightStrand;
import com.fox.it.erm.ErmRightStrandSet;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.service.impl.CopyToProductsResponse;
import com.fox.it.erm.util.CopyStrandsResponse;
import com.fox.it.erm.util.RightStrandCreateObject;

public interface RightStrandService {

	public ErmProductRightStrand findById(Long id);	
	
	public List<ErmProductRightStrand> findByIds(List<Long> ids);
	
	public List<ErmProductRightRestriction> findRestrictionsByIds(List<Long> ids);
	
	/**
	 * 
	 * @param foxVersionId
	 * @return
	 */
	public List<ErmProductRightStrand> loadRightStrands(
			Long foxVersionId);

	/**
	 * 
	 * @param json
	 * @return
	 */
	public RightStrandCreateObject convertToRightStrandCreateObject(
			String json);
	
	

	/**
	 * Finds all the right strands directly assigned to the version or inherited
	 * @param foxVersionId
	 * @return A list of all the right strands either directly assigned to the product or inherited
	 */
	public List<ErmProductRightStrand> findAllRightStrands(Long foxVersionId);
	
	public List<ErmRightStrand> findAllRightStrandsForGrid(Long foxVersionId,boolean isBusiness);
	
	
	
	public List<ErmProductRightStrand> findAllRightStrands(Long foxVersionId, boolean isBusiness);
	
	
	
	/**
	 * 
	 * @param json
	 * @param userId
	 * @param isBusiness
	 * @return
	 */
//	public  List<Long> processRightStrandsFromCreateObject(String json,String userId, boolean isBusiness) throws ErmException;
	
	/**
	 * Creates a new right strand set
	 * @param foxVersionId
	 * @param name
	 * @param userId
	 * @return
	 */
	public ErmRightStrandSet createSet(Long foxVersionId,String name,String description,String userId);
	
	/**
	 * 
	 * @param foxVersionId
	 * @return
	 */
	public List<ErmRightStrandSet> findSets(Long foxVersionId);
	
	/**
	 * Deletes the right strand from a product version
	 * @param foxVersionId
	 * @param userId
	 * @param isBusiness
	 * @param q. list of ids of right strands to delete
	 */		
	public void deleteRightStrand(String userId, boolean isBusiness, String q) throws ErmException;	
	public void deleteRightStrand(String userId, boolean isBusiness, List<Long> rightStrandIds) throws ErmException;
	
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
	
	public void setBitmapUpdater(String userId, Long foxVersionId);
	
	/**
	 * Update one or more RightStrand
	 * @param json
	 * @param userId
	 * @param isBusiness
	 * @return
	 */
	public List<Long> updateRightStrand(String json, String userId, boolean isBusiness) throws ErmException;
	
	/**
	 * 
	 * @param json
	 * @param userId
	 * @param isBusiness
	 * @return
	 * @throws ErmException
	 */
	public Map<String, List<? extends Object>> adoptRightStrandAndRestrictions(String json, String userId, boolean isBusiness) throws ErmException;
	
	/**
	 * 
	 * @param json
	 * @param userId
	 * @param isBusiness
	 * @return
	 * @throws ErmException
	 */
	public CopyStrandsResponse copyRightStrands(String json, String userId, boolean isBusiness) throws ErmException;
	

	/**
	 * Copies the info codes from one product to a list of products
	 * @param infoCodeIds
	 * @param toFoxVersionIds
	 * @param userId
	 * @param isBusiness
	 * @throws ErmException
	 */
	public CopyToProductsResponse copyProductInfoCodes(Long foxVersionId,List<Long> toFoxVersionIds, List<Long> infoCodeIds,String userId, boolean isBusiness) throws ErmException;
	
	public CopyToProductsResponse copyProductInfoCodes(String json,String userId, boolean isBusiness) throws ErmException;
}