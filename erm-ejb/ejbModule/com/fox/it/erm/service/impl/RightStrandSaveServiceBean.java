package com.fox.it.erm.service.impl;

import java.util.ArrayList;
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
import javax.validation.constraints.NotNull;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.ErmRightRestriction;
import com.fox.it.erm.ErmRightStrandSet;
import com.fox.it.erm.ErmValidation;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.RightStrandSave;
import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.service.CopyService;
import com.fox.it.erm.service.ErmProductRestrictionService;
import com.fox.it.erm.service.ErmProductVersionService;
import com.fox.it.erm.service.ErmStrandValidator;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.ProductService;
import com.fox.it.erm.service.RightStrandSaveHandler;
import com.fox.it.erm.service.RightStrandSaveService;
import com.fox.it.erm.service.RightStrandSetService;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.util.CommentCleanner;
import com.fox.it.erm.util.DateUtil;
import com.fox.it.erm.util.DeleteRightsRestrictionStrandCreateObject;
import com.fox.it.erm.util.ExceptionUtil;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
import com.fox.it.erm.util.IdsUtil;
import com.fox.it.erm.util.JPA;
import com.fox.it.erm.util.RestrictionObject;
import com.fox.it.erm.util.RightStrandCreateObject;
import com.fox.it.erm.util.RightStrandUpdateObject;
import com.fox.it.erm.util.StrandsUtil;
import com.fox.it.erm.util.UpdatableProcessor;
import com.google.common.collect.Lists;

@Stateless
public class RightStrandSaveServiceBean extends RightStrandServiceBase implements RightStrandSaveService {

	private static final Logger logger = Logger.getLogger(RightStrandSaveServiceBean.class.getName());
	
	@Inject
	private EntityManager em;
		
	@Inject
	@EJB
	private RightStrandSetService rightStrandSetService;
	
	@EJB
	@Inject
	private ErmProductVersionService ermProductVersionService;
		
	@Inject
	private ErmStrandValidator strandValidator;
	
	@Inject
	@EJB
	private ProductService productService;
	
	
	@Inject
	private RightStrandUpdateValidator updateValidator;
	
	@Inject
	private RightStrandAdoptValidator adoptValidator;
	
	@Inject
	private RightStrandSaveHandler saveHandler; 
	
	@Inject
	@EJB
	private ErmProductRestrictionService productRestrictionService;
	
	@Inject
	@EJB
	private CopyService copyService;
	
	@Inject
	private JsonService jsonService;
	
	@Inject
	private CommentsService commentsService;
	
	private JsonToCreateObjectConverter jsonConverter = new JsonToCreateObjectConverter(new JacksonJsonService());	
	
	@Inject
	private JsonToRightStrandUpdateObjectConverter jsonUpdateConverter;
	

	private Logger getLogger() {
		return logger;
	}
	
	private ErmValidationException getValidationException(ErmValidation validation) {
		return new ErmValidationException(validation.getMessage());
	}
	
	
	private RightStrandObjectToRightStrandConverter getRightStrandCreateObjectConverter() {
		return new RightStrandObjectToRightStrandConverter(em,rightStrandSetService);
	}
	
	private void setUserIdAndTypeIndicator(List<ErmProductRightStrand> strands,String userId, boolean isBusiness, Date timestamp) {
		UpdatableProcessor.setUserIdAndTypeIndicator(strands, userId, isBusiness, timestamp);
		for (ErmProductRightStrand strand: strands) {
			List<ErmProductRightRestriction> rightRestrictions = strand.getErmProductRightRestrictions();
			UpdatableProcessor.setUserIdAndTypeIndicator(rightRestrictions, userId, isBusiness, timestamp);	
		}
	}
	
	private CommentLinkingProcessor getCommentLinkingProcessor() {
		return new CommentLinkingProcessor(commentsService);
	}
	
	@Override
	public void linkCommentToStrands(Long commentId, List<Long> ids,String userId) {
		getCommentLinkingProcessor().linkCommentToStrands(commentId, ids, userId);		
	}

	private void linkCommentToStrands(Comment comment,List<Long> ids,String userId) {
		getCommentLinkingProcessor().linkCommentToStrands(comment, ids, userId);
	}
	
	
	private List<Long> linkCommentToStrandInfoCodes(Long commentId,List<Long> ids,String userId) {
		getCommentLinkingProcessor().linkCommentToStrandInfoCodes(commentId, ids, userId);
		return ids;
	}
	
	
	@Override
	public void createLinkedCommentForStrands(List<Long> ids,String subject,String text,String userId,boolean isBusiness) {
		if (text==null||text.trim().isEmpty()) return;
		Comment comment = CommentCleanner.getComment(subject,text,userId,isBusiness);
		comment = commentsService.saveComment(comment, userId, isBusiness);		
		linkCommentToStrands(comment, ids, userId);
	}

	@Override
	public void createCommentForStrands(List<Long> ids,String subject,String text,String userId,boolean isBusiness) throws ErmException {
		if (text==null||text.trim().isEmpty()) return;
		Comment comment = CommentCleanner.getComment(subject,text,userId,isBusiness);
		commentsService.saveComment(comment, userId, isBusiness);
		for (Long id: ids) {
			commentsService.addCommentToRightStrand(id, comment, userId, isBusiness);			
		}
		
	}
	
	
	private List<Long> getIds(List<RightStrandSave> save) {
		List<Long> ids = IdsAccumulator.getIds(save, new IdProvider<RightStrandSave>() {

			@Override
			public Long getId(RightStrandSave o) {
				return o.getRightStrandId();
			}
		});
		return ids;
	}

	private List<RightStrandSave> save(Long foxVersionId,boolean isBusiness,@NotNull String userId,@NotNull List<ErmProductRightStrand> strands,boolean setContext) throws ErmException{
		if (strands.size()==0) {
			getLogger().info("Save strands received and empty list. No action will be performed");
			return new ArrayList<>();
		}
		try {
			if (setContext) {
				userId = userId.toUpperCase();
				setUserInDBContext(userId, isBusiness);
				em.flush();
			}
			List<RightStrandSave> saved = saveHandler.create(strands);
			return saved;
//			List<Long> savedStrandIds = getIds(saved); 
//			return savedStrandIds;
		} catch (Exception e) {
			ExceptionUtil exceptionUtil = new ExceptionUtil();
			ErmException ermException = exceptionUtil.getErmException(e);
			throw ermException;
		}
	}

	
	@Override
	public List<RightStrandSave> save(Long foxVersionId,boolean isBusiness,@NotNull String userId,@NotNull List<ErmProductRightStrand> strands) throws ErmException{
		return save(foxVersionId,isBusiness,userId,strands,true);
	}
	
	
	@Override
	public List<Long> saveStrandRestrictions(List<ErmProductRightRestriction> rightRestrictions,List<RestrictionObject> restrictions,String userId, boolean isBusiness) {
		if (rightRestrictions.size()==0) {
			getLogger().info("saveStrandRestrictions received and empty list. No action will be performed");
			return new ArrayList<>();
		}
		userId = userId.toUpperCase();
		setUserInDBContext(userId, isBusiness);
		em.flush();
		List<Long> ids = saveHandler.updateStarndRestritctions(rightRestrictions,restrictions, userId, isBusiness);
		return ids;
	}
	
	private List<ErmRightRestriction> findStrandRestrictionsByIds(List<Long> ids) {
		RightStrandSQLFinder finder = new RightStrandSQLFinder(em);
		List<ErmRightRestriction> restrictions = finder.findRestrictionsOnlyById(ids);
		return restrictions;
	}
	

	private List<ErmProductRightRestriction> convertToRightRestriction(List<ErmRightRestriction> restrictions) {
		List<ErmProductRightRestriction> ermProductRightRestrictions = new ArrayList<>();
		for (ErmRightRestriction r: restrictions) {
			ErmProductRightRestriction restriction = new ErmProductRightRestriction();
			restriction.copyFrom(r);
			restriction.setRightStrandId(r.getRightStrandId());
			ermProductRightRestrictions.add(restriction);
		}
		return ermProductRightRestrictions;
	}
	
	public List<Long> updateStrandRestrictions(List<RestrictionObject> restrictionsFromUpdate,String userId, boolean isBusiness) {
		List<Long> restrictionIds = IdsAccumulator.getIds(restrictionsFromUpdate, new IdProvider<RestrictionObject>() {
			@Override
			public Long getId(RestrictionObject o) {
				return o.getRestrictionId();
			}			
		});
		List<ErmProductRightRestriction> ermProductRightRestrictions = convertToRightRestriction(findStrandRestrictionsByIds(restrictionIds));
		return saveStrandRestrictions(ermProductRightRestrictions, restrictionsFromUpdate,userId, isBusiness);		
	}
	
	/**
	 * Updates a list of strand restriction without updating their parent strand
	 * @param editObject The json representing the edit
	 * @return The ids of the restrictions updated
	 */	
	@Override
	public List<Long> saveStrandRestrictions(String updateObject,String userId, boolean isBusiness) {
		//We're using the same strand update object for updating restrictions than updating strands. All the strands fields are empty
		RightStrandUpdateObject update = jsonUpdateConverter.convert(updateObject);
		update.setDates();
		List<RestrictionObject> restrictions = update.getRestrictionsToAdd();
		List<Long> idsFromUpdate = IdsAccumulator.getIds(restrictions, new IdProvider<RestrictionObject>() {

			@Override
			public Long getId(RestrictionObject o) {
				return o.getRestrictionId();
			}
		});	
		List<Long> ids = updateStrandRestrictions(restrictions,userId,isBusiness);
		//the comment is in the restrictions to add
		
		if (update.hasCommentInRestrictions()) {
			Long commentId = update.getCommentIdFromRestrictions();
			List<Long> linkedIds = linkCommentToStrandInfoCodes(commentId, idsFromUpdate, userId);
			Set<Long> uniqueIds = new HashSet<>();
			uniqueIds.addAll(linkedIds);
			uniqueIds.addAll(ids);
			ids = Lists.newArrayList(uniqueIds);
		}
		return ids;
	}
	

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
		em.persist(strandSet);
		return strandSet;
	}
	
	
	
	/**
	 * Returns a map from a comment timestamp id to a list of strand restriction ids.
	 * 
	 * @return
	 */
	private Map<Long,List<Long>> getCommentTimestampIdToRightRestrictionIds(List<RightStrandSave> strands) {
		StrandRestrictionCommentProvider commentProvider = new StrandRestrictionCommentProvider();
		return commentProvider.getCommentTimestampIdToRightRestrictionIds(strands);
	}
	
	private void createLinkedCommentsForRightRestrictions(Map<Long,List<Long>> commentToRestrictionIds,String userId, boolean isBusiness) {
		getCommentLinkingProcessor().createLinkedCommentsForRightRestrictions(commentToRestrictionIds, userId, isBusiness);
	}
	
	
	
	@Override
	public List<Long> saveCreateObject(RightStrandCreateObject r,String userId, boolean isBusiness) throws ErmException{
		Date timestamp = new Date();
		long t0 = System.currentTimeMillis();
		try {			
				//Here we validate the integrity of the RightStrandCreateObject, before attempting to save the object
				//Here we build the right strands
				Long foxVersionId = r.getFoxVersionId();			
				RightStrandObjectToRightStrandConverter converter = getRightStrandCreateObjectConverter();
				List<ErmProductRightStrand> strands = converter.buildRightStrand(r,userId);
				boolean isFoxipediaSearch = r.isFoxipediaSearch();
				//TODO set context here
				setUserInDBAndFoxipediaContext(userId, isBusiness, isFoxipediaSearch);
				Date releaseDate = productService.getReleaseDate(foxVersionId,userId,isFoxipediaSearch);
				ReleaseDateProcessor.setReleaseDateForCreate(releaseDate,strands,isBusiness);
				setUserIdAndTypeIndicator(strands, userId, isBusiness,timestamp);
				ErmValidation isUpdatableValidation = strandValidator.isUpdatable(isBusiness, strands);
				if (!isUpdatableValidation.isValid()) {
					throw getValidationException(isUpdatableValidation);
				}				

				ermProductVersionService.findOrCreateNewProductVersion(foxVersionId, userId);
				boolean setContext = false;
				List<RightStrandSave> saved = save(foxVersionId,isBusiness, userId, strands,setContext);
				List<Long> ids = getIds(saved);
				if (r.hasComment()) {	
//					String title = r.getCommentTitle();
//					String comment = r.getComment();
//					createLinkedCommentForStrands(ids, title,comment, userId, isBusiness);
					Long commentId = r.getCommentId();
					linkCommentToStrands(commentId, ids, userId);
				}
				//now save comments for strand info codes
				Map<Long,List<Long>> commentToRestrictionIds = getCommentTimestampIdToRightRestrictionIds(saved);
				createLinkedCommentsForRightRestrictions(commentToRestrictionIds,userId,isBusiness);
				long t1 = System.currentTimeMillis();
				getLogger().info("Created " + saved.size() + " strands in " + (t1 - t0) + "ms for user " + userId);
				return ids;
		}
		catch(ErmValidationException e){
			getLogger().log(Level.SEVERE,"Error saving strands for userId" + userId + " isBusiness:" + isBusiness,e.getMessage());
			throw e;
		}
	}
	
	/**
	 * Creates a new strand set for the product version if is needed (check if the id of the strand set is null and name is not null)
	 * @param update
	 * @param foxVersionId
	 * @param userId
	 */
	private Long checkOrCreateStrandSet(RightStrandUpdateObject update,Long foxVersionId,String userId) {
		String strandSetName = update.getStrandSetName();
		if (!RightStrandUpdateProcessor.isValue(update.getStrandSetId())&&strandSetName!=null&&strandSetName.trim().length()>0){
			//create the strand set first
			String description = null;
			ErmRightStrandSet strandSet = rightStrandSetService.createSet(foxVersionId, strandSetName, description,userId);
			Long strandSetId = strandSet.getRightStrandSetId();
			update.setStrandSetId(strandSetId);
			return strandSetId;
		}
		return update.getStrandSetId();
	}


	private List<ErmProductRightStrand> findStrandsInBatch(List<Long> ids) {
		RightStrandSearchCriteria criteria = new RightStrandSearchCriteria(em);
		List<ErmProductRightStrand> strands = criteria.setIds(ids).getResultList();
		return strands;
	}
	
	private List<ErmProductRightStrand> findStrandsByIds(List<Long> ids) {
		if (ids==null||ids.isEmpty()) {
			return new ArrayList<ErmProductRightStrand>();
		}
		if (ids.size()<=JPA.IN_LIMIT) {
			return findStrandsInBatch(ids);
		}
		List<ErmProductRightStrand> all = new ArrayList<>();
		List<List<Long>> lists = Lists.partition(ids, JPA.IN_LIMIT);
		for (List<Long> l: lists) {
			List<ErmProductRightStrand> strands = findStrandsInBatch(l);
			all.addAll(strands);
		}
		return all;
		
		
	}
	
	@Override
	public List<Long> update(RightStrandUpdateObject rightStrandUpdate, String userId, boolean isBusiness) throws ErmException {
		long t0 = System.currentTimeMillis();
		//AMV
		//set foxipedia context 
//		setUserInDBContext(userId, isBusiness);
		boolean isFoxipediaSearch = rightStrandUpdate.isFoxipediaSearch();
		setUserInDBAndFoxipediaContext(userId, isBusiness, isFoxipediaSearch);
		//first get the ids and fetch all at once
		List<Long> ids = rightStrandUpdate.getIds();
		List<ErmProductRightStrand> strands = findStrandsByIds(ids);
		Long foxVersionId = null;
		for (ErmProductRightStrand strand: strands) {
			foxVersionId = strand.getFoxVersionId();
			updateValidator.validate(strand, isBusiness);
		}
		checkOrCreateStrandSet(rightStrandUpdate, foxVersionId, userId);
		//make a copy of the strands, then update them with the new values.
		//after the values are updated
		//convert to save objects and persist to db
	
		//copy the strands to save objects

		try {
			List<RightStrandSave> saved =  saveHandler.update(strands,rightStrandUpdate,userId,isBusiness);
			List<Long> savedIds = getIds(saved);
			if (rightStrandUpdate.hasComment()) {
				Long commentId = rightStrandUpdate.getCommentId();
				linkCommentToStrands(commentId, savedIds, userId);
			}
 
			
			//now save comments for strand info codes
			Map<Long,List<Long>> commentToRestrictionIds = getCommentTimestampIdToRightRestrictionIds(saved);
			createLinkedCommentsForRightRestrictions(commentToRestrictionIds,userId,isBusiness);
			long t1 = System.currentTimeMillis();
			getLogger().info("Updated " + saved.size() + " strands in " + (t1 - t0) + "ms for user " + userId);			
			return savedIds;
		}catch (Exception e) {
			ExceptionUtil exceptionUtil = new ExceptionUtil();
			ErmException ermException = exceptionUtil.getErmException(e);
			throw ermException;
		}		

	}
	
 
	
	private Date getDifferentReleaseDate(List<ErmProductRightStrand> strands,Date date) {
		for (ErmProductRightStrand strand: strands) {
			Date releaseDate = strand.getReleaseDate();
			if (releaseDate != null && !DateUtil.isSameDate(releaseDate, date)) {
				return releaseDate;
			}
		}
		return null;
	}
	
	private List<ErmProductRightStrand> getInclusionsOnly(List<ErmProductRightStrand> strands) {
		List<ErmProductRightStrand> inclusions = new ArrayList<ErmProductRightStrand>();
		for (ErmProductRightStrand s: strands) {
			if (s.isInclusion()) {
				inclusions.add(s);
			}
		}
		return inclusions;
	}
	
	@Override
	public List<Long> syncReleaseDate(Long foxVersionId, Date date,String userId, boolean isBusiness) throws ErmException {
		setUserInDBContext(userId, isBusiness);		
		List<ErmProductRightStrand> strands = loadRightStrands(foxVersionId);
		strands = getInclusionsOnly(strands);
		List<Long> ids =  saveHandler.updateReleaseDate(date, strands);
		//now create a comment at the product level indicating that
		Date differentDate = getDifferentReleaseDate(strands,date); 
		SyncDateCommentProvider commentProvider = new SyncDateCommentProvider();
		Comment comment = commentProvider.get(differentDate, date, userId, isBusiness);
		commentsService.addCommentToProductVersion(foxVersionId, com.fox.it.erm.enums.EntityCommentType.PRODUCT_INFO.getId(), comment, userId, isBusiness);
		return ids;
		
	}
	
	
	@Override
	public void deleteRightStrand(String userId, boolean isBusiness,Long foxVersionId, List<Long> rightStrandIds)  {	
		setUserInDBContext(userId, isBusiness);
		em.flush();
		saveHandler.delete(foxVersionId,rightStrandIds);
	}
	
	private List<ErmProductRightStrand> findStrandsOnlyByFoxVersionId(Long foxVersionId, boolean isBusiness) {
		RightStrandSQLFinder rightStrandFinder = new RightStrandSQLFinder(getEntityManager());
		List<ErmProductRightStrand> strands = rightStrandFinder.findStrandsOny(foxVersionId, isBusiness);
		return strands;
	}
	
	
	public void deleteRightStrands(Long foxVersionId, String userId, boolean isBusiness) {	
		List<ErmProductRightStrand> strands = findStrandsOnlyByFoxVersionId(foxVersionId, isBusiness);
		List<Long> ids = StrandsUtil.getStrandIds(strands);
		deleteRightStrand(userId, isBusiness,foxVersionId, ids);		
	}
	
	/**
	 * 
	 * @param rightStrandUpdate
	 * @param userId
	 * @param isBusiness
	 * @return
	 * @throws ErmValidationException 
	 */
	public List<ErmProductRightStrand> adoptRightStrand(RightStrandUpdateObject rightStrandUpdate, String userId, boolean isBusiness) throws ErmException {
		setUserInDBContext(userId, isBusiness);
		List<ErmProductRightStrand> adopted = new ArrayList<>();
		List<Long> ids = rightStrandUpdate.getIds();
		if(ids != null && ids.size() > 0){
			List<ErmProductRightStrand> strands = findByIds(ids);
			for(ErmProductRightStrand r : strands){
				adoptValidator.validate(r, isBusiness);
			}		
			
			try {
				saveHandler.adoptRightStrand(strands, userId, isBusiness);				
			} catch (Exception e) {
				ExceptionUtil exceptionUtil = new ExceptionUtil();
				ErmException ermException = exceptionUtil.getErmException(e);
				throw ermException;
			}
		}
		
		return adopted;
	}
	
	/**
	 * 
	 * @param rightStrandUpdate
	 * @param userId
	 * @param isBusiness
	 * @return
	 * @throws ErmException
	 */
	public List<Long> adoptRestriction(RightStrandUpdateObject rightStrandUpdate, String userId, boolean isBusiness) throws ErmException{
		List<Long> adopted = new ArrayList<>();
//		List<ErmProductRightRestriction> ermRestrictions = new ArrayList<ErmProductRightRestriction>();
		List<RestrictionObject> restrictions = rightStrandUpdate.getRestrictionsToAdd();
		if(restrictions != null && restrictions.size() > 0){
			List<Long> ids = new ArrayList<Long>();
			for(RestrictionObject ro : restrictions){
				ids.add(ro.getRestrictionId());
			}
			
			List<ErmProductRightRestriction> ers = findRestrictionsByIds(ids);
			for(ErmProductRightRestriction er : ers){
				adoptValidator.validateRestriction(er, isBusiness);
			}
			
			try {
				adopted = saveHandler.adoptRightRestrictions(ers, userId, isBusiness);
			}
			catch(Exception e){
				ExceptionUtil exceptionUtil = new ExceptionUtil();
				ErmException ermException = exceptionUtil.getErmException(e);
				throw ermException;
			}
		}
		return adopted;
	}
	
	/**
	 * 
	 * @param rightStrandUpdate
	 * @param userId
	 * @param isBusiness
	 * @return
	 * @throws ErmException
	 */
	public Map<String, List<? extends Object>> adoptStrandsAndRestrictions(RightStrandUpdateObject rightStrandUpdate, String userId, boolean isBusiness) throws ErmException {
		Map<String, List<? extends Object>> map = new HashMap<String, List<? extends Object>>();
		List<ErmProductRightStrand> adoptedStrand = this.adoptRightStrand(rightStrandUpdate, userId, isBusiness);
		map.put("rightStrands", adoptedStrand);
		
		List<Long> ermRestrictions = this.adoptRestriction(rightStrandUpdate, userId, isBusiness);
		map.put("ermRestrictions", ermRestrictions);
		
		return map;
	}

	@Override
	public void deleteRightRestriction(String userId, boolean isBusiness, String q) throws ErmException {
		
			JsonToDeleteRightsRestrictionStrandCreateObject converter = new JsonToDeleteRightsRestrictionStrandCreateObject(jsonService);
			DeleteRightsRestrictionStrandCreateObject delete = converter.convert(q);
			Long foxVersionId = delete.getFoxVersionId();
			List<Long> ids = delete.getRightStrandRestrictionIds();
			logger.info("delete restriction called for:  " + q + " and userId: " + userId + " for foxVersionId: " + foxVersionId);
			deleteRightRestriction(userId, isBusiness, ids, foxVersionId);		
	}

	@Override
	public void deleteRightRestriction(String userId, boolean isBusiness,
			List<Long> restrictionIds, Long foxVersionId)
			throws ErmException {
		setUserInDBContext(userId, isBusiness);
		em.flush();
		saveHandler.deleteRightRestrictions(restrictionIds);
	}
	

	public RightStrandCreateObject convertToRightStrandCreateObject(String json){		
		return jsonConverter.convert(json);
	}
	
	
	/**
	 * @param json
	 * @return - a list of error codes if any
	 */
	@Override
	public List<Long> getRightStrandsFromCreateObject(String json,String userId, boolean isBusiness) throws ErmException{
		getLogger().info("Got save strands for user " + userId + " isBusiness: " + isBusiness +" json " + json  );
		RightStrandCreateObject r = convertToRightStrandCreateObject(json);
		r.setDates();
		return saveCreateObject(r, userId, isBusiness);
	}
	
	
	private CopyStrandsProcessorTempTableHandler getCopyProcessor() {
		return new CopyStrandsProcessorTempTableHandler(getEntityManager(),commentsService,ermProductVersionService);
	}
	
	@Override
	public List<Long> copyStrands(Long foxVersionId, RightStrandUpdateObject update,String userId, boolean isBusiness) {
		setUserInDBContext(userId, isBusiness);
		em.flush();
		checkOrCreateStrandSet(update, foxVersionId, userId);		
		List<ErmProductRightStrand> strands = findByIds(update.getIds());
		CopyStrandsProcessorTempTableHandler copyProcessor = getCopyProcessor();
		List<RightStrandSave> saved = copyProcessor.copyStrands(foxVersionId, strands, update, userId, isBusiness);

		Map<Long,List<Long>> commentToRestrictionIds = getCommentTimestampIdToRightRestrictionIds(saved);
		createLinkedCommentsForRightRestrictions(commentToRestrictionIds,userId,isBusiness);
		
		
		List<Long> ids = IdsUtil.getRightStrandSaveIds(saved);
		return ids;
	}
	
	
	//has tx not suppoted to avoid tx timeout
	@Override
	@TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
	public CopyToProductsResponse copyStrands(Long foxVersionId, List<Long> toFoxVersionIds,RightStrandUpdateObject update,String userId, boolean isBusiness)  {
		CopyToProductsResponse response = new CopyToProductsResponse();		
		if (toFoxVersionIds==null) { 
			getLogger().info("Copy strands received empty list of fox version ids to copy to. No action will be performed");
			return response;
		}
		//get the strands to copy
		List<ErmProductRightStrand> strands = findByIds(update.getIds());
		List<Long> strandIds = new ArrayList<>();
		for (Long toFoxVersionId: toFoxVersionIds) {
			try {
				checkOrCreateStrandSet(update, toFoxVersionId, userId);				
				List<RightStrandSave> saved = copyService.copyStrandsAndAddComment(foxVersionId, toFoxVersionId, strands, update, userId, isBusiness,this);
				Map<Long,List<Long>> commentToRestrictionIds = getCommentTimestampIdToRightRestrictionIds(saved);
				createLinkedCommentsForRightRestrictions(commentToRestrictionIds,userId,isBusiness);
				
				List<Long> ids = IdsUtil.getRightStrandSaveIds(saved);				
				strandIds.addAll(ids);
				response.setSuccess(toFoxVersionId);
			} catch (Exception e) {
				getLogger().log(Level.SEVERE, "Eror copying strands from " + foxVersionId + " to " + toFoxVersionId, e);
				ExceptionUtil exceptionUtil = new ExceptionUtil();
				ErmException ermException = exceptionUtil.getErmException(e);
				response.setFail(toFoxVersionId, ermException);
			}
		}
		response.setStrandIds(strandIds);
		return response;
	}
	
	
	public CopyToProductsResponse copyProductInfoCodes(Long foxVersionId,List<Long> toFoxVersionIds, List<Long> infoCodeIds,String userId, boolean isBusiness) {
		CopyToProductsResponse response = new CopyToProductsResponse();		
		if (toFoxVersionIds==null) { 
			getLogger().info("Copy product info codes received empty list of fox version ids to copy to. No action will be performed");
			return response;
		}
		List<ErmProductRestriction> infoCodes = productRestrictionService.findProductRestrictionsByIds(infoCodeIds);
		for (Long toFoxVersionId: toFoxVersionIds) {
			try {
				copyService.copyInfoCodes(foxVersionId, toFoxVersionId, infoCodes, userId, isBusiness);
				response.setSuccess(toFoxVersionId);
			} catch (Exception e) {
				getLogger().log(Level.SEVERE, "Eror copying info codes from " + foxVersionId + " to " + toFoxVersionId, e);
				ExceptionUtil exceptionUtil = new ExceptionUtil();
				ErmException ermException = exceptionUtil.getErmException(e);
				response.setFail(toFoxVersionId, ermException);
			}
		}
		return response;
	}
	

}
