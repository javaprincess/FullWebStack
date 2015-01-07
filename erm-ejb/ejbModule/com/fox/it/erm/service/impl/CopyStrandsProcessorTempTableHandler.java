package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.DBOperation;
import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.ErmRightStrandSet;
import com.fox.it.erm.RightStrandRestrictionSave;
import com.fox.it.erm.RightStrandSave;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.enums.EntityCommentType;
import com.fox.it.erm.enums.EntityType;
import com.fox.it.erm.service.ErmProductVersionService;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
import com.fox.it.erm.util.RightStrandUpdateObject;
import com.fox.it.erm.util.StrandsUtil;
import com.google.common.collect.Lists;

public class CopyStrandsProcessorTempTableHandler extends TempTableSaveHandlerBase implements CopyStrandsProcessor{
	private static final Logger logger = Logger.getLogger(CopyStrandsProcessorTempTableHandler.class.getName());
	private static final int IN_LIMIT =1000;	

	
	
	interface RightStrandSaveUpdater {
		void update(RightStrandSave s,Long value);
	}
	
	static class Updaters {
		 static RightStrandSaveUpdater getMediaIdUpdater() {
			return new RightStrandSaveUpdater() {

				@Override
				public void update(RightStrandSave s, Long value) {
					s.setMediaId(value);					
				}
				
			};
		}
		 
		 static RightStrandSaveUpdater getTerritoryIdUpdater() {
			return new RightStrandSaveUpdater() {

				@Override
				public void update(RightStrandSave s, Long value) {
					s.setTerritoryId(value);					
				}
				
			};
		}
		 
		 static RightStrandSaveUpdater getLanguageIdUpdater() {
			return new RightStrandSaveUpdater() {

				@Override
				public void update(RightStrandSave s, Long value) {
					s.setLanguageId(value);					
				}
				
			};
		}
		 
		 
	};
	
	
	
	private final CommentsService commentsService;
	private final ErmProductVersionService productVersionService;
	
	@Inject
	public CopyStrandsProcessorTempTableHandler(EntityManager em,CommentsService commentsService,ErmProductVersionService productVersionServcie) {
		super(em,commentsService);
		this.commentsService = commentsService;
		this.productVersionService = productVersionServcie;
	}
	
	
	private Logger getLogger() {
		return logger;
	}
	
	private void clearId(List<RightStrandSave> save) {
		for (RightStrandSave s:save) {
			s.setRightStrandId(null);
			for (RightStrandRestrictionSave r: s.getRightRestrictions()) {
				r.setRightRestrictionId(null);
			}
		}
	}
	
	private List<RightStrandSave> expand(List<RightStrandSave> save,List<Long> ids, RightStrandSaveUpdater updater) {
		if (ids==null||ids.size()==0) return save;
		List<RightStrandSave> expanded = new ArrayList<RightStrandSave>(ids.size() * save.size());
		for (RightStrandSave s: save) {
			for (Long id: ids) {
				RightStrandSave copy = new RightStrandSave();
				copy.copyFrom(s);
				copy.setOriginalRightStrandId(s.getOriginalRightStrandId());
				copy.addRestrictions(s);
				updater.update(copy, id);
				expanded.add(copy);
			}
		}
		
		return expanded;

	}
	
	private List<RightStrandSave> expandMedia(List<RightStrandSave> save,List<Long> mediaIds) {
		return expand(save,mediaIds,Updaters.getMediaIdUpdater());
	}

	private List<RightStrandSave> expandTerritory(List<RightStrandSave> save,List<Long> territoryIds) {
		return expand(save,territoryIds,Updaters.getTerritoryIdUpdater());
	}
	
	private List<RightStrandSave> expandLanguage(List<RightStrandSave> save,List<Long> languageIds) {
		return expand(save,languageIds,Updaters.getLanguageIdUpdater());
	}
	
	private List<RightStrandSave> expand(List<RightStrandSave> save,List<Long> mediaIds,List<Long> territoryIds, List<Long> languageIds) {
		return expandMedia(expandTerritory(expandLanguage(save, languageIds), territoryIds), mediaIds);
	}
	
	private List<RightStrandSave> expand(List<RightStrandSave> save, RightStrandUpdateObject update) {
		return expand(save,update.getMediaIds(),update.getTerritoryIds(),update.getLanguageIds());
	}
	
	/**
	 * Delete strand this is used for territory conversion
	 * @param strands
	 */
	private void delete(Long foxVersionId,List<ErmProductRightStrand> strands) {
		
		List<Long> ids = IdsAccumulator.getIds(strands, new IdProvider<ErmProductRightStrand>() {

			@Override
			public Long getId(ErmProductRightStrand o) {
				return o.getRightStrandId();
			}
		});
		deleteRightStrands(foxVersionId, ids);
	}
	
	
	private void processRemoveRestrictions(List<RightStrandRestrictionSave> restrictions, RightStrandUpdateObject update) {
		if (update.getRestrictionsToRemove()==null||update.getRestrictionsToRemove().isEmpty()) {
			//if there's nothing to remove, do nothing
			return;
		}
		for (RightStrandRestrictionSave restriction: restrictions) {
			Long restrictionCodeId = restriction.getRestrictionCdId();
			if (update.hasRemoveRestriction(restrictionCodeId)) {
				restriction.setOperation(DBOperation.DELETE);
			}
		}
	}
	
	/**
	 * Copy the strands to the same product, modify the strands before copying.
	 * @param strandIds
	 */
	public List<RightStrandSave> copyStrands(Long foxVersionId, List<ErmProductRightStrand> strands,RightStrandUpdateObject update,String userId, boolean isBusiness) {
		boolean includeRestrictions = true;
		if (update.isExclusion()) {
			includeRestrictions = false;
		}
		//AMV 3/26/2014
		deleteTempTables();		
		List<RightStrandSave> save = getRightStrandSaveObjects(strands, includeRestrictions);
		ReleaseDateProcessor.setReleaseDateForCreateSaveObjects(save, isBusiness);
		
		clearId(save);
		Date now = new Date();
		save = expand(save, update);
		for (RightStrandSave s: save) {
			
			update(s, update, userId, isBusiness);
			setUserIdAndTypeIndicator(s, userId, isBusiness, now);
			s.setInsert();
			//first the the operation as INSERT for ALL restrictions
			//and then set to DELETE the once that have delete in the update object
			List<RightStrandRestrictionSave> restrictions = s.getRightRestrictions(); 
			setOperation( restrictions, DBOperation.INSERT);
			processRemoveRestrictions(restrictions,update);			
			
		}
		save =createSaveObjects(save);

		setUpdateRightStrands();
		setUpdateRestrictions();
		copyStrandComments(save,strands,userId,isBusiness);
		copyStrandInfoCodesComments(save,strands,userId,isBusiness);
		if (update.shouldDeleteOriginal()) {
			deleteTempTables();
			delete(foxVersionId,strands);
		}
		return save;
 	}
	
	private void findOrCreateErmProductVersion(Long foxVersionId,String userId) {
		productVersionService.findOrCreateNewProductVersion(foxVersionId, userId);
	}
	
	private void setReleaseDate(RightStrandSave strand, Date date) {
		if (strand!=null && strand.isInclusion()) {
			strand.setReleaseDate(date);
		} else {
			strand.setReleaseDate(null);
		}
	}
	
	private Long copyStrandSet(Long strandSetId, Long foxVersionId,String userId) {
		if (strandSetId!=null) {
			ErmRightStrandSet strandSet = productVersionService.copyStrandSet(strandSetId, foxVersionId, userId);
			if (strandSet!=null) {
				return strandSet.getRightStrandSetId();
			}
		}
		return null;
	}
	
	private Map<Long,Long> copyStrandSets(List<ErmProductRightStrand> strands,Long foxVersionId,String userId) {
		Map<Long,Long> strandSetMap = new HashMap<>();
		for (ErmProductRightStrand s: strands) {
			Long strandSetId = s.getStrandSetId();
			if (strandSetId!=null && ! strandSetMap.containsKey(strandSetId)) {
				Long copiedStrandSetId = copyStrandSet(strandSetId, foxVersionId, userId);
				strandSetMap.put(strandSetId, copiedStrandSetId);
			}
		}
		return strandSetMap;
	}
	public List<RightStrandSave> copyStrands(Long foxVersionId, Long toFoxVersionId,List<ErmProductRightStrand> strands,RightStrandUpdateObject update,String userId, boolean isBusiness) {
		long t0=System.currentTimeMillis();
		boolean includeRestrictions = true;	
		if (update.isExclusion()) {
			includeRestrictions = false;
		}		
		getLogger().info("Starting copy strands from " + foxVersionId + " to " + foxVersionId);
		Map<Long,Long> strandSetMap = copyStrandSets(strands,toFoxVersionId,userId);		
		deleteTempTables();		
		findOrCreateErmProductVersion(toFoxVersionId, userId);
		List<RightStrandSave> save = getRightStrandSaveObjects(strands, includeRestrictions);
		clearId(save);
		Date now = new Date();
		Date releaseDate = null;
		if (isBusiness) {
			releaseDate = getReleaseDate(toFoxVersionId);
		}
		save = expand(save, update);		
		for (RightStrandSave s: save) {			
			s.setFoxVersionId(toFoxVersionId);
			if (s.getStrandSetId()!=null) {
				s.setStrandSetId(strandSetMap.get(s.getStrandSetId()));
			}			
			setReleaseDate(s,releaseDate);
			update(s, update, userId, isBusiness);
			setUserIdAndTypeIndicator(s, userId, isBusiness, now);
			s.setInsert();
			setOperation(s.getRightRestrictions() , DBOperation.INSERT);
			processRemoveRestrictions(s.getRightRestrictions(),update);				
		}

		save =createSaveObjects(save);
		List<Long> ids = getIds(save);		
		setUpdateRightStrands();
		setUpdateRestrictions();
//		deleteTempTables();
		copyStrandComments(save,strands,userId,isBusiness);
		copyStrandInfoCodesComments(save,strands,userId,isBusiness);
		long t1 = System.currentTimeMillis();
		getLogger().info("Finished copying " + ids.size() + " strands and comments in " + (t1 - t0) + " ms");
		return save;
 	}

	private List<EntityComment> findEntityCommentsToCopyInBatch(Long entityTypeId,List<Long> strandIds) {
		EntityCommentSearchCriteria criteria = new EntityCommentSearchCriteria(getEntityManager());
		criteria.setEntityIds(strandIds);
		List<Long> exclude = new ArrayList<>();
		exclude.add(EntityCommentType.CLEARANCE_MEMO.getId());
		exclude.add(EntityCommentType.CLEARANCE_MEMO_MAP.getId());		
		criteria.excludeCommentTypeIds(exclude);
		return criteria.getResultList();
		
	}
	
	
	private List<EntityComment> findEntityCommentsToCopy(Long entityTypeId,List<Long> strandIds) {
		if (strandIds==null||strandIds.isEmpty()) {
			return new ArrayList<EntityComment>();
		}
		if (strandIds.size()<=IN_LIMIT) {
			return findEntityCommentsToCopyInBatch(entityTypeId, strandIds);
		}
		List<EntityComment> allComments = new ArrayList<>(strandIds.size());
		List<List<Long>> lists = Lists.partition(strandIds, IN_LIMIT);;
		for (List<Long> list:lists) {
			List<EntityComment> comments = findEntityCommentsToCopyInBatch(entityTypeId,list);
			allComments.addAll(comments);
		}
		return allComments;
	}


	private List<RightStrandRestrictionSave> getSavedRightInfoCodes(List<RightStrandSave> strands) {
		List<RightStrandRestrictionSave> savedRestrictions = new ArrayList<>();
		for (RightStrandSave strand: strands) {
			for (RightStrandRestrictionSave restriction: strand.getRightRestrictions()) {
				savedRestrictions.add(restriction);
			}
		}
		return savedRestrictions;
	}
	
	private Map<Long,List<Long>> getEntityIdByCommentId(List<EntityComment> entityComments) {
		Map<Long,List<Long>> map = new HashMap<>();
		for (EntityComment ec: entityComments) {
			Long commentId = ec.getCommentId();
			List<Long> comments = new ArrayList<>();
			if (map.containsKey(commentId)) {
				comments = map.get(commentId);
			} else {
				map.put(commentId, comments);
			}
			comments.add(ec.getEntityId());
		}
		return map;
	}
	
	
	
	private Map<Long,Long> getOldRestrictionIdToNewRestrictionIdMap(List<RightStrandRestrictionSave> restrictions) {
		Map<Long,Long> map = new HashMap<>();
		for (RightStrandRestrictionSave r: restrictions) {
			Long restrictionId = r.getRightRestrictionId();
			Long original = r.getOriginalRightRestrictionId();
			map.put(original,restrictionId);
		}
		return map;
	}
	
	private Map<Long,Long> getOldStrandIdToNewStrandIdMap(List<RightStrandSave> strands) {
		Map<Long,Long> map = new HashMap<>();
		for (RightStrandSave s: strands) {
			Long strandId = s.getRightStrandId();
			Long original = s.getOriginalRightStrandId();
			map.put(original,strandId);
		}
		return map;
	}
	
	
	private List<Long> getNewEntityIdsFromCommentId(Long commentId,Map<Long,List<Long>> commentToEntityIdsMap,Map<Long,Long> oldEntityIdToNewEntityIdMap) {
		List<Long> newEntityIds = new ArrayList<>();	
		List<Long> oldEntityIds = commentToEntityIdsMap.get(commentId);
		for (Long entityId: oldEntityIds) {
			Long newEntityId = oldEntityIdToNewEntityIdMap.get(entityId);
			newEntityIds.add(newEntityId);
		}				
		return newEntityIds;
	}

	
	private void copyStrandInfoCodesComments(List<RightStrandSave> savedStrands, List<ErmProductRightStrand> strands,String userId, boolean isBusiness) {
		long t0 = System.currentTimeMillis();
		getLogger().info("Starting copying info code coments for " + strands.size() +" strands");
		List<Long> strandInfoCodeIds = new ArrayList<>();
		//first collect all the info code ids
		for (ErmProductRightStrand strand: strands) {
			for (ErmProductRightRestriction restriction: strand.getErmProductRightRestrictions()) {
				Long id = restriction.getRightRestrictionId();
				strandInfoCodeIds.add(id);
			}
		}
		if (strandInfoCodeIds.isEmpty()) return;
		List<RightStrandRestrictionSave> savedRestrictions = getSavedRightInfoCodes(savedStrands);		

		//get all the info codes mapped by comment id. Each comment is linked to the list of info codes.
		//we also need the correspondence (mapping) between the old info code and the new info code.
		//for each comment get the list of info codes that it needs to be linked to
		//clone the comment
		//link each cloned comment to the list of info codes
		Long entityTypeId = EntityType.STRAND_RESTRICTION.getId();
		List<EntityComment> entityComments = findEntityCommentsToCopy(entityTypeId ,strandInfoCodeIds);
		Map<Long,List<Long>> restrictionIdsByCommentId = getEntityIdByCommentId(entityComments);
		Map<Long,Long> oldRestrictionIdToNewRestrictionIdMap = getOldRestrictionIdToNewRestrictionIdMap(savedRestrictions);
		for (Long commentId: restrictionIdsByCommentId.keySet()) {
			//first clone the comment
			Long newCommentId = commentsService.cloneComment(commentId, userId);
			List<Long> restrictionIdToLinkCommentTo = getNewEntityIdsFromCommentId(commentId,restrictionIdsByCommentId,oldRestrictionIdToNewRestrictionIdMap);
			commentsService.linkCommentToEntities(newCommentId, entityTypeId, EntityCommentType.INFO_CODE.getId(), restrictionIdToLinkCommentTo, userId);
		}
		
		long t1 = System.currentTimeMillis();
		getLogger().info("Finished copying strand info comments in " + (t1-t0) + "ms");
	}
	
	private void copyStrandComments(List<RightStrandSave> savedStrands,List<ErmProductRightStrand> strands,String userId,boolean isBusiness) {
		long t0 = System.currentTimeMillis();
		getLogger().info("Copying strand comments for " + strands.size() + " strands");
		List<Long> strandIds = StrandsUtil.getStrandIds(strands);
		Long entityTypeId = EntityType.STRAND.getId();
		//first get all the existing comments for the strands		
		List<EntityComment> entityComments = findEntityCommentsToCopy( entityTypeId,strandIds);
		Map<Long,List<Long>> restrictionIdsByCommentId = getEntityIdByCommentId(entityComments);
		Map<Long,Long> oldStrandIdToNewStrandIdMap = getOldStrandIdToNewStrandIdMap(savedStrands);
		for (Long commentId: restrictionIdsByCommentId.keySet()) {
			//first clone the comment
			Long newCommentId = commentsService.cloneComment(commentId, userId);
			List<Long> restrictionIdToLinkCommentTo = getNewEntityIdsFromCommentId(commentId,restrictionIdsByCommentId,oldStrandIdToNewStrandIdMap);
			commentsService.linkCommentToEntities(newCommentId, entityTypeId, EntityCommentType.RIGHT_STRAND_COMMENT.getId(), restrictionIdToLinkCommentTo, userId);
		}
				
		long t1 = System.currentTimeMillis();
		getLogger().info("Finished copying strands comments in " + (t1-t0) + "ms");
	}

	
}
