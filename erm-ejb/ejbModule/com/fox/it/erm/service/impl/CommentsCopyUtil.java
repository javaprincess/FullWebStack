package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.enums.EntityCommentType;

public class CommentsCopyUtil {

	public CommentsCopyUtil() {

	}
	
	public static List<EntityComment> findEntityCommentsToCopy(EntityManager em,Long entityTypeId,List<Long> ids) {
		EntityCommentSearchCriteria criteria = new EntityCommentSearchCriteria(em);
		criteria.setEntityTypeId(entityTypeId);
		criteria.setEntityIds(ids);
		List<Long> exclude = new ArrayList<>();
		exclude.add(EntityCommentType.CLEARANCE_MEMO.getId());
		exclude.add(EntityCommentType.CLEARANCE_MEMO_MAP.getId());		
		criteria.excludeCommentTypeIds(exclude);
		return criteria.getResultList();		
	}
	
	
	public static Map<Long,List<EntityComment>> toMapByEntityId(List<EntityComment> entityComments) {
		Map<Long,List<EntityComment>> entityCommentsMap = new HashMap<>();
		for (EntityComment entityComment: entityComments) {
			Long entityId = entityComment.getEntityId();
			List<EntityComment> comments = new ArrayList<>();
			if (entityCommentsMap.containsKey(entityId)) {
				comments = entityCommentsMap.get(entityId);
			} else {
				entityCommentsMap.put(entityId, comments);
			}
			comments.add(entityComment);
		}
		return entityCommentsMap;
	}
	

}
