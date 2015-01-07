package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;
import javax.validation.constraints.NotNull;

import com.fox.it.erm.DBOperation;
import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.ProductHeader;
import com.fox.it.erm.ProductVersionHeader;
import com.fox.it.erm.RightStrandRestrictionSave;
import com.fox.it.erm.RightStrandSave;
import com.fox.it.erm.TempTableSaveObject;
import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.enums.EntityCommentType;
import com.fox.it.erm.enums.EntityType;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
import com.fox.it.erm.util.IdsUtil;
import com.fox.it.erm.util.RestrictionObject;
import com.fox.it.erm.util.RightStrandUpdateObject;
import com.fox.it.erm.util.UpdatableProcessor;

public class TempTableSaveHandlerBase extends RightStrandUpdateProcessorBase{
	private static final Logger logger = Logger.getLogger(TempTableSaveHandlerBase.class.getName());
	private String UPDATE_STRANDS_PROC_NAME="PROCESS_RGHT_STRND()";
	private String UPDATE_STRAND_RESTRICTIONS_PROC_NAME="PROCESS_RGHT_RSTRCN()";


	private final EntityManager em;
	private final CommentsService commentsService;
	
	public TempTableSaveHandlerBase(EntityManager em,CommentsService commentsService) {
		this.em=em;
		this.commentsService = commentsService;
	}
	
	protected EntityManager getEntityManager() {
		return em;
	}
	
	private Logger getLogger() {
		return logger;
	}
	
	
	protected void setOperation(TempTableSaveObject o,DBOperation operation) {
		o.setOperation(operation);
	}
	
	protected void setOperation(List<? extends TempTableSaveObject> l,DBOperation operation) {
		for (TempTableSaveObject o: l) {
			setOperation(o,operation);
		}
	}
	

	private void processReleaseDate(RightStrandSave o) {
		if (o.isLegal() && !o.isBusiness()) {
			o.setReleaseDate(null);
		}
	}
	
	protected List<RightStrandSave> getRightStrandSaveObjects(@NotNull List<ErmProductRightStrand> strands,boolean includeRestrictions) {
		List<RightStrandSave> save = new ArrayList<>(strands.size());
		for (ErmProductRightStrand strand:strands) {
			RightStrandSave o = new RightStrandSave();

			o.copyFrom(strand);
			processReleaseDate(o);
			if (includeRestrictions) {
				List<RightStrandRestrictionSave> restrictions = getRightStrandRestrictionSaveObjects(strand.getErmProductRightRestrictions());
				o.setRightRestrictions(restrictions);
			}
			save.add(o);
		}
		return save;
	}
	
	protected List<RightStrandRestrictionSave> getRightStrandRestrictionSaveObjects(@NotNull List<ErmProductRightRestriction> strandRestrictions) {
		List<RightStrandRestrictionSave> save = new ArrayList<>(strandRestrictions.size());
		for (ErmProductRightRestriction restriction: strandRestrictions) {
			RightStrandRestrictionSave o = new RightStrandRestrictionSave();			
			o.copyFrom(restriction);
			save.add(o);
		}
		return save;
	}
	
	private void callStoredProcedure(String procedure) {
		Query query = em.createNativeQuery("call " + procedure);
		query.executeUpdate();		
	}
	
	protected void setUpdateRightStrands() {
		callStoredProcedure(UPDATE_STRANDS_PROC_NAME);
	}
	
	/**
	 * Deletes the content of the temp tables.
	 * This is used when copying data to multiple products.
	 * When we finish with one product we delete to ensure that next product starts with clean table
	 */
	protected void deleteTempTables() {
		getLogger().info("Deleting right strand and right strand restrictions temp tables");
		String deleteStrandsQl = "delete from RightStrandSave s";
		String deleteRestrictionsQl = "delete from RightStrandRestrictionSave r";
		em.createQuery(deleteStrandsQl).executeUpdate();
		em.createQuery(deleteRestrictionsQl).executeUpdate();
		em.flush();
	}
	
	protected void setUpdateRestrictions() {
		callStoredProcedure(UPDATE_STRAND_RESTRICTIONS_PROC_NAME);		
	}
	
	protected Date getReleaseDate(Long foxVersionId) {
		ProductVersionHeaderSearchCriteria productVersionHeaderSearchCriteria = new ProductVersionHeaderSearchCriteria(em);
		try {
		ProductVersionHeader productVersionHeader = productVersionHeaderSearchCriteria.setFoxVersionId(foxVersionId).getSingleResult();
		if (productVersionHeader==null) {
			getLogger().log(Level.SEVERE,"Could not find product version header for " + foxVersionId);
			return null;
		}
		Long foxId = productVersionHeader.getFoxId();
		ProductHeaderSearchCriteria productHeaderCriteria = new ProductHeaderSearchCriteria(em);
		ProductHeader productHeader = productHeaderCriteria.setId(foxId).getSingleResult();
		if (productHeader==null) {
			getLogger().log(Level.SEVERE,"Could not find product header for " + foxId);
			return null;			
		}
		if (productHeader!=null) {
			return productHeader.getReleaseDate();
		}
		} catch (NoResultException e) {
			getLogger().log(Level.SEVERE,"No record found for foxVersionId: " + foxVersionId );
		}
		return null;
	}
	
	protected boolean isChangeFromExclusionToInclusion(RightStrandUpdateObject update,List<RightStrandSave> strands) {
		if (!update.isInclusion()) return false;
		for (RightStrandSave strand: strands) {
			if (strand.isExclusion()) 
				return true;
		}
		return false;
		
	}
	
	private boolean processInclusionExclusion(RightStrandSave strand,RightStrandUpdateObject update) {
		boolean changed = false;
		if (update.getInclusionExclusion()==null||update.isInclusionExclusion()) return changed;
		if (update.isExclusion() && !strand.isExclusion()) {
			changed = true;
			strand.setExcludeFlag(Boolean.TRUE);
			//remove all the restrictions as exclusions don't have restrictions
			List<RightStrandRestrictionSave> restrictions = strand.getRightRestrictions();
			for (RightStrandRestrictionSave restriction: restrictions) {
				restriction.setDelete();
			}			
		}
		if (update.isInclusion() && !strand.isInclusion()) {
			strand.setExcludeFlag(Boolean.FALSE);
			changed = true;
		}
		
		return changed;
	}
	
	private void removeRestrictionsNotPresentInUpdate(RightStrandSave strand, RightStrandUpdateObject update,final boolean isBusiness) {
		Set<Long> restrictionCodesInUpdateObject = IdsAccumulator.getIdsSet(update.getRestrictionsToAdd(), new IdProvider<RestrictionObject>() {

			@Override
			public Long getId(RestrictionObject o) {
				return o.getRestrictionCodeId();
			}
			
		});
		for (RightStrandRestrictionSave restriction:strand.getRightRestrictions()) {
			Long restrictionCodeId = restriction.getRestrictionCdId();
			if (restriction.isSameType(isBusiness) && !restrictionCodesInUpdateObject.contains(restrictionCodeId)) {
				restriction.setDelete();
			}

		}
		
	}
	
	private Comment getComment(RestrictionObject restriction,String userId,boolean isBusiness) {
		Comment comment = new Comment();
		comment.setShortDescription(restriction.getCommentTitle());
		comment.setLongDescription(restriction.getComment());
		UpdatableProcessor.setUserIdAndTypeIndicator(comment, userId, isBusiness, !isBusiness, new Date());
		return comment;
	}
	
	
	
	private void addOrUpdateRestrictionsForSingleStrand(RightStrandSave strand,List<RestrictionObject> restrictions, String userId,boolean isBusiness) {
		for (RestrictionObject restriction: restrictions) {
			RightStrandRestrictionSave existing =  getRestriction(strand, restriction.getRestrictionCodeId(),isBusiness);
			ErmProductRightRestriction rightRestriction = getRestrictionConverter().convert(restriction);
			setUpdatedBy(rightRestriction, new Date(), userId, true, true);
			if (existing==null) {
				//add new restriction
				RightStrandRestrictionSave restrictionSave = new RightStrandRestrictionSave();
				restrictionSave.copyFrom(rightRestriction);
				restrictionSave.setRightStrandId(strand.getRightStrandId());				
				setBusinessLegalIndicator(restrictionSave, isBusiness);				
				restrictionSave.setInsert();
				strand.add(restrictionSave);
			} else {
				boolean changed = mergeRestriction(existing, rightRestriction,restriction, userId);
				if (restriction.hasComment()) {
					Long commentId = restriction.getCommentId();
//					Comment comment = getComment(restriction,userId,isBusiness);
					List<Long> restrictionIds = new ArrayList<>();
					restrictionIds.add(existing.getRightRestrictionId());
					commentsService.linkCommentToEntities(commentId, EntityType.STRAND_RESTRICTION.getId(), EntityCommentType.INFO_CODE.getId(), restrictionIds, userId);					
				}
				if (changed) {
					existing.setUpdate();
				}
			}

		}
		
	}
	
	
	/**
	 * Update the restrictions for a single strand update
	 * Update the content on new restrictions. 
	 * Delete any restrictions that are not present in the update object
	 * @param strand
	 * @param update
	 */
	private void mergeRestrictions(RightStrandSave strand, RightStrandUpdateObject update,String userId,boolean isBusiness) {
		removeRestrictionsNotPresentInUpdate(strand, update,isBusiness);
		addOrUpdateRestrictionsForSingleStrand(strand, update.getRestrictionsToAdd(),userId,isBusiness);
		
	}
	

	
	protected RightStrandRestrictionSave getRestriction(RightStrandSave strand, Long restrictionCodeId,boolean isBusiness) {
		for (RightStrandRestrictionSave restriction: strand.getRightRestrictions()) {
			if (restriction.isSameType(isBusiness) && restrictionCodeId.equals(restriction.getRestrictionCdId())) {
				return restriction;
			}
		}
		return null;
		
	}
	
	
	private void addRestrictions(RightStrandSave strand,List<RestrictionObject> restrictions, String userId,boolean isBusiness) {
		RightRestrictionComparator comparator = new RightRestrictionComparator();
		Date date = new Date();
		for (RestrictionObject restriction: restrictions) {
			//check if the restriction is already present.
			//if it is, update otherwise add
			RightStrandRestrictionSave existing = getRestriction(strand, restriction.getRestrictionCodeId(),isBusiness);
			ErmProductRightRestriction rightRestriction = getRestrictionConverter().convert(restriction);
			setUpdatedBy(rightRestriction, date, userId, true, true);
			if (!(existing!=null&&comparator.equal(existing,rightRestriction))) {
				//convert the right restriction to RightStrandRestriction save, set it as insert and add it to the strand
				RightStrandRestrictionSave saveRestriction = new RightStrandRestrictionSave();
				saveRestriction.copyFrom(rightRestriction);
				saveRestriction.setRightStrandId(strand.getRightStrandId());
				setBusinessLegalIndicator(saveRestriction, isBusiness);				
				saveRestriction.setInsert();
				if (restriction.hasComment()) {
					saveRestriction.setComment(restriction.getComment());
					saveRestriction.setCommentTitle(restriction.getCommentTitle());
					saveRestriction.setCommentTimestamp(restriction.getCommentTimestampId());
				}
				strand.add(saveRestriction);
			}
		}		
	}
	
	private void removeRestrictions(RightStrandSave strand,List<RestrictionObject> restrictions,boolean isBusiness) {
		if (restrictions==null||restrictions.size()==0) return;
		Set<Long> ids = getCodeIds(restrictions);
		for (RightStrandRestrictionSave restriction: strand.getRightRestrictions()) {
			Long restrictionCodeId = restriction.getRestrictionCdId();
			if (restriction.isSameType(isBusiness) && ids.contains(restrictionCodeId)) {
				restriction.setDelete();
			}
		}
	}
	
	
	
	protected boolean update(RightStrandSave strand, RightStrandUpdateObject update, String userId, boolean isBusiness){
		boolean isSingleStrandUpdate = update.isSinlgeStrandUpdate();
		boolean changed = false;
		boolean changedInclusionExclusion = false;
		changed = processDates(strand, update)||changed;
		changedInclusionExclusion = processInclusionExclusion(strand,update)||changed;
		changed = processMTL(strand, update)||changed;
		changed = processStrandSet(strand,update)||changed;
		changed = changed||changedInclusionExclusion;
		if (changed||changedInclusionExclusion) {
			strand.setUpdate();
			setUpdatedBy(strand, new Date(), userId, false, true);
		}
		//if is single strand update
		//we need to update the existing restrictions
		//also if there are restrictions that are in the strand but not present in the update object
		//we need to remove them
		
		if (isSingleStrandUpdate) {
			mergeRestrictions(strand, update,userId,isBusiness);
		} else 	if (update.getRestrictionsToAdd()!=null&&update.getRestrictionsToAdd().size()>0) {
			addRestrictions(strand,update.getRestrictionsToAdd(),userId,isBusiness);
		}
		//AMV 5/16/2014
		//Clear the override dates  if the is delete flag is true
		if (update.isDeleteOverrideStartDate()) {
			changed = true;
			strand.setUpdate();
			setUpdatedBy(strand, new Date(), userId, false, true);			
			strand.setOverrideStartDate(null);
		}
		if (update.isDeleteOverrideEndDate()){
			changed = true;
			strand.setUpdate();
			setUpdatedBy(strand, new Date(), userId, false, true);			
			strand.setOverrideEndDate(null);
		}
		
		if (update.getRestrictionsToRemove()!=null&&update.getRestrictionsToRemove().size()>0) {
			removeRestrictions(strand,update.getRestrictionsToRemove(),isBusiness);
		}
		return changed;		
	}
	
	protected Long createSaveObject(RightStrandSave strand) {
		EntityManager em = getEntityManager();
		em.persist(strand);
		em.flush();
		return strand.getRightStrandId();
	}
	
	
		
	protected List<RightStrandSave> createSaveObjects(List<RightStrandSave> saveObjects) {
//		List<Long> ids = new ArrayList<>();
		EntityManager em = getEntityManager();
		for (RightStrandSave s: saveObjects) {
			createSaveObject(s);			
//			ids.add(createSaveObject(s));
		}
		em.flush();
		return saveObjects;
	}
	
	protected void setUserIdAndTypeIndicator(RightStrandSave save,String userId,boolean isBusiness,Date timestamp) {
		UpdatableProcessor.setUserIdAndTypeIndicator(save, userId, isBusiness, !isBusiness, timestamp);
		UpdatableProcessor.setUserIdAndTypeIndicator(save.getRightRestrictions(), userId, isBusiness, timestamp);
	}
	
	protected List<Long> getIds(List<RightStrandSave> save) {
		return IdsUtil.getRightStrandSaveIds(save);
	}
	
	private List<RightStrandSave> getEmptyStrandsSaveWithIds(Long foxVersionId,List<Long> ids) {
		List<RightStrandSave> strands = new ArrayList<>();
		for (Long id: ids) {
			RightStrandSave strand = new RightStrandSave();
			strand.setRightStrandId(id);
			strand.setFoxVersionId(foxVersionId);
			strands.add(strand);
		}
		return strands;
	}
	
	
	protected List<Long> deleteRightStrands(Long foxVersionId,List<Long> ids) {
		List<RightStrandSave> save = getEmptyStrandsSaveWithIds(foxVersionId,ids);
		setOperation(save,DBOperation.DELETE);
		createSaveObjects(save);		
		setUpdateRightStrands();		
		return ids;		
	}
	
	

}
