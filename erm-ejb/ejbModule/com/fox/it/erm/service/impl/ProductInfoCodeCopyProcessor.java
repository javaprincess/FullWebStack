package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.enums.EntityType;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.util.UpdatableProcessor;
import com.google.common.base.Function;
import com.google.common.collect.Maps;

public class ProductInfoCodeCopyProcessor {

	
	private final EntityManager em;
	private final CommentsService commentsService;	
	
	@Inject
	public ProductInfoCodeCopyProcessor(EntityManager em,CommentsService commentsService) {
		this.em = em;
		this.commentsService = commentsService;
	}
	
	private Long copy(ErmProductRestriction infoCode, Long toFoxVersionId,String userId,boolean isBusiness,Date date) {
		ErmProductRestriction copy = new ErmProductRestriction();
		copy.copyForUpdate(infoCode);
		copy.setFoxVersionId(toFoxVersionId);
		UpdatableProcessor.setUserIdAndTypeIndicator(copy, userId, isBusiness, !isBusiness,date);
		em.persist(copy);
		return copy.getProductRestrictionId();
	}
	
	private List<ErmProductRestriction> findInfoCodes(Long foxVersionId,boolean isBusiness) {
		ErmProductRestrictionSearchCriteria criteria = new ErmProductRestrictionSearchCriteria(em);
		criteria.setFoxVersionId(foxVersionId);
		criteria.setIsBusiness(isBusiness);
		return criteria.getResultList();
	}
	
	private Map<Long,ErmProductRestriction> toMapByInfoCodeId(List<ErmProductRestriction> restrictions) {
		return Maps.uniqueIndex(restrictions, new Function<ErmProductRestriction,Long>() {

			@Override
			public Long apply(ErmProductRestriction restriction) {
				return restriction.getRestrictionCdId();
			}
			
		});
	}
	
	private Map<Long,ErmProductRestriction> getInfoCodesByInfoCodeId(Long foxVersionId,boolean isBusiness) {
		List<ErmProductRestriction> restrictions = findInfoCodes(foxVersionId, isBusiness); 
		return toMapByInfoCodeId(restrictions);
	}
	
	private boolean exists(Map<Long,ErmProductRestriction> existing,ErmProductRestriction restriction) {
		return existing.containsKey(restriction.getRestrictionCdId());
	}
	
	public List<Long> copy(Long fromFoxVersionId, Long toFoxVersionId, List<ErmProductRestriction> infoCodes, String userId, boolean isBusiness) {
		List<Long> ids = new ArrayList<>();
		if (infoCodes!=null && infoCodes.size()>0) {
			Map<Long,ErmProductRestriction> existing = getInfoCodesByInfoCodeId(toFoxVersionId, isBusiness);
			Map<Long,Long> idsMap = new HashMap<>();
			Date now = new Date();
			for (ErmProductRestriction infoCode: infoCodes) {
				if (!exists(existing,infoCode)) {
					Long infoCodeId = copy(infoCode,toFoxVersionId,userId,isBusiness,now);
					idsMap.put(infoCode.getProductRestrictionId(),infoCodeId);
				}
			}
			em.flush();
			//now copy the comments
			ids.addAll(idsMap.values());	
			copyInfoCodeComments(idsMap,userId,isBusiness);		
		}
		return ids;
	}
	
	private List<EntityComment> findEntityCommentsToCopy(List<Long> infoCodeIds) {
		return CommentsCopyUtil.findEntityCommentsToCopy(em,EntityType.PROD_RSTRCN.getId(), infoCodeIds);
	}
	
	
	private void copyInfoCodeComments(Map<Long,Long> idsMap,String userId,boolean isBusiness) {
		List<Long> originalIds = new ArrayList<>();
		originalIds.addAll(idsMap.keySet());
		//first get all the existing comments for the strands
		if (originalIds==null|originalIds.isEmpty()) return;
		List<EntityComment> entityComments = findEntityCommentsToCopy(originalIds);
		if (entityComments.isEmpty()) return;
		Map<Long,List<EntityComment>> entityCommentsMap = CommentsCopyUtil.toMapByEntityId(entityComments);
		for (Long infoCodeId:entityCommentsMap.keySet()) {
			Long copyInfoCodeId = idsMap.get(infoCodeId);
			List<EntityComment> entityCommentsToCopy = entityCommentsMap.get(infoCodeId);
			List<Long> copyToInfoCodeIds = new ArrayList<>();
			copyToInfoCodeIds.add(copyInfoCodeId);
		    commentsService.cloneWithComments(EntityType.PROD_RSTRCN.getId(), copyToInfoCodeIds, entityCommentsToCopy, userId, isBusiness);			
		}		
	}
	

}
