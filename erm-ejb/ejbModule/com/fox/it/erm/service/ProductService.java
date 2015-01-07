package com.fox.it.erm.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.ejb.Local;
import javax.validation.constraints.NotNull;

import com.fox.it.erm.ClearanceMemo;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmProductVersion;
import com.fox.it.erm.ErmProductVersionHeader;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.FoxipediaProductGroup;
import com.fox.it.erm.Product;
import com.fox.it.erm.ProductContains;
import com.fox.it.erm.ProductFileNumber;
import com.fox.it.erm.ProductHeader;
import com.fox.it.erm.ProductHeaderOnly;
import com.fox.it.erm.ProductQuery;
import com.fox.it.erm.ProductType;
import com.fox.it.erm.ProductVersion;
import com.fox.it.erm.ProductVersionHeader;
import com.fox.it.erm.comments.EntityComment;

/**
 * Service to find product titles.
 * This service will get only the title meta data and not the rights information.
 * If the includeVersions flag is true, products will be fetched with their versions.
 * @author AndreasM
 *
 */
@Local
public interface ProductService {
	Product findById(@NotNull Long foxId);
	List<Product> findByTitle(@NotNull String title);
	/**
	 * Finds products 
	 * @param q. A JSON String representing a ProductQuery
	 * @see com.fox.it.erm.ProductQuery
	 * @return
	 */
	List<ProductHeader> find(@NotNull String q, String userId) throws ErmException;
	List<ProductHeader> find(@NotNull ProductQuery query, String userId) throws ErmException;
	ProductHeader findProductHeaderById(Long foxId);
	ProductHeaderOnly findProductHeaderOnlyById(Long foxId);

	
	ProductVersionHeader findProductVersionHeaderById(Long foxVersionId);
	ProductVersion findProductVersionById(@NotNull Long foxVersionId);
	ProductVersion findProductVersionById(@NotNull Long foxVersionId,String userId, boolean isFoxipediaSearch);	
	ErmProductVersion findErmProductVersionById(@NotNull Long foxVersionId);
	List<ProductVersion> findProductVersions(@NotNull Long foxId, String strandsQuery);

	/**
	 * Finds the product versions of a fox id, in addition will set the default version attribute
	 * accordingly for each version based on the default version id for the foxId
	 * @param foxId
	 * @param strandsQuery
	 * @return
	 */
	List<ProductVersion> findProductVersionsSetDefault(@NotNull Long foxId, String strandsQuery);

	/**
	 * Finds the product versions of a fox id, in addition will set the default version attribute
	 * accordingly for each version based on the default version id for the foxId.
	 * If the setHasRightStrands is true, then a boolean value will be included in the ProductVersion indicating if the versions has right strands associated with it.
	 * If the flag is false, then the hasRightStrands field will be null
	 * @param foxId
	 * @param setHasRightStrands 
	 * @param strandsQuery
	 * @return
	 */
	List<ProductVersion> findProductVersionsSetDefault(@NotNull Long foxId,boolean setHasRightStrands, String strandsQuery);	
	
	
	
	List<ProductType> findProductTypes();

	/**
	 * Finds the product header versions by ids
	 * @param foxIds
	 * @return
	 */
	List<ProductVersion> findProductVersions(List<Long> foxVersionIds);	
	
	List<ProductVersion> findProductVersions(List<Long> foxIds, String strandsQuery);
	
	List<ProductVersion> findProductVersions(Long foxId,boolean setHasRightStrands);	
	
	List<ProductVersion> findProductVersions(Long foxId,boolean setHasRightStrands, String strandsQuery);	
	
	List<ProductVersion> findProductVersions(Long foxId,boolean setHasRightStrands,boolean includeDefaultVersion, String strandsQuery);	
	
	
	/**
	 * Returns a map with the product version ids and a boolean indicating if the product version has
	 * right strands defined.
	 * Note the map will have each element in the foxVersionIds
	 * @param foxVersionIds
	 * @return
	 */
	Map<Long,String> getHasRightStrands(List<Long> foxVersionIds);
	
	
	/**
	 * Finds foxipedia product groups.
	 */
	List<FoxipediaProductGroup> findFoxipediaGroups(String q, String wildcardType,boolean setHasRightStrands);
	
	/**
	 * Finds foxipedia product groups.
	 * @param q A JSON representation of the query object
	 * @return A list of foxipedia groups
	 */
	List<FoxipediaProductGroup> findFoxipediaGroups(String q);
		
	public void deleteProductInfoCode(String userId, boolean isBusiness, List<Long> id) throws ErmValidationException;	
	/**
	 * Deletes the product info code from a product version
	 * @param foxVersionId
	 * @param userId
	 * @param isBusiness
	 * @param q. id of product info code to delete
	 */		
	public void deleteProductInfoCode(String userId, boolean isBusiness, String q) throws ErmValidationException;
	
	public void deleteProductInfoCodes(Long foxVersionId, String userId, boolean isBusiness);
	
	public EntityComment getRootEntityComment(Long foxVersionId);
	public List<EntityComment> getRootEntityComments(List<Long> foxVersionIds);
	public Map<Long,ClearanceMemo> getClearanceMapForProductVersions(List<ErmProductVersionHeader> productVersionHeaders);	
	
	/**
	 * 
	 * @param foxVersionIds
	 * @return
	 */
	public List<Product> findByFoxVersionIds(@NotNull List<Long> foxVersionIds);
	
	/**
	 * 
	 * @param fvIds
	 * @return
	 */
	public List<Product> getProductByFoxVersionIds(@NotNull String fvIds);
	
	/**
	 * 
	 * @param fileNumbers
	 * @param foxVersionId
	 * @param userId
	 * @return
	 */
	public List<ProductFileNumber> saveProductFileNumber(@NotNull String fileNumbers, Long foxVersionId, String userId) throws Exception;
	
	/**
	 * 
	 * @param fileNumberIds
	 * @param foxVersionId
	 * @param userId
	 * @return
	 */
	public List<ProductFileNumber> deleteProductFileNumber(@NotNull String fileNumberIds, Long foxVersionId, String userId) throws Exception;
	
	public Date getReleaseDate(Long foxVersionId, String userId, boolean isFoxipediaSearch);	
	
	public Date getReleaseDate(Long foxVersionId);
	
	public String findAltId(Long foxVersionId, String type);
	
	public String findJDEId(Long foxVersionId);
	
	public ProductContains getProductContains(Long foxVersionId);
}
