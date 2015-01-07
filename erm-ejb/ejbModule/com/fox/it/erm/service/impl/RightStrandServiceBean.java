package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.ErmRightStrand;
import com.fox.it.erm.ErmRightStrandSet;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.RightStrand;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.service.BitmapUpdater;
import com.fox.it.erm.service.EntityCommentTypeHolder;
import com.fox.it.erm.service.RightStrandSaveService;
import com.fox.it.erm.service.RightStrandService;
import com.fox.it.erm.util.CopyObject;
import com.fox.it.erm.util.CopyStrandsResponse;
import com.fox.it.erm.util.ExceptionUtil;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
import com.fox.it.erm.util.RightStrandCreateObject;
import com.fox.it.erm.util.RightStrandUpdateObject;
import com.fox.it.erm.util.StrandsUtil;
import com.fox.it.erm.util.UpdatableProcessor;

@Stateless
public class RightStrandServiceBean extends RightStrandServiceBase implements RightStrandService {
	
	private static final Logger logger = Logger.getLogger(RightStrandServiceBean.class.getName());
	
	@Inject EntityManager entityManager;
	
	@Inject
	private BitmapUpdater bitmapUpdater;
	

	@Inject
	@EJB
	private RightStrandSaveService rightStrandSaveService;
	
	private JsonToCreateObjectConverter jsonConverter = new JsonToCreateObjectConverter(new JacksonJsonService());
	
	private JsonToRightStrandUpdateObjectConverter jsonUpdateConverter = new JsonToRightStrandUpdateObjectConverter(new JacksonJsonService());
	
	private JsonToCopyObjectConverter jsonCopyConverter = new JsonToCopyObjectConverter(new JacksonJsonService());
	
	private JsonToDeleteRightsRestrictionStrandCreateObject jsonDeleteConverter = new JsonToDeleteRightsRestrictionStrandCreateObject(new JacksonJsonService());
		
	
	
	private RightStrandDeleteValidator deleteValidator = new RightStrandDeleteValidator();
	
	private Logger getLogger() {
		return logger;
	}
	
	
	/**
	 * 
	 */
	@Override
	public RightStrandCreateObject convertToRightStrandCreateObject(String json){
		
		return jsonConverter.convert(json);
	}
	
	
	/**
	 * 
	 */
	@Override
	public ErmRightStrandSet createSet(Long foxVersionId,String name,String description,String userId) {
		ErmRightStrandSet strandSet = new ErmRightStrandSet();
		Date d = new Date();
		strandSet.setCreateDate(d);
		strandSet.setCreateName(userId);
		strandSet.setUpdateDate(d);
		strandSet.setUpdateName(userId);
		strandSet.setStrandSetName(name);
		strandSet.setStrandSetDescription(description);
		strandSet.setFoxVersionId(foxVersionId);
		entityManager.persist(strandSet);
		return strandSet;
	}
	
	
	
	/**
	 * 
	 */
	@Override
	public List<ErmRightStrandSet> findSets(Long foxVersionId) {
		SearchCriteria<ErmRightStrandSet> sc = SearchCriteria.get(entityManager, ErmRightStrandSet.class);
		sc.equal("foxVersionId", foxVersionId);
		List<ErmRightStrandSet> strandSet = sc.getResultList();
		return strandSet;
	}
	
	
	private ErmException getErmException(Exception e) {
		return new ErmException(e.getMessage());
	}
	
	public List<Long> saveCreateObject(RightStrandCreateObject r,String userId, boolean isBusiness) throws ErmException{
		try {
			setUserInDBContext(userId, isBusiness);
			List<Long> ids = rightStrandSaveService.saveCreateObject(r, userId, isBusiness);
			return ids;
		} catch(ErmValidationException e) {
			throw e;
		} catch (Exception e ){
			getLogger().log(Level.SEVERE,"Error saving object",e);
			throw getErmException(e);
		}

	}
	/**
	 * 
	 */
	@Override
	public List<ErmProductRightStrand> findAllRightStrands(Long foxVersionId) {
		boolean loadHasComments = true;
		List<ErmProductRightStrand> strands =  loadRightStrands(foxVersionId);
		if (loadHasComments) {
			setHasComments(strands);
		}
		return strands;
	}
	
	@Override
	public List<ErmRightStrand> findAllRightStrandsForGrid(Long foxVersionId,boolean isBusiness) {	
		boolean loadHasComments = true;	
		long t0 = System.currentTimeMillis();
		getLogger().info("Getting right strands for " + foxVersionId);
		RightStrandSQLFinder rightStrandFinder = getFinder();
		List<ErmRightStrand> strands = rightStrandFinder.findRightStrandsForGrid(foxVersionId,isBusiness);
		long t1 = System.currentTimeMillis();
		if (loadHasComments) {
			setHasCommentsForGrid(strands,isBusiness);
		}
		
		
//		if(strands != null && !strands.isEmpty()){
//			Collections.sort(strands);
//		}
		getLogger().info("Done getting " + strands.size() + " right strands for " + foxVersionId  + " in " + (t1 - t0));		
		return strands;				
		
	}
	
	private void filterStrandInfoCodes(List<ErmProductRightStrand> strands,boolean isBusiness) {
		for (ErmProductRightStrand strand: strands) {
			List<ErmProductRightRestriction> restrictions = strand.getErmProductRightRestrictions(); 
			if (restrictions!=null) {
				@SuppressWarnings("unchecked")
				List<ErmProductRightRestriction> filtered = (List<ErmProductRightRestriction>) UpdatableProcessor.filter(restrictions,isBusiness);
				strand.setErmProductRightRestrictions(filtered);
			}
		}
	}

	
	@Override
	public List<ErmProductRightStrand> findAllRightStrands(Long foxVersionId, boolean isBusiness) {
		List<ErmProductRightStrand> allStrands = findAllRightStrands(foxVersionId);
		@SuppressWarnings("unchecked")
		List<ErmProductRightStrand> filtered = (List<ErmProductRightStrand>) UpdatableProcessor.filter(allStrands,isBusiness);
		filterStrandInfoCodes(filtered, isBusiness);
		return filtered;
	}
	
	
	
	
	
	/**
	 * 
	 * @param strands
	 * @param isBusiness. We pass isBusiness to filter private comments
	 */
	private void setHasCommentsForGrid(List<ErmRightStrand> strands,boolean isBusiness) {
		List<Long> ids = IdsAccumulator.getIds(strands, new IdProvider<ErmRightStrand>() {
			@Override
			public Long getId(ErmRightStrand o) {
				return o.getRightStrandId();
			}			
		});
		@SuppressWarnings("unchecked")
		Map<Long,ErmRightStrand> strandsMap = (Map<Long,ErmRightStrand>)StrandsUtil.toStrandsMap(strands);
		RightStrandSQLFinder finder = getFinder();
		List<EntityComment> entityComments = finder.findStrandsEntityComments(ids);
		List<Long> commentIdsMappedToStrands = finder.getCommentIdsWithEntityCommentType(com.fox.it.erm.enums.EntityCommentType.RIGHT_STRAND_COMMENT.getId(), entityComments);
		Set<Long> commentIdsToBeRemoved = finder.findNonVisibleComments(commentIdsMappedToStrands, isBusiness);
		entityComments = finder.removeCommentsIds(entityComments, commentIdsToBeRemoved);
		Map<Long,EntityCommentTypeHolder> commentTypesMap = finder.getEntityCommentTypeMapById(entityComments);		
		
		
		for (ErmRightStrand strand: strandsMap.values()) {
			Long strandId = strand.getRightStrandId();
			if (commentTypesMap.containsKey(strandId)) {
				EntityCommentTypeHolder commentTypesHolder = commentTypesMap.get(strandId);
				if (commentTypesHolder.contains(com.fox.it.erm.enums.EntityCommentType.CLEARANCE_MEMO_MAP.getId())) {
					strand.setMappedToClearanceMemo(true);
				}
				if (commentTypesHolder.contains(com.fox.it.erm.enums.EntityCommentType.RIGHT_STRAND_COMMENT.getId())) {
					strand.setHasComments(true);
				}
				
			}
		}
		
	}
	
	
	private void setHasComments(List<ErmProductRightStrand> strands) {
		List<Long> ids = StrandsUtil.getStrandIds(strands);
		if (ids==null||ids.isEmpty()) return;
		@SuppressWarnings("unchecked")
		Map<Long,ErmProductRightStrand> strandsMap = (Map<Long,ErmProductRightStrand>)StrandsUtil.toStrandsMap(strands);
		RightStrandSQLFinder finder = getFinder();
		Map<Long,EntityCommentTypeHolder> commentTypesMap = finder.findRightStrandCommentTypes(ids);
		for (ErmProductRightStrand strand: strandsMap.values()) {
			Long strandId = strand.getRightStrandId();
			if (commentTypesMap.containsKey(strandId)) {
				EntityCommentTypeHolder commentTypesHolder = commentTypesMap.get(strandId);
				if (commentTypesHolder.contains(com.fox.it.erm.enums.EntityCommentType.CLEARANCE_MEMO_MAP.getId())) {
					strand.setMappedToClearanceMemo(true);
				}
				if (commentTypesHolder.contains(com.fox.it.erm.enums.EntityCommentType.RIGHT_STRAND_COMMENT.getId())) {
					strand.setHasComments(true);
				}
				
			}
		}
		
		
	}
	
		
	@Override
	public ErmProductRightStrand findById(Long id) {
		List<Long> ids = new ArrayList<Long>();
		ids.add(id);
		List<ErmProductRightStrand> strands = findByIds(ids);
		if (strands==null||strands.size()==0) return null;
		return strands.get(0);
	}
	
	@Override
	public void deleteRightStrand(String userId, boolean isBusiness, String q) throws ErmException {
		JsonToDeleteRightsRestrictionStrandCreateObject converter = jsonDeleteConverter;		 
		logger.info("delete right strand called for:  " + q + " and userId: " + userId);
		deleteRightStrand(userId, isBusiness, converter.convert(q).getRightStrandIds());
	}

	@Override
	public void deleteRightStrand(String userId, boolean isBusiness, List<Long> rightStrandIds) throws ErmException {
		logger.info("delete right strand called for:  " + rightStrandIds + " and userId: " + userId);
		Long foxVersionId = null;
		for (Long rightStrandId : rightStrandIds) {
			RightStrand strand = entityManager.find(RightStrand.class, rightStrandId);
			foxVersionId = strand.getFoxVersionId();
			deleteValidator.validate(strand, isBusiness);
//			Query query = entityManager.createNativeQuery("call " + DELETE_RIGHTSTRAND_PROCEDURE_NAME);
//			query.setParameter(1, rightStrandId);						
//			query.setParameter(2, isBusiness ? 'B' : 'L');
//			query.setParameter(3, userId.toUpperCase());
//			query.setParameter(4, 'Y');			
//			long t0 = System.currentTimeMillis();			
//			query.executeUpdate();
//			long t1 = System.currentTimeMillis();
//			logger.info("Done deleting right strand in " + (t1-t0) + " ms");
		}
		rightStrandSaveService.deleteRightStrand(userId, isBusiness, foxVersionId,rightStrandIds);		
	}	
	
	@Override
	public void setBitmapUpdater(String userId, Long foxVersionId) {
		bitmapUpdater.setSummaryBitmap(foxVersionId, userId);
	}	
	
	
	/**
	 * 
	 * @param json
	 * @return
	 */
	public RightStrandUpdateObject convertToRightStrandUpdateObject(String json){
		
		return this.jsonUpdateConverter.convert(json);
	}
	
	/**
	 * 
	 * @param r
	 * @param userId
	 * @param isBusiness
	 * @return
	 * @throws ErmValidationException 
	 */
	public List<Long> updateRightStrand(RightStrandUpdateObject r, String userId, boolean isBusiness) throws ErmException{
		List<Long> ermList = new ArrayList<>();
		ermList = rightStrandSaveService.update(r, userId, isBusiness);
		return ermList;
	}
	
	/**
	 * 
	 * @param r
	 * @param userId
	 * @param isBusiness
	 * @return
	 * @throws ErmException
	 */
	public Map<String, List<? extends Object>> adoptRightStrandAndRestrictions(RightStrandUpdateObject r, String userId, boolean isBusiness) throws ErmException{
		Map<String, List<? extends Object>> ermList = new HashMap<String, List<? extends Object>>();
		ermList = rightStrandSaveService.adoptStrandsAndRestrictions(r, userId, isBusiness);
		return ermList;
	}
	
	/**
	 * 
	 * @param json
	 * @param userId
	 * @param isBusiness
	 * @return
	 */
	public List<Long> updateRightStrand(String json, String userId, boolean isBusiness) throws ErmException{
		RightStrandUpdateObject ruo = convertToRightStrandUpdateObject(json);
		ruo.setDates();
		return updateRightStrand(ruo, userId, isBusiness);				
	}
	
	/**
	 * 
	 * @param json
	 * @param userId
	 * @param isBusiness
	 * @return
	 * @throws ErmException
	 */
	public Map<String, List<? extends Object>> adoptRightStrandAndRestrictions(String json, String userId, boolean isBusiness) throws ErmException{
		RightStrandUpdateObject ruo = this.convertToRightStrandUpdateObject(json);
		return adoptRightStrandAndRestrictions(ruo, userId, isBusiness);
	}

	@Override
	public void deleteRightRestriction(String userId, boolean isBusiness,String q) throws ErmException {
		rightStrandSaveService.deleteRightRestriction(userId, isBusiness, q);		
	}

	@Override
	public void deleteRightRestriction(String userId, boolean isBusiness,List<Long> restrictionId, Long foxVersionId) throws ErmException {		
		rightStrandSaveService.deleteRightRestriction(userId, isBusiness, restrictionId, foxVersionId);		
	}
	
	/**
	 * 
	 * @param json
	 * @param userId
	 * @param isBusiness
	 * @return
	 * @throws ErmException
	 */
	public CopyStrandsResponse copyRightStrands(String json, String userId, boolean isBusiness) throws ErmException{
		RightStrandUpdateObject update = this.convertToRightStrandUpdateObject(json);
		update.setDates();
		Long foxVersionId =  update.getFromProductVersionId();
		List<Long> toFoxVersionIds = update.getTargetProductVersionIds();
		boolean toSameProduct = false;		
		CopyStrandsResponse response = new CopyStrandsResponse();
		if ((toFoxVersionIds==null||toFoxVersionIds.size()==0)||
			(toFoxVersionIds!=null && toFoxVersionIds.size()==1)) {
			Long id = toFoxVersionIds.get(0);
			if (foxVersionId.equals(id)) {
				toSameProduct = true;
			}
		}
		try {
			if (toSameProduct) {
				List<Long> strandIds = rightStrandSaveService.copyStrands(foxVersionId, update, userId, isBusiness);			
				if (update.hasComment()) {					
				  Long commentId = update.getCommentId();
//				  String comment = update.getComment();
//				  String subject = update.getCommentTitle();
//				  rightStrandSaveService.createLinkedCommentForStrands(strandIds, subject,comment, userId, isBusiness);
				  rightStrandSaveService.linkCommentToStrands(commentId, strandIds, userId);	
				}				
				response.setStrandIds(strandIds);
			} else {
				CopyToProductsResponse multiProductResponse = rightStrandSaveService.copyStrands(foxVersionId, toFoxVersionIds,update, userId, isBusiness);
				response.setMultiProductResponse(multiProductResponse);			
			}
			return response;
		} catch (Exception e) {
			getLogger().log(Level.SEVERE,"Exception copying strands "  ,e);
			ExceptionUtil exceptionUtil = new ExceptionUtil();
			ErmException ermException = exceptionUtil.getErmException(e);
			throw ermException;
		}
	}
	
	
	public CopyToProductsResponse copyProductInfoCodes(String json,String userId, boolean isBusiness) throws ErmException{
		CopyObject copyObject = jsonCopyConverter.convert(json);
		return copyProductInfoCodes(copyObject.getFromProductVersionId(), copyObject.getTargetProductVersionIds(), copyObject.getIds(), userId, isBusiness);
	}
	
	@Override
	public CopyToProductsResponse copyProductInfoCodes(Long foxVersionId,List<Long> toFoxVersionIds, List<Long> infoCodeIds,String userId, boolean isBusiness) throws ErmException {
		return rightStrandSaveService.copyProductInfoCodes(foxVersionId, toFoxVersionIds, infoCodeIds, userId, isBusiness);
	}
}
