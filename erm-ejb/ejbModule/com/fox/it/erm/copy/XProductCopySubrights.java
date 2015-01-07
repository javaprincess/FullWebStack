package com.fox.it.erm.copy;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.grants.ProductGrant;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.service.grants.GrantsService;
import com.fox.it.erm.service.grants.ProductGrantSearchCriteria;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
import com.google.common.base.Function;
import com.google.common.collect.Maps;

public class XProductCopySubrights implements XProductSectionCopyProcessor{

	private final boolean isBusiness = false;
	private final GrantsService grantsService;
	private final CommentsService commentsService;
	private final EntityManager em;
	
	@Inject
	public XProductCopySubrights(EntityManager em,GrantsService grantsService,CommentsService commentsService) {
		this.grantsService = grantsService;
		this.commentsService = commentsService;
		this.em = em;
	}

	/**
	 * Returns all the grants associated with the product ids and the entity keys (product grant id)
	 * @param foxVersionId
	 * @param comments
	 * @return
	 */
	private List<ProductGrant> findProductGrants(Long foxVersionId,List<EntityComment> comments) {
		if (comments.isEmpty()) return new ArrayList<ProductGrant>();
		ProductGrantSearchCriteria criteria = new ProductGrantSearchCriteria(em);
		List<Long> entityIds = IdsAccumulator.getIds(comments, new IdProvider<EntityComment>(){

			@Override
			public Long getId(EntityComment o) {
				return o.getEntityId();
			}
			
		});
		criteria.setFoxVersionId(foxVersionId);
		criteria.setIds(entityIds);
		return criteria.getResultList();
	}
	
	private Map<Long,ProductGrant> toMapByGrantId(List<ProductGrant> productGrants){
		Map<Long,ProductGrant> map = Maps.uniqueIndex(productGrants, new Function<ProductGrant,Long>(){

			@Override
			public Long apply(ProductGrant grant) {
				return grant.getId();
			}
			
		});
		return map;
	}
	
	private Map<Long,ProductGrant> getProductGrantMap(Long foxVersionId,List<EntityComment> comments) {
		List<ProductGrant> productGrants = findProductGrants(foxVersionId, comments);
		return toMapByGrantId(productGrants);
	}
	
	private ProductGrant findById(Long id) {
		return grantsService.findById(id);
	}
	
	private Long getGrantCodeId(Long grantId) {
		ProductGrant grant = findById(grantId);
		if (grant==null) {
			return null;
		}
		return grant.getGrantCodeId();
	}
	
	public Map<Long,List<EntityComment>> toMapByEntityId(List<EntityComment> comments) {
		Map<Long,List<EntityComment>> map = new HashMap<Long, List<EntityComment>>();
		if (comments==null||comments.isEmpty()) return map;
		for (EntityComment comment: comments) {
			Long entityId = comment.getEntityId();
			List<EntityComment> entityComments = null;
			if (!map.containsKey(entityId)) {
				entityComments = new ArrayList<>();
				map.put(entityId, entityComments);
			}
			entityComments.add(comment);
		}
		return map;
	}
	
	private void copySubrights(Long toFoxVersionId,List<EntityComment> comments, String userId) throws ErmException{
		//first find the grants associated with it
		//if the grants exist just clone the comments to the grants
		//otherwise create the grants first and the copy the comments to the grants
		Map<Long,ProductGrant> existingGrantsMap = getProductGrantMap(toFoxVersionId, comments);
		Map<Long,List<EntityComment>> commentsMap = toMapByEntityId(comments);
		for (EntityComment entityComment: comments) {
			Long grantId = entityComment.getEntityId();
			ProductGrant productGrant = existingGrantsMap.get(grantId);
			if (productGrant==null) {
				Long grantCodeId = getGrantCodeId(grantId);
				productGrant = grantsService.createGrant(toFoxVersionId, grantCodeId, userId);
			}
			List<Long> ids = new ArrayList<Long>();
			ids.add(productGrant.getId());
			//now just clone the comment
			List<EntityComment> commentsToCopy = commentsMap.get(entityComment.getEntityId());
			commentsService.cloneWithComments(entityComment.getEntityTypeId(), ids, commentsToCopy, userId, isBusiness);
		}
		
	}
	
	@Override
	public void copy(Long fromFoxVersionId, Long toFoxVersionId,
			XProductCopyData data, String userId, boolean isBusiness)
			throws ErmException {
		if (data.getSubrights()!=null && !data.getSubrights().isEmpty()) {
			copySubrights(toFoxVersionId, data.getSubrights(), userId);
		}
		
	}

}
