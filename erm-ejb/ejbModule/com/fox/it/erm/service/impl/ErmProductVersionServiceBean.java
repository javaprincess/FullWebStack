package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.fox.it.erm.ClearanceMemo;
import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.ErmProductVersion;
import com.fox.it.erm.ErmProductVersionHeader;
import com.fox.it.erm.ErmRightStrandSet;
import com.fox.it.erm.Language;
import com.fox.it.erm.Media;
import com.fox.it.erm.Product;
import com.fox.it.erm.ProductHeader;
import com.fox.it.erm.ProductHierarchy;
import com.fox.it.erm.ProductVersionBase;
import com.fox.it.erm.ProductVersionHeader;
import com.fox.it.erm.enums.RightsConsumptionStatus;
import com.fox.it.erm.service.ErmProductVersionService;
import com.fox.it.erm.service.ProductService;
import com.fox.it.erm.service.RightStrandSetService;
import com.fox.it.erm.service.impl.ProductSearchCriterias.ErmProductVersionHeaderSearchCriteria;
import com.fox.it.erm.util.ErmNode;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
import com.fox.it.erm.util.ProductHeaderToProductConverter;
import com.fox.it.erm.util.ProductType;
import com.google.common.base.Function;
import com.google.common.base.Predicate;
import com.google.common.base.Strings;
import com.google.common.collect.Collections2;
import com.google.common.collect.Maps;

@Stateless
public class ErmProductVersionServiceBean extends ServiceBase implements ErmProductVersionService {

	
	@Inject
	private EntityManager em;
	
	@Inject
	@EJB
	private ProductService productService;	
	
	@Inject
	@EJB
	private RightStrandSetService strandSetService;
	
	
	private static final Logger logger = Logger.getLogger(ErmProductVersionServiceBean.class.getName());
	
	
	public ErmProductVersionServiceBean() {
		super();
	}

	public ErmProductVersionServiceBean(EntityManager em) {
		super();
		this.em = em;
	}
	
	private Logger getLogger() {
		return logger;
	}
	

	/**
	 * @param ermProductVersionId
	 * @return
	 */
	@Override
	public ErmProductVersion findById(Long ermProductVersionId) {
		ErmProductVersionSeachCriteria criteria = new ErmProductVersionSeachCriteria(em).setFoxVersionId(ermProductVersionId);
		return criteria.getSingleResult();
//		ErmProductVersion epv = em.find(ErmProductVersion.class, ermProductVersionId);
//		return epv;
//		return findByIdNew(ermProductVersionId);		
	}
	
	/**
	 * 
	 * @param ermProductVersionId
	 * @return
	 */
//	public ErmProductVersion findByIdNew(Long ermProductVersionId){
//		
//		ErmProductVersion epv = em.find(ErmProductVersion.class, ermProductVersionId);
//		//String queryString = " select e from ErmProductRightStrand e where e.foxVersionId = "+epv.getFoxVersionId()+" order by e.media.name , e.territory.name , e.language.name";
//		//Query query = em.createQuery(queryString);
//		//List<ErmProductRightStrand> list = query.getResultList();
////		Set<ErmProductRightStrand> setBefore = epv.getErmProductRightStrands();
////		if(setBefore != null && !setBefore.isEmpty()){
////			Set<ErmProductRightStrand> set = new TreeSet<ErmProductRightStrand>(new RightComparator());
////			set.addAll(setBefore);			
////			epv.setErmProductRightStrands(set);
////		}
////		else {
////			logger.log(Level.INFO, "UNABLE TO RETRIEVE ErmProductRightStrand");
////		}		
//		return epv;		
//	}
	
	
	/**
	 * 
	 * @param foxVersionId
	 * @return
	 */
	private List<ProductHierarchy> getChildrenHierarchy(Long foxVersionId){
		List<ProductHierarchy> list = getProductHierarchy(foxVersionId, "parentFoxVersionId");
		return list;
	}
	
	private List<ProductHierarchy> getParentFromHierarchy(Long foxVersionId) {
		List<ProductHierarchy> list = getProductHierarchyForSeason(foxVersionId, "parentFoxVersionId");
		return list;
	}
	
	/**
	 * Load the production product hierarchy
	 * @param foxVersionId
	 * @param hierachyString
	 * @return
	 */
	private List<ProductHierarchy> getProductHierarchyForSeason(Long foxVersionId, String hierachyString){
		ProductHierarchySearchCriteria psc = new ProductHierarchySearchCriteria(em).
				setChildFoxVersionId(foxVersionId).setHierarchyCode(ProductType.PRODUCTION);
		List<ProductHierarchy> productHierarchy = psc.getResultList();
		List<Long> childIds = IdsAccumulator.getIds(productHierarchy, new IdProvider<ProductHierarchy>() {			
			@Override
			public Long getId(ProductHierarchy p) {
				return p.getChildFoxId();
			}
		});
		if (!childIds.isEmpty()) {
			ProductHeaderSearchCriteria productHeaderSearchCriteria = new ProductHeaderSearchCriteria(em);
			productHeaderSearchCriteria.setIds(childIds);
			List<ProductHeader> products = productHeaderSearchCriteria.getResultList();
			Map<Long,ProductHeader> productMap = Maps.uniqueIndex(products, new Function<ProductHeader,Long>() {

				@Override
				public Long apply(ProductHeader p) {
					return p.getFoxId();
				}
					
			});
			for (ProductHierarchy ph: productHierarchy) {
				Long childProductId = ph.getChildFoxId();
				ProductHeader product = productMap.get(childProductId);
				ph.setChildProduct(product);
			}
		}
		return productHierarchy; 
	}
	
	/**
	 * Load the production product hierarchy
	 * @param foxVersionId
	 * @param hierachyString
	 * @return
	 */
	private List<ProductHierarchy> getProductHierarchy(Long foxVersionId, String hierachyString){
		ProductHierarchySearchCriteria psc = new ProductHierarchySearchCriteria(em).
				setParentFoxVersionId(foxVersionId).setHierarchyCode(ProductType.PRODUCTION);
//		psc.setHierarchyCode(ProductType.PRODUCTION);
//		psc.equal(hierachyString, foxVersionId);
//		psc.equal("hierarchyCode", ProductType.PRODUCTION);
		List<ProductHierarchy> productHierarchy = psc.getResultList();
		List<Long> childIds = IdsAccumulator.getIds(productHierarchy, new IdProvider<ProductHierarchy>() {			
			@Override
			public Long getId(ProductHierarchy p) {
				return p.getChildFoxId();
			}
		});
		if (!childIds.isEmpty()) {
			ProductHeaderSearchCriteria productHeaderSearchCriteria = new ProductHeaderSearchCriteria(em);
			productHeaderSearchCriteria.setIds(childIds);
			List<ProductHeader> products = productHeaderSearchCriteria.getResultList();
			Map<Long,ProductHeader> productMap = Maps.uniqueIndex(products, new Function<ProductHeader,Long>() {

				@Override
				public Long apply(ProductHeader p) {
					return p.getFoxId();
				}
					
			});
			for (ProductHierarchy ph: productHierarchy) {
				Long childProductId = ph.getChildFoxId();
				ProductHeader product = productMap.get(childProductId);
				ph.setChildProduct(product);
			}
		}
		return productHierarchy; 
	}
	
	
	public ErmNode<? extends ProductVersionBase> getMovieTVProductVersions(Long foxVersionId) {
		return getMovieTVProductVersions(foxVersionId, null,false);
	}
	
	
	/**
	 * Main method in charge of loading all movie versions or all season episodes and their versions.
	 * @param foxVersionId
	 * @return
	 * @throws Exception
	 */
	public ErmNode<? extends ProductVersionBase> getMovieTVProductVersions(Long foxVersionId,String userId,boolean isFoxipediaSearch) {		
		if (!isFoxipediaSearch) {
			clearContext();
		} else {
			setUserInDBAndFoxipediaContext(userId, null, isFoxipediaSearch);
		}
		Logger logger = getLogger();
		
		logger.info("getMovieTVProductVersions: foxVersionId: " + foxVersionId);
		
		ProductVersionHeader productVersionHeader = em.find(ProductVersionHeader.class, foxVersionId);
		
		logger.info("productVersionHeader: " + productVersionHeader);
		
		Long foxId = productVersionHeader.getFoxId();
		
		logger.info("foxId: " + foxId);
		
		ProductHeader productHeader = em.find(ProductHeader.class, foxId);
		Product product = new Product();
		product.copyFromBase(productHeader);
		
		if(ProductType.FEATURE.equalsIgnoreCase(product.getProductTypeCode())){
			return getMovieProductVersion(product);
		}
		else {
			return getTVProductVersion2(product,productVersionHeader);
		}
	}
	
	
	private List<ProductHeader> findProductHeaderByIds(List<Long> foxIds) {
		List<ProductHeader> productHeaders = new ArrayList<>();
		if (foxIds==null||foxIds.isEmpty()) {
			return productHeaders;
		}
		//now find all the products version headers with ids
		ProductHeaderSearchCriteria productHeaderSearchCriteria = new ProductHeaderSearchCriteria(em);
		productHeaderSearchCriteria.setIds(foxIds).sortByTitle();
		return productHeaderSearchCriteria.getResultList();
	}
	
	private List<ProductVersionHeader> findAllProductVersionsForProducts(List<Long> foxIds,List<Long> exceptIds) {
		if (foxIds==null||foxIds.isEmpty()) {
			return new ArrayList<ProductVersionHeader>();
		}
		ProductVersionHeaderSearchCriteria criteria = new ProductVersionHeaderSearchCriteria(em);
		criteria.setFoxProductIds(foxIds);
		criteria.excludeFoxVersionIds(exceptIds);
		criteria.sortByVersionTitle();
		return criteria.getResultList();
	}
	
	private Map<Long,List<ProductVersionHeader>> getProductVersionMapByFoxId(List<ProductVersionHeader> versions) {
		Map<Long,List<ProductVersionHeader>> map = new HashMap<>();
		for (ProductVersionHeader version: versions) {
			Long foxId = version.getFoxId();
			List<ProductVersionHeader> versionsByFoxIds = null;
			if (!map.containsKey(foxId)) {
				versionsByFoxIds = new ArrayList<>();
				map.put(foxId,versionsByFoxIds);
			} else {
				versionsByFoxIds = map.get(foxId);
			}
			versionsByFoxIds.add(version);
		}
		return map;
	}
	
	private ErmNode<ProductVersionHeader> getHierarchyNode(ProductHeader productHeader,List<ProductVersionHeader> versions) {
		Product product = ProductHeaderToProductConverter.toProduct(productHeader);

		Long defaultFoxVersionId = productHeader.getDefaultVersionId();
		ErmNode<ProductVersionHeader> node = new ErmNode<ProductVersionHeader>();
		ProductHeaderToProductConverter.setProduct(versions, product);
		//find the default version and set is as data, add all the others as child
		for (ProductVersionHeader productVersionHeader: versions) {
			if (defaultFoxVersionId.equals(productVersionHeader.getFoxVersionId())) {
				node.setData(productVersionHeader);
			} else {
				ErmNode<ProductVersionHeader> child = new ErmNode<ProductVersionHeader>();
				child.setData(productVersionHeader);
				node.getChildren().add(child);
			}
		}
		return node;
	}


	
	private void assembleHierarchy(ErmNode<ProductVersionHeader> parentNode,List<ProductHeader> productHeaders,List<ProductVersionHeader> productVersions) {
		Map<Long,List<ProductVersionHeader>> versionsByFoxId = getProductVersionMapByFoxId(productVersions);
		for (ProductHeader productHeader:productHeaders) {
			Long foxId = productHeader.getFoxId();
			List<ProductVersionHeader> versions = versionsByFoxId.get(foxId);
			ErmNode<ProductVersionHeader> node = getHierarchyNode(productHeader, versions);
			//TODO fix this, this is temporary and it should work, but only account for a hierarchy 3 levels deep
			parentNode.getChildren().add(node);
		}
	}
	
	private void setIsDefault(Set<Long> defaultVersionIds, List<ProductVersionHeader> versions) {
		for (ProductVersionHeader version: versions) {
			Long foxVersionId = version.getFoxVersionId();
			if (defaultVersionIds.contains(foxVersionId)) {
				version.setIsDefaultVersion(Boolean.TRUE);
			}
		}
	}
	
	private ErmNode<ProductVersionHeader> getTVProductVersion2(Product product,ProductVersionHeader productVersion) {
		//all we need to do is sort the results
		ErmNode<ProductVersionHeader> parentNode = new ErmNode<ProductVersionHeader>();		
		List<ProductHierarchy> hierarchy = null;
		Long foxVersionId = productVersion.getFoxVersionId();
		Long defaultVersionId = product.getDefaultVersionId();
		if (productVersion.getFoxVersionId().equals(defaultVersionId)) {
		  productVersion.setIsDefaultVersion(true);		 
		}		
		if (product.getProductTypeCode().equalsIgnoreCase(ProductType.EPISODE) || product.getProductTypeCode().equalsIgnoreCase(ProductType.SEASON)) {		  
		  hierarchy = getParentFromHierarchy(product.getDefaultVersionId());
		  if (hierarchy != null && hierarchy.size() > 0) {
			if (product.getProductTypeCode().equalsIgnoreCase(ProductType.EPISODE)) {
			  ProductVersionHeader seasonVersion = em.find(ProductVersionHeader.class, hierarchy.get(0).getParentFoxVersionId());
		      hierarchy = getChildrenHierarchy(seasonVersion.getFoxVersionId());
		      product.setDefaultVersionId(seasonVersion.getFoxVersionId());		    
		      parentNode.setData(seasonVersion);
		    } else {
		      hierarchy = getChildrenHierarchy(product.getDefaultVersionId());
		      parentNode.setData(productVersion);
		    }
		  } else {
			parentNode.setData(productVersion);
		  }
		} else {
		  hierarchy = getChildrenHierarchy(foxVersionId);
		  parentNode.setData(productVersion);
		}		
		
		
		//now get collect all the fox ids
		List<Long> foxIds = IdsAccumulator.getIds(hierarchy, new IdProvider<ProductHierarchy>() {
			@Override
			public Long getId(ProductHierarchy h) {
				return h.getChildFoxId();
			}
		});
		
		int episodeCount = 0;
		if (product.getProductTypeCode().equalsIgnoreCase(ProductType.SEASON) || product.getProductTypeCode().equalsIgnoreCase(ProductType.EPISODE)) {
		  episodeCount = foxIds.size();
		  parentNode.getData().setEpisodeCount(episodeCount); 
		}
		
		int seasonCount = 0;
		if (product.getProductTypeCode().equalsIgnoreCase(ProductType.SERIES)) {
		  seasonCount = foxIds.size();
		  parentNode.getData().setSeasonCount(seasonCount); 
		}
		
		// Add the Season Fox ID to get other versions for that season
		if (product.getProductTypeCode().equalsIgnoreCase(ProductType.SEASON)) {
			foxIds.add(productVersion.getFoxId());			
		}
		
		List<ProductHeader> productHeaders = findProductHeaderByIds(foxIds);
		List<Long> defaultFoxVersionIds = IdsAccumulator.getIds(productHeaders, new IdProvider<ProductHeader>() {

			@Override
			public Long getId(ProductHeader p) {
				return p.getDefaultVersionId();
			}
		});
		Set<Long> defaultVersionsIdsSet = new HashSet<Long>();
		defaultVersionsIdsSet.addAll(defaultFoxVersionIds);
		//don't get the default versions as we already got them in product header
		List<ProductVersionHeader> productVersionHeaders = findAllProductVersionsForProducts(foxIds,defaultFoxVersionIds);
		//contains all the product versions
		List<ProductVersionHeader> allProductVersionHeaders = new ArrayList<>();
		allProductVersionHeaders.addAll(productVersionHeaders);
		//if (!product.getProductTypeCode().equalsIgnoreCase(ProductType.EPISODE) || !product.getProductTypeCode().equalsIgnoreCase(ProductType.SEASON)) {
		  //allProductVersionHeaders.add(productVersion);
		//}
		
		for (ProductHeader productHeader: productHeaders ) {
		  if (productHeader.getErmProductVersionHeader()!=null) {
			ProductVersionHeader versionToAdd = productHeader.getErmProductVersionHeader();
  		    // set show factor if it's the header matches the default version id to expand the tree
			if (versionToAdd.getFoxVersionId().equals(defaultVersionId)) {
			  versionToAdd.setShowFactor(true);
			}
			allProductVersionHeaders.add(versionToAdd);
		  }
		}
		
		//now we have all the product versions, we need to set additional data and set rights indicator
		ProductVersionFinder productVersionFinder = new ProductVersionFinder(em);
		List<Long> allFoxVersionIds = IdsAccumulator.getIds(allProductVersionHeaders, new IdProvider<ProductVersionHeader>() {

			@Override
			public Long getId(ProductVersionHeader p) {
				return p.getFoxVersionId();
			}
		});
		List<ErmProductVersionHeader> ermProductVersionHeaders = productVersionFinder.findProductVersionHeader(allFoxVersionIds);
		
	    // set episode count for seasons and episodes
		if (product.getProductTypeCode().equalsIgnoreCase(ProductType.SEASON) || product.getProductTypeCode().equalsIgnoreCase(ProductType.EPISODE) || product.getProductTypeCode().equalsIgnoreCase(ProductType.SERIES)) {
		  for (ProductVersionHeader productVersionHeader : allProductVersionHeaders ) {
			//logger.info("productVersionHeader.getProductTypeCode(): " + productVersionHeader.getProductTypeCode() + " productVersionHeader.getVersionTypeCode() " + productVersionHeader.getVersionTypeCode());
			if (productVersionHeader.getIsDefaultVersion() || productVersionHeader.getVersionTypeCode().equalsIgnoreCase("DFLT")) {
			  if ((product.getProductTypeCode().equalsIgnoreCase(ProductType.SEASON) || product.getProductTypeCode().equalsIgnoreCase(ProductType.EPISODE))) {
			    productVersionHeader.setEpisodeCount(episodeCount);
			  } else if (product.getProductTypeCode().equalsIgnoreCase(ProductType.SERIES)) {
				  productVersionHeader.setSeasonCount(seasonCount);	  
			  }			  
			}
		  }	      
		}				
		
		RightsIndicatorProcessor rightsIndicatorProcessor = new RightsIndicatorProcessor(em);
		rightsIndicatorProcessor.setHasStrandsForProductVersions(allProductVersionHeaders,ermProductVersionHeaders);
		setIsDefault(defaultVersionsIdsSet,allProductVersionHeaders);
		setAdditionalData(allProductVersionHeaders, ermProductVersionHeaders);
		assembleHierarchy(parentNode, productHeaders, allProductVersionHeaders);
		return parentNode;
		
	}

	private List<ProductVersionHeader> fiterDefaultVersion(List<ProductVersionHeader> list, final Long foxVersionId) {
		List<ProductVersionHeader> filtered = new ArrayList<>();
		Collection<ProductVersionHeader> f = Collections2.filter(list, new Predicate<ProductVersionHeader>() {

			@Override
			public boolean apply(ProductVersionHeader version) {
				return !foxVersionId.equals(version.getFoxVersionId());
			}
			
		});
		filtered.addAll(f);
		return filtered;
	}
	
	/**
	 * 
	 * @param foxVersionId
	 * @return
	 */
	private Map<Long,Long> findDoNotLicenseMap(List<Long> foxVersionIds) {
		Map<Long,Long> map = new HashMap<>();
		if (foxVersionIds==null||foxVersionIds.isEmpty()) return map;
		ErmProductRestrictionSearchCriteria criteria = new ErmProductRestrictionSearchCriteria(em);
		criteria.setDoNotLicenseCriteria(foxVersionIds);
		List<ErmProductRestriction> restrictions = criteria.getResultList();
		for (ErmProductRestriction restriction: restrictions) {
			map.put(restriction.getFoxVersionId(),restriction.getProductRestrictionId());
		}
		return map;
	}
	
	private List<Long> getFoxVersionIdsForProductVersion(List<ProductVersionHeader> productVersions) {
		List<Long> foxVersionIds = IdsAccumulator.getIds(productVersions, new IdProvider<ProductVersionHeader>() {

			@Override
			public Long getId(ProductVersionHeader p) {
				return p.getFoxVersionId();
			}
			
		});
		return foxVersionIds;
	}
	
	private void setCM(List<ProductVersionHeader> productVersions,List<ErmProductVersionHeader> productVersionHeaders) {
		Map<Long,ClearanceMemo> clearanceMemoMap = getClearanceMapForProductVersions(productVersionHeaders);
		for (ProductVersionHeader productVersion: productVersions) {
			Long foxVersionId = productVersion.getFoxVersionId();
			ClearanceMemo clearanceMemo = clearanceMemoMap.get(foxVersionId);
			productVersion.setClearanceMemo(clearanceMemo);
		}
	}
	
	private void setDoNotLicense(List<ProductVersionHeader> productVersionHeaders) {
		List<Long> foxVersionIds = getFoxVersionIdsForProductVersion(productVersionHeaders);
		Map<Long,Long> doNotLicenseMap = findDoNotLicenseMap(foxVersionIds);
		for (ProductVersionHeader productVersionHeader: productVersionHeaders) {
			Long foxVersionId = productVersionHeader.getFoxVersionId();
			Long doNotLicense = 0L;
			Long restrictionId = doNotLicenseMap.get(foxVersionId);
			if (restrictionId!=null) {
				doNotLicense=restrictionId;
			}
			productVersionHeader.setDoNotLicenseID(doNotLicense);
		}
	}
	
	/**
	 * Sets do not license, CM and scripted flag
	 * @param productVersionHeader
	 * @param ermProductVersionHeaders
	 */
	private void setAdditionalData(List<ProductVersionHeader> productVersionHeaders,List<ErmProductVersionHeader> ermProductVersionHeaders) {
		Map<Long,ErmProductVersionHeader> ermProductVersionHeaderMap = Maps.uniqueIndex(ermProductVersionHeaders, new Function<ErmProductVersionHeader,Long>(){

			@Override
			public Long apply(ErmProductVersionHeader p) {
				return p.getFoxVersionId();
			}
			
		});
		for (ProductVersionHeader productVersion: productVersionHeaders) {
			Long foxVersionId = productVersion.getFoxVersionId();
			ErmProductVersionHeader ermProductVersion = ermProductVersionHeaderMap.get(foxVersionId);
			if (ermProductVersion!=null) {
				  productVersion.setScriptedFlag(ermProductVersion.getScriptedFlag() != null ? ermProductVersion.isScripted() : false);
				  productVersion.setFutureMediaInd(ermProductVersion.getFutureMediaInd());

			}
		}
		setDoNotLicense(productVersionHeaders);
		setCM(productVersionHeaders, ermProductVersionHeaders);
		
	}
	
	private ErmNode<ProductVersionHeader> getMovieProductVersion(Product product)  {
		Long foxId = product.getFoxId();
		ProductVersionHeaderSearchCriteria criteria = new ProductVersionHeaderSearchCriteria(em);
		criteria.setFoxProductId(foxId);
		criteria.sortByTitle();
		List<ProductVersionHeader> versions = criteria.getResultList();
		Long defaultFoxVersionId = product.getDefaultVersionId();
		//set the product in the product versions
		ProductVersionHeader defatultVersion = null;
		List<Long> foxVersionIds = new ArrayList<>();
		for (ProductVersionHeader version: versions) {
			foxVersionIds.add(version.getFoxVersionId());
			Long foxVersionId = version.getFoxVersionId();
			if (foxVersionId.equals(defaultFoxVersionId)) {
				defatultVersion = version;
			}
			version.setProduct(product);
		}
		RightsIndicatorProcessor rightsIndicatorProcessor = new RightsIndicatorProcessor(em);
		ProductVersionFinder productVersionFinder = new ProductVersionFinder(em);
		List<ErmProductVersionHeader> ermProductVersionHeaders = productVersionFinder.findProductVersionHeader(foxVersionIds);
		rightsIndicatorProcessor.setHasStrandsForProductVersions(versions,ermProductVersionHeaders);
		setAdditionalData(versions, ermProductVersionHeaders);
		List<ProductVersionHeader> filteredNotDefault = fiterDefaultVersion(versions,defaultFoxVersionId);
		List<ErmNode<ProductVersionHeader>> nodes = getErmMovieNodeList(filteredNotDefault);
		ErmNode<ProductVersionHeader> parentNode = new ErmNode<ProductVersionHeader>();
		parentNode.setData(defatultVersion);
		parentNode.setChildren(nodes);
		return parentNode;
	}
	
//	/**
//	 * Build a tree node structure consisting of a product and all its children for a feature movie.
//	 * @param foxVersionId
//	 * @return
//	 * @throws Exception
//	 */
//	private ErmNode<ProductVersion> getMovieProductVersionOriginal(Product p, ProductVersion pv) throws Exception{
//		SearchCriteria<ProductVersion> searchCriteria = SearchCriteria.get(em, ProductVersion.class);
//		searchCriteria.equal("foxId", p.getFoxId());
//		searchCriteria.addSort("versionTitle");
//		List<ProductVersion> list =  searchCriteria.getResultList();
//		setRightStrands(list);
//		
//		
//		List<ErmNode<ProductVersion>> nodes = getErmMovieNodeList(list);
//		
//		ErmNode<ProductVersion> parentNode = new ErmNode<ProductVersion>();
//		for(ProductVersion pvi : list){
//			ErmProductVersion epv = em.find(ErmProductVersion.class, pvi.getFoxVersionId());
//			if (epv != null) {
//			  pvi.setScriptedFlag(epv.getScriptedFlag() != null ? epv.isScripted() : false);						  
//			  if (epv.hasClearanceMemo()) {
//				ClearanceMemo cm = new ClearanceMemo();
//			    cm.setEntityComment(productService.getRootEntityComment(epv.getFoxVersionId()));		    
//			    pvi.setClearanceMemo(cm);
//			  }
//			}
//			// set do not license 
//			ErmProductRestrictionSearchCriteria ermSearchCriteria = ProductSearchCriterias.getErmProductRestrictionSearchCriteria(em);									
//			
//			ermSearchCriteria.setDoNotLicenseCriteria(pvi.getFoxVersionId());
//			List<ErmProductRestriction> ermProductRestrictions = ermSearchCriteria.getResultList();		
//			long doNotLicenseID = 0;
//			for (ErmProductRestriction ermProductRestriction: ermProductRestrictions) {
//				doNotLicenseID = ermProductRestriction.getProductRestrictionId();
//			}
//			pvi.setDoNotLicenseID(doNotLicenseID);
//			
//			if(ProductType.DEFAULT.equalsIgnoreCase(pvi.getVersionTypeCode())){
//				pvi.setIsDefaultVersion(true);
//				parentNode.setData(pvi);
//			}
//			else {
//				pvi.setIsDefaultVersion(false);
//			}
//		}		
//		parentNode.setChildren(nodes);
//		return parentNode;
//	}
	
	/**
	 * Populates the SCRIPTED FLAG in the product version with the value in the DB
	 * @return
	 */
//	private Map<Long,Boolean> getScriptedMapForProductVersions(List<ErmProductVersionHeader> productVersionHeaders) {					
//		Map<Long,Boolean> scriptedMap = new HashMap<>(productVersionHeaders.size());		
//		for (ErmProductVersionHeader productVersion: productVersionHeaders) {
//		  scriptedMap.put(productVersion.getFoxVersionId(), productVersion.isScripted());
//		}
//		return scriptedMap;		
//	}	
	/**
	 * Populates the CLEARANCE MEMO IND in the product version with the value in the DB
	 * @return
	 */
	private Map<Long,ClearanceMemo> getClearanceMapForProductVersions(List<ErmProductVersionHeader> productVersionHeaders) {		
		return productService.getClearanceMapForProductVersions(productVersionHeaders);
//		Map<Long,ClearanceMemo> clearanceMap = new HashMap<>(productVersionHeaders.size());
//		List<Long> idsWithCM = new ArrayList<>();
//		for (ErmProductVersionHeader productVersion: productVersionHeaders) {		  
//		  if (productVersion.hasClearanceMemo()) {
//			idsWithCM.add(productVersion.getFoxVersionId());
////			ClearanceMemo cm = new ClearanceMemo();
////		    cm.setEntityComment(productService.getRootEntityComment(productVersion.getFoxVersionId()));
////		    clearanceMap.put(productVersion.getFoxVersionId(), cm);
//		  }		  
//		}
		//now find in batch
//		return clearanceMap;		
	}	
	
	
//	/**
//	 * Build a tree node structure consisting of a product and all its children for a television series season.
//	 * @param seasonFoxVersionId
//	 * @return
//	 */
//	private ErmNode<ProductVersion> loadTVSeason(ProductVersion seasonProductVersion){
//		ErmNode<ProductVersion> parentNode = new ErmNode<ProductVersion>();
//		
//		ErmProductVersion epv = em.find(ErmProductVersion.class, seasonProductVersion.getFoxVersionId());		
//		if (epv != null) {
//		  logger.info("loadTVSeason: foxVersionId: " + epv.getFoxVersionId() + " isScriptedFlag: " + epv.isScripted() + " hasClearanceMemo: " + epv.hasClearanceMemo());
//		  seasonProductVersion.setScriptedFlag(epv.isScripted());
//		  if (epv.hasClearanceMemo()) {
//			ClearanceMemo cm = new ClearanceMemo();
//		    cm.setEntityComment(productService.getRootEntityComment(epv.getFoxVersionId()));		    
//		    seasonProductVersion.setClearanceMemo(cm);
//		  }				  
//	    }
//		
//		parentNode.setData(seasonProductVersion);		
//		
//		//We get the children product hierarchies
//		List<ProductHierarchy> childrenHierarchy = getChildrenHierarchy(seasonProductVersion.getFoxVersionId());
//		List<Long> ids = new ArrayList<Long>();
//		for(ProductHierarchy ph : childrenHierarchy){
//			ids.add(ph.getChildFoxVersionId());
//		}
//		if(ids == null || ids.isEmpty()){
//			return parentNode;
//		}
//		//Here we load all the children ProductVersion entities
//		SearchCriteria<ProductVersion> sc = SearchCriteria.get(em, ProductVersion.class);
//		sc.in("foxVersionId", ids);
//		sc.addSort("versionTitle");
//		List<ProductVersion> list = sc.getResultList();
//		setRightStrands(list);
//		for(ProductVersion pvi : list){
//			// set scripted flag
//			epv = em.find(ErmProductVersion.class, pvi.getFoxVersionId());
//			if (epv != null) {
//			  logger.info("loadTVSeason: foxVersionId: " + epv.getFoxVersionId() + " isScriptedFlag: " + epv.isScripted() + " getClearanceMemo: " + epv.hasClearanceMemo());				
//			  pvi.setScriptedFlag(epv.isScripted());			  
//			  if (epv.hasClearanceMemo()) {
//				ClearanceMemo cm = new ClearanceMemo();
//			    cm.setEntityComment(productService.getRootEntityComment(epv.getFoxVersionId()));		    
//			    pvi.setClearanceMemo(cm);
//			  }
//		    }			
//
//			// set do not license 
//			ErmProductRestrictionSearchCriteria ermSearchCriteria = ProductSearchCriterias.getErmProductRestrictionSearchCriteria(em);
//			ermSearchCriteria.setDoNotLicenseCriteria(pvi.getFoxVersionId());
//			List<ErmProductRestriction> ermProductRestrictions = ermSearchCriteria.getResultList();		
//			long doNotLicenseID = 0;
//			for (ErmProductRestriction ermProductRestriction: ermProductRestrictions) {
//				doNotLicenseID = ermProductRestriction.getProductRestrictionId();
//			}
//			pvi.setDoNotLicenseID(doNotLicenseID);
//			if(ProductType.DEFAULT.equalsIgnoreCase(pvi.getVersionTypeCode())){
//				pvi.setIsDefaultVersion(true);			
//			}
//			else {
//				pvi.setIsDefaultVersion(false);
//			}
//		}
//		List<ErmNode<ProductVersion>> nodes = getErmTVNodeList(list);
//				
//		parentNode.setChildren(nodes);
//		
//		return parentNode;
//	}
	
	/**
	 * This method turn a list of ProductVersion class into a list of ErmNode which is used on the front end
	 * to display a tree like menu structure
	 * 
	 * @param list
	 * @return
	 */
//	private List<ErmNode<ProductVersion>> getErmTVNodeList(List<ProductVersion> list){
//		
//		List<ErmNode<ProductVersion>> nodes = new ArrayList<ErmNode<ProductVersion>>();
//		
//		List<Long> foxVersionIds = new ArrayList<Long>();
//		for(ProductVersion p : list){
//		  foxVersionIds.add(p.getFoxVersionId());
//		}		
//		ErmProductVersionHeaderSearchCriteria versionHeaderSearchCriteria = ProductSearchCriterias.getErmProductVersionSearchCriteria(em);
//		versionHeaderSearchCriteria.setIds(foxVersionIds);							
//		List<ErmProductVersionHeader> productVersionHeaders = versionHeaderSearchCriteria.getResultList();
//		Map<Long,Boolean> scriptedMap = getScriptedMapForProductVersions(productVersionHeaders);
//		Map<Long,ClearanceMemo> clearanceMap = getClearanceMapForProductVersions(productVersionHeaders);
//		
//		for(ProductVersion p : list){
//			SearchCriteria<ProductVersion> searchCriteria = SearchCriteria.get(em, ProductVersion.class);
//			searchCriteria.equal("foxId", p.getFoxId());
//			
//			if (scriptedMap != null && scriptedMap.size() > 0)
//		      p.setScriptedFlag(scriptedMap.get(p.getFoxVersionId() ) != null ? scriptedMap.get(p.getFoxVersionId()) : false);
//			if (clearanceMap != null && clearanceMap.size() > 0)
//			  p.setClearanceMemo(clearanceMap.get(p.getFoxVersionId()));
//						
//			logger.info("getErmTVNodeList: foxVersionId: " + p.getFoxVersionId() + " isScriptedFlag: " + p.isScriptedFlag() + " getClearanceMemo: " + (p.getClearanceMemo() != null ? p.getClearanceMemo().getEntityComment() : null));			
//				
//			List<ProductVersion> pchildren = searchCriteria.getResultList();
//			ErmNode<ProductVersion> e = new ErmNode<ProductVersion>();
//			e.setData(p);
//						
//			foxVersionIds.clear();
//			for(ProductVersion pp : pchildren){
//			  foxVersionIds.add(pp.getFoxVersionId());
//			}				
//			versionHeaderSearchCriteria.setIds(foxVersionIds);							
//			productVersionHeaders = versionHeaderSearchCriteria.getResultList();
//			Map<Long,Boolean> scriptedChildrenMap = getScriptedMapForProductVersions(productVersionHeaders);
//			Map<Long,ClearanceMemo> clearanceChildrenMap = getClearanceMapForProductVersions(productVersionHeaders);			
//			List<ErmNode<ProductVersion>> len = new ArrayList<ErmNode<ProductVersion>>();
//			for(ProductVersion pp : pchildren){
//				ErmNode<ProductVersion> ee = new ErmNode<ProductVersion>();
//				if (scriptedChildrenMap != null && scriptedChildrenMap.size() > 0)
//				  pp.setScriptedFlag(scriptedChildrenMap.get(pp.getFoxVersionId() ) != null ? scriptedChildrenMap.get(pp.getFoxVersionId()) : false);
//				if (clearanceChildrenMap != null && clearanceChildrenMap.size() > 0)
//				  pp.setClearanceMemo(clearanceChildrenMap.get(pp.getFoxVersionId()));
//				ee.setData(pp);
//				len.add(ee);
//			}
//			e.setChildren(len);
//			nodes.add(e);
//		}
//		return nodes;
//	}
	
	/**
	 * 
	 * @param list
	 * @return
	 */
	private <T extends ProductVersionBase> List<ErmNode<T>> getErmMovieNodeList(List<T> list){
		if(list == null){
			return new ArrayList<>();
		}
		List<ErmNode<T>> len = new ArrayList<ErmNode<T>>();
		for(T pp : list){
			ErmNode<T> ee = new ErmNode<T>();
			ee.setData(pp);
			len.add(ee);
		}
		return len;
	}

	/**
	 * 
	 * @param versions
	 */
//	private void setRightStrands(List<ProductVersion> versions){
//		if(versions != null && versions.size() > 0){
//			List<Long> ids = new ArrayList<Long>();
//			for(ProductVersion p : versions){
//				ids.add(p.getFoxVersionId());
//			}
//			Map<Long,String> headerMap = new HashMap<>(ids.size());
//			List<ErmProductVersionHeader> productVersionHeaders = findProductVersionHeader(ids);
//			for (ErmProductVersionHeader header: productVersionHeaders) {
//				headerMap.put(header.getFoxVersionId(),header.getRightsIndicator());
//			}
//			
//			for(ProductVersion p : versions){
//				if(headerMap.containsKey(p.getFoxVersionId())){
//					p.setRightsIndicator(headerMap.get(p.getFoxVersionId()));
//				}
//				else {
//					p.setRightsIndicator(RightsIndicator.NoRights.getIndicator());
//				}
//			}
//		}	
//	}
	
	/**
	 * 
	 * @param foxVersionIds
	 * @return
	 */
//	private List<ErmProductVersionHeader> findProductVersionHeader(List<Long> foxVersionIds) {
//		if (foxVersionIds==null||foxVersionIds.size()==0) return new ArrayList<>(0);
//		ErmProductVersionHeaderSearchCriteria searchCriteria = ProductSearchCriterias.getErmProductVersionSearchCriteria(em);
//		searchCriteria.setIds(foxVersionIds);
//		List<ErmProductVersionHeader> productVersionHeaders = searchCriteria.getResultList();
//		return productVersionHeaders;
//
//	}
	
	/**
	 * 
	 */
	@SuppressWarnings("unchecked")
	public ErmNode<Media> loadMediaTree(){
		ErmNode<Media> rootNode = null;
		String rootMediaSql = " select distinct m.parentMediaId from MediaHierarchy m where m.parentMediaId not in (select distinct mm.childMediaId from MediaHierarchy mm) and m.activeFlag = 'Y'";
		Query query = em.createQuery(rootMediaSql);
		List<Long> list = query.getResultList();
		if(list != null && !list.isEmpty()){
			Long rootMediaId = list.get(0);
			//logger.log(Level.INFO,"ROOT MEDIA ID : "+rootMediaId);
			rootNode = loadAllMedia(rootMediaId);
		}
		else {
			logger.log(Level.INFO,"UNABLE TO RETRIEVE ANY ROOT MEDIA ID ");
		}
		return rootNode;
	}
	
	/**
	 * 
	 * @param mediaId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private ErmNode<Media> loadAllMedia(Long mediaId){
		
		ErmNode<Media> ermm = new ErmNode<Media>();
		logger.log(Level.INFO,"ROOT MEDIA ID : "+mediaId);
		String sqlString = " select m from Media m where m.id = "+mediaId;
		
		Query query = em.createQuery(sqlString);
		List<Media> media = query.getResultList();
		
		if(media == null || media.isEmpty() || media.get(0).getActiveFlag().equalsIgnoreCase("N")){
			return null;
		}
		ermm.setData(media.get(0));
		
		//Let's load the children
		String childrenMediaSql = " select distinct m.childMediaId from MediaHierarchy m where m.parentMediaId = "+mediaId+" and m.activeFlag = 'Y'";
		query = em.createQuery(childrenMediaSql);
		List<Long> list = query.getResultList();
		if(list != null && !list.isEmpty()){
			List<ErmNode<Media>> mediaList = new ArrayList<ErmNode<Media>>();
			for(Long m : list){
				try {
					ErmNode<Media> nodeMedia = loadAllMedia(m);
					if(nodeMedia != null){
						mediaList.add(nodeMedia);
					}
				}
				catch(Exception ex){
					
				}
				
			}
			if(!mediaList.isEmpty()){
				ermm.setChildren(mediaList);
			}
		}
		
		return ermm;
	}
	
	
	/**
	 * 
	 */
	@SuppressWarnings("unchecked")
	public ErmNode<Language> loadLanguageTree(){
		
		ErmNode<Language> rootNode = null;
		String rootLanguageSql = " select distinct l.parentLanguageId from LanguageHierarchy l where l.parentLanguageId not in (select distinct mm.childLanguageId from LanguageHierarchy mm) and l.activeFlag = 'Y'";
		Query query = em.createQuery(rootLanguageSql);
		List<Long> list = query.getResultList();
		if(list != null && !list.isEmpty()){
			Long rootTerritoryId = list.get(0);
			//logger.log(Level.INFO,"ROOT MEDIA ID : "+rootMediaId);
			rootNode = loadAllLanguages(rootTerritoryId);
		}
		else {
			logger.log(Level.INFO,"UNABLE TO RETRIEVE ANY ROOT TERRITORY ID ");
		}
		
		return rootNode;
	}
	
	/**
	 * 
	 * @param languageId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private ErmNode<Language> loadAllLanguages(Long languageId){
		
		ErmNode<Language> ermm = new ErmNode<Language>();
		String sqlString = " select l from Language l where l.id = "+languageId;
		Query query = em.createQuery(sqlString);
		List<Language> language = query.getResultList();
		if(language == null || language.isEmpty() || language.get(0).getActiveFlag().equalsIgnoreCase("N")){
			return null;
		}
		ermm.setData(language.get(0));
		
		String childrenLanguageSql = " select distinct l.childLanguageId from LanguageHierarchy l where l.parentLanguageId = "+languageId+" and l.activeFlag = 'Y'";
		query = em.createQuery(childrenLanguageSql);
		List<Long> list = query.getResultList();
		
		if(list != null && !list.isEmpty()){
			List<ErmNode<Language>> languageList = new ArrayList<ErmNode<Language>>();
			for(Long l : list){
				try {
					ErmNode<Language> nodeLanguage = loadAllLanguages(l);
					if(nodeLanguage != null){
						languageList.add(nodeLanguage);
					}
				}
				catch(Exception ex){
					
				}
			}
			if(!languageList.isEmpty()){
				ermm.setChildren(languageList);
			}
		}
		
		return ermm;
	}
	
	/**
	 * 
	 * @param foxVersionId
	 * @return
	 */
	@Override
	public ErmProductVersionHeader findHeaderByFoxVersionId(Long foxVersionId){	
		ErmProductVersionHeaderSearchCriteria criteria = new ErmProductVersionHeaderSearchCriteria(em).setId(foxVersionId);
		List<ErmProductVersionHeader> products = criteria.getResultList();
		if (products==null||products.isEmpty()) return null;
		return products.get(0);
	}
	
	/**
	 * This method returns a product version or creates a new one if one does not exist
	 * @param foxVersionId
	 * @return
	 */
	@Override
	public ErmProductVersion findOrCreateNewProductVersion(Long foxVersionId, String userName){
		ErmProductVersion ermProductVersionHeader = em.find(ErmProductVersion.class, foxVersionId);
		if (ermProductVersionHeader == null)
			ermProductVersionHeader = createNewErmProductVersion(foxVersionId, userName);		
		return ermProductVersionHeader;
	}	
	

	
	/**
	 * Create a new ErmProductVersionHeader and return it. Care must be taken to insure that
	 * an ErmProductVersion with the same foxVersionId does not already exists.
	 * @param foxVersionId
	 * @param userName
	 * @return
	 */
	@TransactionAttribute(value=TransactionAttributeType.MANDATORY)
	public ErmProductVersion createNewErmProductVersion(Long foxVersionId, String userName){
		
		ErmProductVersion e = new ErmProductVersion();
		Date d = Calendar.getInstance().getTime();
		e.setCreateDate(d);
		e.setUpdateDate(d);
		e.setFoxVersionId(foxVersionId);
		e.setLegalConfirmationStatusId(null);
		e.setBusinessConfirmationStatusId(RightsConsumptionStatus.PUBLIC.getId());
		if(!Strings.isNullOrEmpty(userName)){
			e.setUpdateName(userName);
			e.setCreateName(userName);
		}		
		
		em.persist(e);
		
		return e;
	}

	@Override
	public ErmRightStrandSet copyStrandSet(Long strandSetId, Long foxVersionId,
			String userName) {
		return strandSetService.copyToProduct(strandSetId, foxVersionId, userName);
	}
	
}
