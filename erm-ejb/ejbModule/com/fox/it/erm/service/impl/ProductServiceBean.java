package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;
import javax.validation.constraints.NotNull;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.ClearanceMemo;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.ErmProductVersion;
import com.fox.it.erm.ErmProductVersionHeader;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.FoxipediaProductGroup;
import com.fox.it.erm.Product;
import com.fox.it.erm.ProductBase;
import com.fox.it.erm.ProductContains;
import com.fox.it.erm.ProductFileNumber;
import com.fox.it.erm.ProductFileNumberHeader;
import com.fox.it.erm.ProductHeader;
import com.fox.it.erm.ProductHeaderOnly;
import com.fox.it.erm.ProductQuery;
import com.fox.it.erm.ProductType;
import com.fox.it.erm.ProductVersion;
import com.fox.it.erm.ProductVersionAltId;
import com.fox.it.erm.ProductVersionBase;
import com.fox.it.erm.ProductVersionHeader;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.enums.ProductFileNumberType;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.ProductService;
import com.fox.it.erm.service.impl.ProductSearchCriterias.ErmProductVersionHeaderSearchCriteria;
import com.fox.it.erm.service.impl.ProductSearchCriterias.FoxipediaGroupSearchCriteria;
import com.fox.it.erm.service.impl.ProductSearchCriterias.ProductSearchCriteria;
import com.fox.it.erm.service.impl.ProductSearchCriterias.ProductVersionSearchCriteria;
import com.fox.it.erm.util.ExceptionUtil;
import com.fox.it.erm.util.IdsUtil;
import com.fox.it.erm.util.JPA;
import com.fox.it.erm.util.StrandsUtil;
import com.fox.it.erm.util.StringUtil;
import com.google.common.collect.Lists;


@Stateless
public class ProductServiceBean extends ServiceBase implements ProductService {

	private static final String JDE_ID_TYPE="VAULT_VER";
	
	private static final Logger logger = Logger.getLogger(ProductServiceBean.class.getName());
	private static final int IN_LIMIT =1000;	
	
	@Inject
	private JsonService jsonService;
	
	@Inject
	private FoxipediaUserSetter foxipediaUserSetter;
	
	@Inject
	private EntityManager em;

	private JsonToProductQueryConverter jsonToProductQueryConverter = new JsonToProductQueryConverter(new JacksonJsonService());
	
	private static final String DELETE_PRODUCTINFOCODE_PROCEDURE_NAME = "REMOVE_PROD_RSTRCN(?,?,?,?)";		
	
	private List<ProductType> productTypes;	
	@Override
	public Product findById(@NotNull Long foxId) {
		ProductSearchCriteria searchCriteria = ProductSearchCriterias.getProductSearchCriteria(em);
		searchCriteria.setFoxId(foxId);
		Product product = searchCriteria.getSingleResult();
		return product;
	}


	
	@Override
	public List<Product> findByTitle(String title) {
		ProductSearchCriteria searchCriteria = ProductSearchCriterias.getProductSearchCriteria(em);
		searchCriteria.setTitle(title);
		List<Product> products = searchCriteria.getResultList();
		return products;		
	}

	/**
	 * Finds products based on a ProductQuery.
	 * The string is a JSON representation to a ProductQuery object and then a query is executed 
	 * @param q. A JSON String representing a ProductQuery
	 * @see com.fox.it.erm.ProductQuery
	 * @return
	 */	
	@Override
	public List<ProductHeader> find(String q,String userId)  {
		ProductQuery productQuery = jsonToProductQueryConverter.convert(q);
		List<ProductHeader> products = find(productQuery,userId); 
		return products;
	}
	
	public ProductHeader findProductHeaderById(Long foxId) {
		ProductHeaderSearchCriteria criteria = new ProductHeaderSearchCriteria(em);
		criteria.setId(foxId);
		return criteria.getSingleResult();
	}
	
	public ProductHeaderOnly findProductHeaderOnlyById(Long foxId) {
		ProductHeaderOnlySearchCriteria criteria = new ProductHeaderOnlySearchCriteria(em).setId(foxId);
		return criteria.getSingleResult();
	}


	
	public List<ProductHeader> find(@NotNull ProductHeaderSearchCriteria criteria,String userId) {
		getLogger().info("Finding products..");
		List<ProductHeader> products = new ArrayList<ProductHeader>();
		try {	
			products = criteria.getResultList();
			getLogger().info("Got " + products.size());
		} catch (Exception e) {
			getLogger().log(Level.SEVERE,"Exception finding products "  ,e);
			ExceptionUtil exceptionUtil = new ExceptionUtil();
			ErmException ermException = exceptionUtil.getErmException(e);
//			throw ermException;
			throw new RuntimeException(ermException.getMessage(),e);
		}
		return products;
	}
	
	ProductQueryToSearchCriteriaConverter getQueryToSearchCriteriaConverter() {
		return new ProductQueryToSearchCriteriaConverter();
	}
	
	private List<ProductHeader> findByIdsInBatch(List<String> ids,String idType, String userId,boolean includeVersions,boolean includeHasRights) {		
		String idsAsString = IdsUtil.getIdsAsString(ids);
		ProductQuery productQuery = new ProductQuery();
		productQuery.setIncludeVersions(includeVersions);
		productQuery.setIncludeHasRights(includeHasRights);
		productQuery.setIdType(idType);
		productQuery.setQ(idsAsString);
		productQuery.setWildcardType("EQ");
		return find(productQuery,userId);
	}
	
	private void sortByTitle(List<ProductHeader> productHeaders) {
		Comparator<ProductHeader> comparator = new Comparator<ProductHeader>() {

			private String toComparableTitle(String s) {
				return s==null?"": s.toUpperCase();
			}
			
			@Override
			public int compare(ProductHeader p1, ProductHeader p2) {
				String t1 = toComparableTitle(p1.getTitle());
				String t2 = toComparableTitle(p2.getTitle());
				return t1.compareTo(t2);
			}
			
		};
		Collections.sort(productHeaders,comparator);
	}
	
	private List<ProductHeader> findByIds(List<String> ids, String idType,String userId,boolean includeVersions,boolean includeHasRights) {
		List<List<String>> list = Lists.partition(ids, IN_LIMIT);
		List<ProductHeader> all = new ArrayList<>();
		for (List<String> sublist: list) {
			List<ProductHeader> batch = findByIdsInBatch(sublist, idType, userId,includeVersions,includeHasRights);
			all.addAll(batch);
		}
		//now sort by title
		sortByTitle(all);
		return all;
	}
	
	
	private void setIsFoxipediaSearch(boolean isFoxipediaSearch, String userId) {
		//TODO comment/uncomment accordingly 
		if (isFoxipediaSearch) {
			foxipediaUserSetter.set(userId);
		} else {
			foxipediaUserSetter.clear();
		}
		setUserInDBContext(userId, null, isFoxipediaSearch);
	}
	
	public List<ProductHeader> find(@NotNull ProductQuery query,String userId) {
		
		boolean includeVersions = query.isIncludeVersions();
		boolean includeHasRights = query.isIncludeHasRights();
		setIsFoxipediaSearch(query.isFoxipediaSearch(), userId);
		//AMV 3/14/2014
		//this is to accommodate searches by id of more than 1000 id (in limit)		
		//not very happy about this, but we don't have time.
		if (query.isSearchByID() && query.getQ() != null && query.getQ().length() > 0) {
			String q = query.getQ();
			String[] ids = q.split(", ");
			if (ids!=null && ids.length>JPA.IN_LIMIT) {
				//split the ids and make one query for each
				List<String> idsList = Arrays.asList(ids);
				String idType = query.getIdType();
				return findByIds(idsList,idType,userId,includeVersions,includeHasRights);
			}
		}
		ProductQueryToSearchCriteriaConverter converter = getQueryToSearchCriteriaConverter();
		ProductHeaderSearchCriteria criteria = new ProductHeaderSearchCriteria(em);
		converter.convert(query, criteria);
		return find(criteria,includeVersions,includeHasRights,userId);
	}
		
	
	private void setStrandsQuery(List<? extends ProductBase> products, String strandsQuery) {
		for (ProductBase product: products) {
			product.setStrandsQuery(strandsQuery);
		}
	}


	private void setHasStrandsForProductVersions(List<? extends ProductVersionBase> productVersions) {
		RightsIndicatorProcessor processor = new RightsIndicatorProcessor(em);
		processor.setHasStrandsForProductVersions(productVersions);
	}
	
	public List<ProductHeader> find(@NotNull ProductHeaderSearchCriteria criteria,boolean includeVersions,boolean setHasStrands,String userId) {
		List<ProductHeader> products = find(criteria,userId);

		if (setHasStrands) {
			//accumulate all product versions in productVersions
			List<ProductVersionHeader> productVersions = new ArrayList<>();
			for (ProductHeader productHeader: products) {
				productVersions.add(productHeader.getErmProductVersionHeader());
			}
			setHasStrandsForProductVersions(productVersions);
		}
		if (criteria.getStrandsQuery() != null){
		  setStrandsQuery(products, criteria.getStrandsQuery());
		}
		return products;	
	}
	
	
	
	private List<ProductFileNumber> findProductFileNumbers(Long foxVersionId) {
		List<ProductFileNumberHeader> fileNumbersHeaders = (new ProductFileNumberHeaderSearchCriteria(em)).setFoxVersionId(foxVersionId).getResultList();
		List<ProductFileNumber> fileNumbers = new ArrayList<>();
		for (ProductFileNumberHeader header: fileNumbersHeaders) {
			ProductFileNumber fileNumber = new ProductFileNumber();
			fileNumber.copyFromBase(header);
			fileNumbers.add(fileNumber);
		}
		return fileNumbers;
	}
	
	
	private ProductVersion findProductVersionByItsParts(Long foxVersionId) {
		ProductVersionHeaderSearchCriteria criteria = new ProductVersionHeaderSearchCriteria(em).setFoxVersionId(foxVersionId);
		ProductVersionHeader productVersionHeader = criteria.getSingleResult();
		Long foxId = productVersionHeader.getFoxId();
		ProductHeaderOnly productHeader = em.find(ProductHeaderOnly.class, foxId);
		ProductVersion productVersion = new ProductVersion();
		productVersion.copyFromBase(productVersionHeader);
		Product product = new Product();
		product.copyFromBase(productHeader);
		
		List<ProductFileNumber> fileNumbers = findProductFileNumbers(foxVersionId);
		productVersion.setProductFileNumbers(fileNumbers);
		
		//find JDE id
		String jdeId = findJDEId(foxVersionId);
		productVersion.setJdeId(jdeId);
		
		ErmProductVersionHeaderSearchCriteria versionHeaderSearchCriteria = new ErmProductVersionHeaderSearchCriteria(em).setId(foxVersionId);
		List<ErmProductVersionHeader> ermProductVersions = versionHeaderSearchCriteria.getResultList();
//		List<ErmProductVersionHeader> productVersionHeaders = versionHeaderSearchCriteria.getResultList();
		Map<Long,ClearanceMemo> clearanceMap = getClearanceMapForProductVersions(ermProductVersions);
		List<Long> foxVersionIds = new ArrayList<>();
		foxVersionIds.add(foxVersionId);
		Map<Long,Long> doNotLicenseMap = getDoNotLicenseMapForProductVersions(foxVersionIds);
		if (doNotLicenseMap != null && doNotLicenseMap.size() > 0)
		  productVersion.setDoNotLicenseID(doNotLicenseMap.get(productVersion.getFoxVersionId()) != null ? doNotLicenseMap.get(productVersion.getFoxVersionId()) : 0);
		if (clearanceMap != null && clearanceMap.size() > 0)
		  productVersion.setClearanceMemo(clearanceMap.get(productVersion.getFoxVersionId()));			  			

		ErmProductVersion ermProductVersion = null;
		if (ermProductVersions.size()==1) {
			ermProductVersion = new ErmProductVersion();
			ermProductVersion.copyFrom(ermProductVersions.get(0));
		}
		productVersion.setProduct(product);
		productVersion.setErmProductVersionHeader(ermProductVersion);
		return productVersion;
	}
	
	@Override
	public ProductVersion findProductVersionById(Long foxVersionId) {
		return findProductVersionById(foxVersionId, null, false);
	}
	
	@Override
	public ProductVersion findProductVersionById(@NotNull Long foxVersionId,String userId, boolean isFoxipediaSearch) {
		if (!isFoxipediaSearch) {
			clearContext();
		} else {
			setUserInDBAndFoxipediaContext(userId, null, isFoxipediaSearch);
		}
		return findProductVersionByItsParts(foxVersionId);		
	}
	
	@Override
	public ErmProductVersion findErmProductVersionById(Long foxVersionId){
		ErmProductVersion ermProductVersion = em.find(ErmProductVersion.class, foxVersionId);
		return ermProductVersion;
	}
		

	@Override
	public List<ProductVersion> findProductVersionsSetDefault(@NotNull Long foxId, String strandsQuery) {	
		return findProductVersionsSetDefault(foxId,false,strandsQuery);
	}
	
	/**
	 * Finds the product versions of a fox id, in addition will set the default version attribute
	 * accordingly for each version based on the default version id for the foxId
	 * @param foxId
	 * @return
	 */	
	@Override
	public List<ProductVersion> findProductVersionsSetDefault(@NotNull Long foxId, boolean setHasRights, String strandsQuery) {	
		Product product = findById(foxId);
		if (product!=null) {
			List<ProductVersion> versions = findProductVersions(product,setHasRights);
//			List<ProductVersion> versions = findProductVersions(foxId,setHasRights,strandsQuery);
			return versions;
		}
		return new ArrayList<>();
	}
	
	public List<ProductVersion> findProductVersions(Long foxId,boolean setHasRightStrands,boolean includeDefaultVersion,String strandsQuery) {
		ProductVersionSearchCriteria searchCriteria = ProductSearchCriterias.getProductVersionSearchCriteira(em);		
		searchCriteria.setFoxProductId(foxId);
		if (!includeDefaultVersion) {
			searchCriteria.excludeDefault();
		}		
		ProductQueryToSearchCriteriaConverter converter = getQueryToSearchCriteriaConverter(); 
		converter.convertVersionCriteria(foxId, includeDefaultVersion, strandsQuery, searchCriteria);
		
		List<ProductVersion> productVersions = searchCriteria.getResultList();		
		if (setHasRightStrands) {
			setHasStrandsForProductVersions(productVersions);
		}
		Collections.sort(productVersions);
		
		return productVersions;		
	}


	@Override
	public List<ProductVersion> findProductVersions(Long foxId, boolean setHasRights) {
		return findProductVersions(foxId,setHasRights,null);
	}

	@Override
	public List<ProductVersion> findProductVersions(Long foxId, String strandsQuery) {
		return findProductVersions(foxId,false,strandsQuery);
	}
	
	private List<ProductVersion> findProductVersions(Product product,boolean setHasRights) {
		List<ProductVersion> productVersions = new ArrayList<>();
		if (product==null) return productVersions;
		Long foxId = product.getFoxId();
		ProductVersionHeaderSearchCriteria criteria = new ProductVersionHeaderSearchCriteria(em);
		criteria.setFoxProductId(foxId);
		List<ProductVersionHeader> productVersionHeaders = criteria.getResultList();
		if (setHasRights) {
			setHasStrandsForProductVersions(productVersionHeaders);
		}
		for (ProductVersionHeader productVersion: productVersionHeaders) {
			productVersion.setProduct(product);
		}
		for (ProductVersionHeader productVersionHeader: productVersionHeaders) {
			ProductVersion productVersion = new ProductVersion();
			productVersion.copyFromBase(productVersionHeader);
			productVersions.add(productVersion);
		}
		
		return productVersions;
	}
	
	
	
	private List<Long> getFoxVersionsIdsForProductVersions(@NotNull List<? extends ProductVersionBase> productVersions) {
		List<Long> ids = new ArrayList<>(productVersions.size());
		for (ProductVersionBase productVersion: productVersions) { 
			ids.add(productVersion.getFoxVersionId());
		}
		return ids;	
	}
	
	
	@Override
	public List<ProductVersion> findProductVersions(Long foxId,boolean setHasRights,String strandsQuery) {
		ProductVersionSearchCriteria searchCriteria = ProductSearchCriterias.getProductVersionSearchCriteira(em);
		searchCriteria.setFoxProductId(foxId);
		List<ProductVersion> productVersions = searchCriteria.getResultList();
		if (setHasRights) {
		  setHasStrandsForProductVersions(productVersions);
		}
		//TODO optimize this, this shouldn't be done on all the nodes of the hierarchy ony on the product that's being selected
		//imagine bones, or simpsons. if we get all the descendants with all their data this will be time consuming.
		//data should be fetched when they click a specific product
		List<Long> foxVersionIds = getFoxVersionsIdsForProductVersions(productVersions);						
		Map<Long,Long> doNotLicenseMap = getDoNotLicenseMapForProductVersions(foxVersionIds);		
		ErmProductVersionHeaderSearchCriteria versionHeaderSearchCriteria = ProductSearchCriterias.getErmProductVersionSearchCriteria(em);
		versionHeaderSearchCriteria.setIds(foxVersionIds);						
		List<ErmProductVersionHeader> productVersionHeaders = versionHeaderSearchCriteria.getResultList();
		Map<Long,Boolean> scriptedMap = getScriptedMapForProductVersions(productVersionHeaders);
		//this should be fetched in batch
		Map<Long,ClearanceMemo> clearanceMap = getClearanceMapForProductVersions(productVersionHeaders);
		for (ProductVersion version : productVersions) {
		  if (doNotLicenseMap != null && doNotLicenseMap.size() > 0)
		    version.setDoNotLicenseID(doNotLicenseMap.get(version.getFoxVersionId()) != null ? doNotLicenseMap.get(version.getFoxVersionId()) : 0);
		  if (scriptedMap != null && scriptedMap.size() > 0)
		    version.setScriptedFlag(scriptedMap.get(version.getFoxVersionId()) != null ? scriptedMap.get(version.getFoxVersionId()) : false);
		  if (clearanceMap != null && clearanceMap.size() > 0)
			version.setClearanceMemo(clearanceMap.get(version.getFoxVersionId()));
		}
		return productVersions;
	}
	
	
	/**
	 * Populates the DO_NOT_LICENSE_ID in the product version with the value in the DB
	 * @return
	 */
	private Map<Long,Long> getDoNotLicenseMapForProductVersions(List<Long> foxVersionIds) {
		ErmProductRestrictionSearchCriteria searchCriteria = new ErmProductRestrictionSearchCriteria(em);
		searchCriteria.setDoNotLicenseCriteria(foxVersionIds);
		List<ErmProductRestriction> ermProductRestrictions = searchCriteria.getResultList();				
		Map<Long,Long> doNotLicenseMap = new HashMap<>(foxVersionIds.size());		
		for (ErmProductRestriction ermProductRestriction: ermProductRestrictions) {
		  logger.info("getDoNotLicenseMapForProductVersions version id: " + ermProductRestriction.getFoxVersionId() + " productRestrictionId : " + ermProductRestriction.getProductRestrictionId());
		  doNotLicenseMap.put(ermProductRestriction.getFoxVersionId(),  ermProductRestriction.getProductRestrictionId());
		}
		return doNotLicenseMap;		
	}
	
	/**
	 * Populates the SCRIPTED FLAG in the product version with the value in the DB
	 * @return
	 */
	private Map<Long,Boolean> getScriptedMapForProductVersions(List<ErmProductVersionHeader> productVersionHeaders) {					
		Map<Long,Boolean> scriptedMap = new HashMap<>(productVersionHeaders.size());		
		for (ErmProductVersionHeader productVersion: productVersionHeaders) {
		  scriptedMap.put(productVersion.getFoxVersionId(), productVersion.isScripted());
		}
		return scriptedMap;		
	}	
	/**
	 * Populates the CLEARANCE MEMO in the product version with the value in the DB
	 * @return
	 */
	public Map<Long,ClearanceMemo> getClearanceMapForProductVersions(List<ErmProductVersionHeader> productVersionHeaders) {		
		Map<Long,ClearanceMemo> clearanceMap = new HashMap<>(productVersionHeaders.size());
		List<Long> idsWithClearanceMemo = new ArrayList<>();
		for (ErmProductVersionHeader productVersion: productVersionHeaders) {		  
		  if (productVersion.hasClearanceMemo()) {
			idsWithClearanceMemo.add(productVersion.getFoxVersionId());
		  }			 						
		}
		List<EntityComment> entityComments = getRootEntityComments(idsWithClearanceMemo);
		for (EntityComment entityComment: entityComments) {
			ClearanceMemo cm = new ClearanceMemo();
		    cm.setEntityComment(entityComment);
			clearanceMap.put(entityComment.getEntityId(), cm);
		}
		return clearanceMap;	
	}		
	
	
	private List<ProductVersion> findProductVersionInBatch(List<Long> foxIds, String strandsQuery) {
		ProductVersionSearchCriteria searchCriteria = ProductSearchCriterias.getProductVersionSearchCriteira(em);
		searchCriteria.setFoxProductIds(foxIds);
		if (strandsQuery != null)
		  searchCriteria.setStrandsQuery(strandsQuery);
		List<ProductVersion> productVersions = searchCriteria.getResultList();
		getLogger().info("Found " + productVersions.size() + " product versions");
		return productVersions;		
	}
	
	private List<ProductVersion> findProductVersionByFoxVersionIdInBatch(List<Long> foxVersionIds, String strandsQuery) {
		ProductVersionSearchCriteria searchCriteria = ProductSearchCriterias.getProductVersionSearchCriteira(em);
		searchCriteria.setFoxVersionIds(foxVersionIds);
		if (strandsQuery != null)
		  searchCriteria.setStrandsQuery(strandsQuery);
		List<ProductVersion> productVersions = searchCriteria.getResultList();
		getLogger().info("Found " + productVersions.size() + " product versions");
		return productVersions;		
	}

	/**
	 * Searches for product versions for a list of ids.
	 * Implemented this method as opposed to relying on the Product -->ProductVersion relationship because EclipseLink performs one additional query for each product. 
	 */
	@Override
	public List<ProductVersion> findProductVersions(List<Long> foxIds, String strandsQuery) {
		getLogger().info("Finding product versions for " + foxIds.size() + " products");
		List<ProductVersion> productVersions = new ArrayList<>(foxIds==null?0:foxIds.size());
		if (foxIds==null||foxIds.size()==0) return productVersions;
		if (foxIds.size()<=IN_LIMIT) {
			productVersions=findProductVersionInBatch(foxIds,strandsQuery);
		} else {
			List<List<Long>> splittedIds = Lists.partition(foxIds, IN_LIMIT);
			for (List<Long> batchIds: splittedIds) {
				productVersions.addAll(findProductVersionInBatch(batchIds,strandsQuery));
			}
		}
		getLogger().info("Found " + productVersions.size() + " product versions");		
		return productVersions;		
		
	}
	
	/**
	 * Finds the product versions by foxVersionIds
	 */
	public List<ProductVersion> findProductVersions(List<Long> foxVersionIds) {			
		List<ProductVersion> productVersions = new ArrayList<>(foxVersionIds==null?0:foxVersionIds.size());
		if (foxVersionIds==null||foxVersionIds.size()==0) return productVersions;
		if (foxVersionIds.size()<=IN_LIMIT) {
			productVersions=this.findProductVersionByFoxVersionIdInBatch(foxVersionIds, null);
		}
		else {
			List<List<Long>> splittedIds = Lists.partition(foxVersionIds, IN_LIMIT);
			for (List<Long> batchIds: splittedIds) {
				productVersions.addAll(findProductVersionByFoxVersionIdInBatch(batchIds,null));
			}
		}
		return productVersions;
	}
	

	private boolean shouldReloadProductTypes() {
		return shouldRefreshCache(productTypes);
	}

	
	@Override
	public List<ProductType> findProductTypes() {
		if (shouldReloadProductTypes()) {
			productTypes = ProductSearchCriterias.getProductTypeSearchCriteria(em).getResultList();
		}
		return productTypes;
	}

	
	public List<FoxipediaProductGroup> findFoxipediaGroups(String q, String wildcardType,boolean setHasRightStrands) {
		FoxipediaGroupSearchCriteria criteria = ProductSearchCriterias.getFoxipediaGroupSearchCriteria(em);
		criteria.setName(q, wildcardType);
		List<FoxipediaProductGroup> groups = criteria.getResultList();
		return groups;
	}
	
	
	
	public List<FoxipediaProductGroup> findFoxipediaGroups(String q) {	
		ProductQuery productQuery = jsonToProductQueryConverter.convert(q);
		String foxipediaGroupQ = productQuery.getQ();
		String wildcardType = productQuery.getWildcardType();
		boolean setHasRights = true;
		return findFoxipediaGroups(foxipediaGroupQ,wildcardType,setHasRights);
	}
	


	private Logger getLogger() {
		return logger;
	}

	@Override
	public void deleteProductInfoCode(String userId, boolean isBusiness, List<Long> productInfoCodes)  {
		logger.info("delete product info code called for:  " + productInfoCodes + " and userId: " + userId);
		for (Long productInfoCode : productInfoCodes) {
			Query query = em.createNativeQuery("call " + DELETE_PRODUCTINFOCODE_PROCEDURE_NAME);
			query.setParameter(1, productInfoCode);						
			query.setParameter(2, isBusiness ? 'B' : 'L');
			query.setParameter(3, userId.toUpperCase());
			query.setParameter(4, 'Y');			
			long t0 = System.currentTimeMillis();			
			query.executeUpdate();
			long t1 = System.currentTimeMillis();
			logger.info("Done deleting product info code in " + (t1-t0) + " ms");
		}
	}

	@Override
	public void deleteProductInfoCode(String userId, boolean isBusiness, String q) throws ErmValidationException {
		JsonToDeleteRightsRestrictionStrandCreateObject converter = new JsonToDeleteRightsRestrictionStrandCreateObject(jsonService);		 
		logger.info("delete product info code called for:  " + q + " and userId: " + userId);
		deleteProductInfoCode(userId, isBusiness, converter.convert(q).getProductInfoCodeRestrictionIds());		
	}
	
	@Override
	public void deleteProductInfoCodes(Long foxVersionId, String userId, boolean isBusiness) {
		//first find the info codes
		ErmProductRestrictionSearchCriteria criteria = new ErmProductRestrictionSearchCriteria(em);
		criteria.setFoxVersionId(foxVersionId);
		criteria.setIsBusiness(isBusiness);
		List<ErmProductRestriction> restrictions = criteria.getResultList();
		List<Long> ids = StrandsUtil.getProductRestrictionIds(restrictions);
		deleteProductInfoCode(userId, isBusiness,ids);

	}


	@Override
	public EntityComment getRootEntityComment(Long foxVersionId) {
		EntityCommentSearchCriteria criteria = new EntityCommentSearchCriteria(em);
		criteria.setFoxVersionId(foxVersionId);
		criteria.setCommentTypeId(ClearanceMemoServiceBean.CLEARANCE_MEMO_ENTITY_COMMENT_TYPE_ID);
		EntityComment comment = criteria.getSingleResult();
		logger.info("Inside Product Service Bean getRootEntityComment:  " + comment);
		return comment;		
	}
	
	@Override
	public List<EntityComment> getRootEntityComments(List<Long> foxVersionIds) {
		if (foxVersionIds==null||foxVersionIds.isEmpty()) {
			return new ArrayList<>();
		}
		EntityCommentSearchCriteria criteria = new EntityCommentSearchCriteria(em);
		criteria.setFoxVersionIds(foxVersionIds);
		criteria.setCommentTypeId(ClearanceMemoServiceBean.CLEARANCE_MEMO_ENTITY_COMMENT_TYPE_ID);
		return criteria.getResultList();		
		
	}
	
	
	@Override
	public List<Product> findByFoxVersionIds(@NotNull List<Long> foxVersionIds){
		List<Product> productList = new ArrayList<Product>();
		if(foxVersionIds != null && foxVersionIds.size() > 0){
			ProductVersionSearchCriteria psc = ProductSearchCriterias.getProductVersionSearchCriteira(em);
			psc.setFoxVersionIds(foxVersionIds);
			List<ProductVersion> pvs = psc.getResultList();
			if(pvs != null && pvs.size() > 0){
				List<Long> foxIds = new ArrayList<Long>();
				for(ProductVersion p : pvs){
					foxIds.add(p.getFoxId());
				}
				ProductSearchCriteria pSearchCriteria = ProductSearchCriterias.getProductSearchCriteria(em);
				pSearchCriteria.setFoxIds(foxIds);
				productList = pSearchCriteria.getResultList();
			}
		}
		return productList;
	}
	
	/**
	 * 
	 * @param fvIds
	 * @return
	 */
	public List<Product> getProductByFoxVersionIds(@NotNull String fvIds){
		String[] ids = fvIds.split(",");
		if(ids.length > 0){
			List<Long> foxVersionIds = new ArrayList<Long>();
			for(String id : ids){			
				foxVersionIds.add(Long.parseLong(id));				
			}
			return this.findByFoxVersionIds(foxVersionIds);
			
		}
		return new ArrayList<Product>();
	}
	
	/**
	 * 
	 * @param fileNumbers
	 * @param foxVersionId
	 * @param userId
	 * @return
	 */
	public List<ProductFileNumber> saveProductFileNumber(@NotNull String fileNumbers, Long foxVersionId, String userId) throws Exception{
		String[] fn = null;
		if(fileNumbers.indexOf(",") > -1){
			fn = fileNumbers.split(",");
		}
		else {
			fn = new String[]{fileNumbers};
		}
		List<String> numberList = new ArrayList<String>();
		for(String s : fn){
			if(!StringUtil.isEmptyOrWhitespace(s)){
				numberList.add(s.trim());
			}
		}		
		return saveProductFileNumber(numberList, foxVersionId, userId);
	}
	
	/**
	 * 
	 * @param productFileNumbers
	 * @param foxVersionId
	 * @param userId
	 * @return
	 */
	public List<ProductFileNumber> saveProductFileNumber(List<String> productFileNumbers, Long foxVersionId, String userId) throws Exception{
		
		if(productFileNumbers != null && productFileNumbers.size() > 0){
			for(String fileNumber : productFileNumbers){
				ProductFileNumber pfn = new ProductFileNumber();
				Date createDate = Calendar.getInstance().getTime();
				
				pfn.setCreateDate(createDate);
				pfn.setUpdateDate(createDate);
				pfn.setCreateName(userId);
				pfn.setUpdateName(userId);
				pfn.setFoxVersionId(foxVersionId);
				fileNumber = fileNumber.replaceAll("%", "&#37;");
				pfn.setFileNumber(fileNumber);
				pfn.setFileNumberTypeId(ProductFileNumberType.CFNO.getId());
				em.persist(pfn);
			}
			
			return this.LoadProductFileNumbers(foxVersionId);
		}
		return new ArrayList<ProductFileNumber>();
	}
	
	/**
	 * 
	 * @param fileNumberIds
	 * @param foxVersionId
	 * @param userId
	 * @return
	 */
	public List<ProductFileNumber> deleteProductFileNumber(@NotNull String fileNumberIds, Long foxVersionId, String userId){
		
		String[] fn = null;
		if(fileNumberIds.indexOf(",") > -1){
			fn = fileNumberIds.split(",");
		}
		else {
			fn = new String[]{fileNumberIds};
		}
		List<Long> numberList = new ArrayList<Long>();
		for(String s : fn){
			numberList.add(Long.parseLong(s));
		}
		
		return deleteProductFileNumber(numberList, foxVersionId, userId);
	}
	
	/**
	 * 
	 * @param productFileNumberIds
	 * @param foxVersionId
	 * @param userId
	 * @return
	 */
	public List<ProductFileNumber> deleteProductFileNumber(List<Long> productFileNumberIds, Long foxVersionId, String userId){
		
		SearchCriteria<ProductFileNumber> sc = SearchCriteria.get(em, ProductFileNumber.class);
		sc.in("productFileNumberId", productFileNumberIds);
		List<ProductFileNumber> list = sc.getResultList();
		if(list != null && list.size() > 0){
			for(ProductFileNumber p : list){
				em.remove(p);
			}
			em.flush();
		}
				
		return this.LoadProductFileNumbers(foxVersionId);
		
	}
	
	public List<ProductFileNumber> LoadProductFileNumbers(Long foxVersionId){
		SearchCriteria<ProductFileNumber> sc = SearchCriteria.get(em, ProductFileNumber.class);
		sc.equal("foxVersionId", foxVersionId);
		sc.addSort("fileNumber");
		return sc.getResultList();
	}

	@Override
	public Map<Long,String> getHasRightStrands(List<Long> foxVersionIds) {	
		RightsIndicatorProcessor processor = new RightsIndicatorProcessor(em);
		return processor.getHasRightStrands(foxVersionIds);		
	}

	@Override
	public Date getReleaseDate(Long foxVersionId, String userId, boolean isFoxipediaSearch) {
		//AMV 11/18/2014. Not sure if that's the case but will check
		//NOTE this might be throwing an exception 
		//ORA-14450: attempt to access a transactional temp table already in use
//		setIsFoxipediaSearch(isFoxipediaSearch, userId);
		return getReleaseDate(foxVersionId);
	}
	
	@Override
	public Date getReleaseDate(Long foxVersionId) {
		String sql = "Select FRST_REL_DT from edm_global_title_vw t, edm_global_title_version_vw v where t.fox_id = v.fox_id and v.fox_version_id=?";
		Query q = em.createNativeQuery(sql).setParameter(1, foxVersionId);
		//AMV 11/13/2014
		try {
		Date date = (Date)q.getSingleResult();
		return date;		
		} catch (NoResultException e) {
			//this means that there are no rows returned. must likely because of confidential titles
			getLogger().info("No rows returend when trying to find release date for " + foxVersionId);
			return null;
		}

	}

	@Override
	public String findAltId(Long foxVersionId, String type) {
		ProductVersionAltIdSearchCriteria criteria = new ProductVersionAltIdSearchCriteria(em);
		List<ProductVersionAltId> ids = criteria.setFoxVersionId(foxVersionId).setType(type).getResultList();
		if (ids.isEmpty()) return null;
		return ids.get(0).getAltId();
		
	}
	
	@Override
	public String findJDEId(Long foxVersionId) {
		return findAltId(foxVersionId,JDE_ID_TYPE);
	}



	@Override
	public ProductVersionHeader findProductVersionHeaderById(Long foxVersionId) {
		ProductVersionHeaderSearchCriteria criteria = new ProductVersionHeaderSearchCriteria(em).setFoxVersionId(foxVersionId);
		return criteria.getSingleResult();
	}
	
	@Override
	public ProductContains getProductContains(Long foxVersionId) {
		ProductContainsProcessor productContainsProcessor = new ProductContainsProcessor(em);
		return productContainsProcessor.get(foxVersionId);
	}
	
	
}
