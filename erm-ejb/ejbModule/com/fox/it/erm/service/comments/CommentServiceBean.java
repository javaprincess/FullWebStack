package com.fox.it.erm.service.comments;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.fox.it.erm.EntityAttachment;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.ErmProductVersion;
import com.fox.it.erm.Product;
import com.fox.it.erm.ProductVersionHeader;
import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.comments.CommentBase;
import com.fox.it.erm.comments.CommentVersion;
import com.fox.it.erm.comments.CommentWithText;
import com.fox.it.erm.comments.EagerComment;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.comments.EntityCommentOnly;
import com.fox.it.erm.enums.EntityAttachmentType;
import com.fox.it.erm.enums.EntityCommentType;
import com.fox.it.erm.enums.EntityType;
import com.fox.it.erm.grants.Category;
import com.fox.it.erm.grants.GrantCategory;
import com.fox.it.erm.grants.GrantCode;
import com.fox.it.erm.grants.SalesAndMarketingCategory;
import com.fox.it.erm.service.AttachmentsService;
import com.fox.it.erm.service.ErmProductRestrictionService;
import com.fox.it.erm.service.ErmProductVersionService;
import com.fox.it.erm.service.ProductService;
import com.fox.it.erm.service.RightStrandService;
import com.fox.it.erm.service.grants.GrantsProxy;
import com.fox.it.erm.service.grants.GrantsService;
import com.fox.it.erm.service.impl.CommentSearchCriteria;
import com.fox.it.erm.service.impl.EntityCommentOnlySearchCriteria;
import com.fox.it.erm.service.impl.EntityCommentSearchCriteria;
import com.fox.it.erm.service.impl.EntityCommentTypeSearchCriteria;
import com.fox.it.erm.service.impl.ServiceBase;
import com.fox.it.erm.util.BusinessLegal;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
import com.fox.it.erm.util.IdsUtil;
import com.fox.it.erm.util.JPA;
import com.fox.it.erm.util.PDFRender;
import com.fox.it.erm.util.UpdatableProcessor;
import com.fox.it.erm.util.converters.JsonToCommentConverter;
import com.google.common.base.Function;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;


@Stateless
public class CommentServiceBean extends ServiceBase implements CommentsService {
	private static final int IN_LIMIT = JPA.IN_LIMIT;
	private static final Logger logger = Logger.getLogger(CommentServiceBean.class.getName());
	
	private static final  String productCommentsSqlBase = "select ec.* " +
			"from " +
			"entty_cmnt ec, " + 
			"cmnt c " +
			"where EC.CMNT_ID = c.cmnt_Id and " +
			"EC.ENTTY_TYP_ID = "+ EntityType.PRODUCT_VERSION.getId() +" and " +
			"EC.ENTTY_KEY=? and " +
			"EC.ENTTY_CMNT_TYP_ID<>" + EntityCommentType.CLEARANCE_MEMO.getId(); 
	
	private static final String deleteCommentsSqlBase = "delete entty_cmnt where ENTTY_CMNT_ID in ";
	
	private static final String CMNT_ACTIVE_VERSION_SQL = "SELECT * FROM CMNT_VER WHERE prior_cmnt_id = (SELECT MAX(prior_cmnt_id) FROM CMNT_VER WHERE CURR_CMNT_ID = ?)";

	
	
	@Inject
	private EntityManager em;
	
	@Inject
	JsonToCommentConverter commentConverter;
		
	@Inject
	@EJB
	private ProductService productService;
	
	@EJB
	private ErmProductRestrictionService ermProductRestrictionService;
	
	@EJB
	private RightStrandService rightStrandService;	
	
	@Inject
	@EJB
	private ErmProductVersionService ermProductVersionService;
	
	@EJB
	@Inject
	private AttachmentsService attachmentsService;	
	
	@EJB
	private GrantsService ermGrantsService;	
	
	@Inject
	private PDFRender pdfRenderService;	

	private EntityCommentSearchCriteria getEntityCommentsCriteria(){
		return new EntityCommentSearchCriteria(em);
	}
	
	
	private Logger getLogger() {
		return logger;
	}
	

	@Override
	public void linkCommentToEntities(Long commentId, Long entityTypeId,Long entityCommentTypeId,List<Long> ids,String userId) {
		for (Long id: ids) {
			EntityComment entityComment = getEntityComment(entityTypeId, id, entityCommentTypeId, userId,true);
			entityComment.setCommentId(commentId);
			Date now = new Date();
			setCreate(entityComment, userId, now);
			saveEntityComment(entityComment);
		}
		em.flush();	

	}
	
	
	@Override
	public void linkCommentToEntities(Comment comment,Long entityTypeId,Long entityCommentTypeId,List<Long> ids,String userId) {
		if (comment.isNew()) {
			em.persist(comment);
		}
		for (Long id: ids) {
			EntityComment entityComment = getEntityComment(entityTypeId, id, entityCommentTypeId, userId,true);
			entityComment.setComment(comment);
			entityComment.setCommentId(comment.getId());
			Date now = new Date();
			setCreate(entityComment, userId, now);
			saveEntityComment(entityComment);
		}
		em.flush();	

	}
	
	private void setAttachmentsForComments(List<EntityComment> entityComments) {
		List<Long> commentIds = getCommentIdsFromEntityComments(entityComments);
		if (commentIds==null||commentIds.isEmpty()) return;
		List<EntityAttachment> entityAttachments = attachmentsService.findEntityAttachmentsForCommentIds(commentIds);
		Map<Long,List<EntityAttachment>> entityAttachmentByCommentId = new HashMap<>();
		for (EntityAttachment entityAttachment: entityAttachments) {
			Long commentId = entityAttachment.getEntityId();
			List<EntityAttachment> attachments = new ArrayList<>();
			if (entityAttachmentByCommentId.containsKey(commentId)) {
				attachments = entityAttachmentByCommentId.get(commentId);
			} else {
				entityAttachmentByCommentId.put(commentId,attachments);
			}
			attachments.add(entityAttachment);
		}
		for (EntityComment entityComment: entityComments) {
			Long commentId = entityComment.getCommentId();
			if (entityAttachmentByCommentId.containsKey(commentId)) {
				List<EntityAttachment> attachments = entityAttachmentByCommentId.get(commentId); 
				entityComment.setAttachments(attachments);
			}
		}
		


	}
	
	private List<EntityComment> setAttachmentsForEntityComments(List<EntityComment> comments) {		
		for (EntityComment comment : comments) {
			logger.info("findEntityCommentsForProductVersion comment.getId(): " + comment.getId());
			List<EntityAttachment> attachments = attachmentsService.findEntityAttachmentsForEntityTypeAndId(EntityType.COMMENT.getId(), comment.getCommentId(), EntityAttachmentType.COMMENT.getId());
			comment.setAttachments(attachments);
		}
		return comments;
	}
	
	@Override
	public List<EntityAttachment> getAttachmentsComments(Long commentid) {
		return attachmentsService.findEntityAttachmentsForEntityTypeAndId(EntityType.COMMENT.getId(), commentid, EntityAttachmentType.COMMENT.getId());				
	}

	/**
	 * Returns a map with all attachments for a comment
	 */
	@Override
	public Map<Long,List<EntityAttachment>> getAttachmentsComments(List<Long> ids) {
		Map<Long,List<EntityAttachment>> map = new HashMap<>();
		List<EntityAttachment> attachments = attachmentsService.findEntityAttachmentsForCommentIds(ids);
		for (EntityAttachment attachment: attachments) {
			Long commentId = attachment.getEntityId();
			List<EntityAttachment> list = new ArrayList<>();
			if (!map.containsKey(commentId)) {				
				map.put(commentId, list);
			} else {
				list = map.get(commentId);
			}
			list.add(attachment);
		}		
		return map;

	}
	
	@Override
	public List<EntityComment> findEntityCommentsForProductVersion(Long foxVersionId) {
		EntityCommentSearchCriteria criteria = getEntityCommentsCriteria();
		criteria.setEntityTypeId(EntityType.PRODUCT_VERSION.getId().longValue());
		criteria.setEntityId(foxVersionId);
		criteria.addSort("updateDate", false);
		List<EntityComment> comments = criteria.getResultList();
		setAttachmentsForEntityComments(comments);		
		Collections.sort(comments);
		Collections.reverse(comments);
		return comments;
	}
	
	private List<EntityComment> findEntityCommentsByCommentIdsInBatch(List<Long> ids) {
		EntityCommentOnlySearchCriteria criteria = new EntityCommentOnlySearchCriteria(em);
		criteria.setCommentIds(ids);
		criteria.excludeCommentType(EntityCommentType.CLEARANCE_MEMO_MAP.getId());		
		List<EntityCommentOnly> entityCommentsOnly = criteria.getResultList();		
		List<EntityComment> entityComments = new ArrayList<EntityComment>();
		for (EntityCommentOnly ecOnly: entityCommentsOnly) {
			EntityComment entityComment = new EntityComment();
			entityComment.copyFrom(ecOnly);
			entityComments.add(entityComment);
		}
		return entityComments;
		
	}
	
	private List<EntityComment> findEntityCommentsByCommentIds(List<Long> ids) {
		if (ids==null||ids.size()==0) return new ArrayList<>();
		if (ids.size()<=JPA.IN_LIMIT) {
			return findEntityCommentsByCommentIdsInBatch(ids);
		}
		List<EntityComment> all = new ArrayList<>();
		List<List<Long>> lists = Lists.partition(ids, JPA.IN_LIMIT);
		for (List<Long> l: lists) {
			List<EntityComment> entityComments = findEntityCommentsByCommentIdsInBatch(l);
			all.addAll(entityComments);
		}
		return all;
	}
	
	
	private Map<Long,List<EntityComment>> toMapByCommentId(List<EntityComment> entityComments) {
		Map<Long,List<EntityComment>> map = new HashMap<>();
		for (EntityComment ec: entityComments) {
			Long commentId = ec.getCommentId();
			List<EntityComment> lec = new ArrayList<>(); 
			if (!map.containsKey(commentId)) {
				map.put(commentId, lec);
			} else {
				lec = map.get(commentId);
			}
			lec.add(ec);
		}
		return map;
	}
	
	private void setMapList(EntityComment entityComment,List<EntityComment> entityComments) {
		if (entityComments==null||entityComments.isEmpty()) return;
		List<Long> entityKeys = IdsAccumulator.getIds(entityComments, new IdProvider<EntityComment>() {

			@Override
			public Long getId(EntityComment o) {
				return o.getEntityId();
			}

		});
		Long commentId = entityComment.getCommentId();
		HashMap<Long,List<Long>> map = new HashMap<>();
		map.put(commentId, entityKeys);
		entityComment.setEntityIdListMap(map);
	}
	
	private void setEntityCommentIdsToComments(List<EntityComment> list) {
		Set<Long> idsSet = new HashSet<>();
		for (EntityComment ec: list) {
			Long commentId = ec.getCommentId();
			idsSet.add(commentId);
		}
		List<Long> ids = new ArrayList<>();
		ids.addAll(idsSet);
		
		//now find all the entity comments for the ids
		List<EntityComment> entityComments = findEntityCommentsByCommentIds(ids);
		Map<Long,List<EntityComment>> commentsMap = toMapByCommentId(entityComments);
		for (EntityComment c: list) {
			Long commentId = c.getCommentId();
			if (commentsMap.containsKey(commentId)) {
				List<EntityComment> entityCommentsForCommentId = commentsMap.get(commentId);
				setMapList(c, entityCommentsForCommentId);
				boolean isMultiple = entityCommentsForCommentId==null||entityCommentsForCommentId.size()<=1?false:true;
				c.setHasMultipleEntityComments(isMultiple);
				
			} else {
				c.setHasMultipleEntityComments(false);
			}
		}
		
	}
	
	private  void removeDuplicates(List<EntityComment> list) {  
	    Set<Long> set = new HashSet<Long>();  
	    List<EntityComment> newList = new ArrayList<EntityComment>();
	    Long elementCommentId = 0L;
	    List<Long> entityKeyList = new LinkedList<Long>();
	    HashMap<Long, List<Long>> entityIdListMap = new HashMap<Long, List<Long>>();
	    for (Iterator<EntityComment> iter = list.iterator(); iter.hasNext(); ) {  
	      EntityComment element = iter.next();
	      if (elementCommentId != 0 && elementCommentId.longValue() != element.getCommentId().longValue()) {
	    	logger.info("adding key elementCommentId " + elementCommentId.longValue() + " entityKeyList " + entityKeyList);
	    	entityIdListMap.put(elementCommentId,entityKeyList);
	    	entityKeyList = new LinkedList<Long>();
	      }
	      elementCommentId = element.getCommentId();
	      entityKeyList.add(element.getEntityId());
	      if (!iter.hasNext()) {
	    	logger.info("adding final elementCommentId " + elementCommentId + " entityKeyList " + entityKeyList);
	    	entityIdListMap.put(element.getCommentId(), entityKeyList);
	      }
	      if (set.add(element.getCommentId())) {
	        newList.add(element);	        
	      } else {	    	
	        for (EntityComment comment : newList) {	          
	    	  if (comment.getCommentId().equals(element.getCommentId())) {    	    
	    	    comment.setHasMultipleEntityComments(Boolean.TRUE);	    	    	    	   
	    	  }
	        }	        
	      }
	    }
	    for (EntityComment comment : newList) {	      
	      logger.info("comment.getCommentId() " + comment.getCommentId() + " entityIdListMap " + entityIdListMap);
	      comment.getEntityIdListMap().put(comment.getCommentId(), entityIdListMap.get(comment.getCommentId()));
	    }
	    list.clear();  
	    list.addAll(newList);
	    
	    //here set the entity comment ids to comments. This needs to be set for all comments fetched
	    setEntityCommentIdsToComments(list);
	}  
	
	
	public EntityComment findEntityCommentById(Long id) {
		EntityCommentSearchCriteria criteria = getEntityCommentsCriteria();
		criteria.setId(id);		
		EntityComment entityComment = criteria.getSingleResult();		
		return entityComment;
	}
	
	
	
	private List<EntityComment> convertFromEntityCommentOnlyToEntityComment(List<EntityCommentOnly> entityComments) {
		List<EntityComment> comments = new ArrayList<EntityComment>();
		for (EntityCommentOnly ec: entityComments) {
			EntityComment entityComment = new EntityComment();
			entityComment.copyFrom(ec);
			comments.add(entityComment);
		}
		return comments;
	}
	
	private List<EntityComment> findEntityCommentsInBatch(Long entityTypeId, List<Long> ids) {
		//TODO change to entity comment only
		EntityCommentOnlySearchCriteria criteria = new EntityCommentOnlySearchCriteria(em);
		criteria.setEntityTypeId(entityTypeId);
		criteria.setEntityIds(ids);
		criteria.excludeCommentType(EntityCommentType.CLEARANCE_MEMO_MAP.getId());
		criteria.addSort("updateDate", false);
		List<EntityCommentOnly> entityCommentsOnly = criteria.getResultList();
		List<EntityComment> entityComments = convertFromEntityCommentOnlyToEntityComment(entityCommentsOnly);
		Collections.sort(entityComments);
		Collections.reverse(entityComments);
		return entityComments;
	}
	
	private boolean canView(Comment c, boolean isBusiness, boolean canViewPrivateComments) {
		if (c.isPublic()) return true;
		if (!canViewPrivateComments) return false;
		if (isBusiness && c.isBusiness()) return true;
		if (!isBusiness && c.isLegal()) return true;
		return false;
	}
	
	private List<EntityComment> getEntityCommentsWithComments(List<EntityComment> comments) {
		List<EntityComment> filtered = new ArrayList<>();
		for (EntityComment c: comments) {
			if (c.getComment()!=null) {
				filtered.add(c);
			}
		}
		return filtered;
	}
	
	private List<EntityComment> findEntityComments(Long entityTypeId, List<Long> ids,boolean loadComments,boolean isBusiness, boolean canViewPrivateComments) {
		List<EntityComment> entityComments = new ArrayList<EntityComment>();
		if (ids==null||ids.isEmpty()) {
			return entityComments;
		}
		
		if (ids.size()>IN_LIMIT) {
			List<List<Long>> list = Lists.partition(ids, IN_LIMIT);
			for (List<Long> sublist: list) {
				List<EntityComment> batch = findEntityCommentsInBatch(entityTypeId, sublist);
				entityComments.addAll(batch);
			}
		} else {
			entityComments = findEntityCommentsInBatch(entityTypeId, ids);
		}
		entityComments = cloneWithoutComments(entityComments);
		if (loadComments) {
			List<Long> commentIds = getCommentIdsFromEntityComments(entityComments);
			List<Comment> comments = findCommentsWithText(commentIds);
			Map<Long, Comment> commentsMap = toCommentMap(comments); 
			for (EntityComment entityComment:entityComments) {
				Long commentId = entityComment.getCommentId();
				if (commentsMap.containsKey(commentId)) {
					Comment comment = commentsMap.get(commentId);
					boolean canViewComment = canView(comment, isBusiness, canViewPrivateComments);
					if (canViewComment) {
						//get the long description to make sure is fetched
						@SuppressWarnings("unused")
						String longDescription = comment.getLongDescription();
						entityComment.setComment(comment);
					}
				}
			}
			entityComments = getEntityCommentsWithComments(entityComments);
			setAttachmentsForComments(entityComments);			
			
		}

		return entityComments;		 
		
		
		
	}
	
	private List<Long> toList(String[] ids) {
		List<Long> list= new ArrayList<>();
		for (String id: ids) {
			list.add(Long.parseLong(id));
		}
		return list;
	}
	
	/**
	 * Note this method is to get a comment with a blank entity comment shell, to be able to re use the commnets popup
	 * @return
	 */
	public EntityComment findBlankEntityCommentByCommentId(Long commentId) {
		EntityComment entityComment = null;
		List<Long> commentIds = new ArrayList<>();
		commentIds.add(commentId);

		Comment comment = findCommentWithText(commentId);
		if (comment!=null) {
			entityComment = new EntityComment();			
			List<EntityAttachment> entityAttachments = attachmentsService.findEntityAttachmentsForCommentIds(commentIds);
			if (entityAttachments!=null && !entityAttachments.isEmpty()) {
				entityComment.setAttachments(entityAttachments);
			}
			entityComment.setComment(comment);
			entityComment.setCommentId(comment.getId());
		}
		return entityComment;		
	}
	
	@Override
	public List<EntityComment> findEntityCommentsForRightStrands(String[] productInfoCodeIdsArray, String[] rightStrandIdsArray, String[] rightStrandRestrictionIdsArray,boolean isBusiness, boolean canViewPrivateComments) {

		boolean loadComments = true;
		//this is explicitly set to null
//		EntityCommentSearchCriteria criteria = getEntityCommentsCriteria();
		List<EntityComment> comments = new ArrayList<>();
		
		List<Long> productInfoCodeIds = toList(productInfoCodeIdsArray);
		List<Long> rightStrandIds = toList(rightStrandIdsArray);
		List<Long> rightStrandRestrictionIds = toList(rightStrandRestrictionIdsArray);
				
		List<EntityComment> productRestrictionComments = findEntityComments(EntityType.PROD_RSTRCN.getId(), productInfoCodeIds, loadComments,isBusiness, canViewPrivateComments);
		comments.addAll(productRestrictionComments);
		
		List<EntityComment> strandComments = findEntityComments(EntityType.STRAND.getId(), rightStrandIds, loadComments,isBusiness, canViewPrivateComments);
		comments.addAll(strandComments);
		
		List<EntityComment> rightStrandRestrictionComments = findEntityComments(EntityType.STRAND_RESTRICTION.getId(), rightStrandRestrictionIds, loadComments,isBusiness, canViewPrivateComments);
		comments.addAll(rightStrandRestrictionComments);
		
		removeDuplicates(comments);		
		return comments;
	}
	
	@Override
	public List<EntityComment> findEntityComments(Long entityTypeId, Long entityKey,Long entityCommentTypeId) {
		EntityCommentSearchCriteria criteria = getEntityCommentsCriteria();
		criteria.setEntityTypeId(entityTypeId);
		criteria.setEntityId(entityKey);		
		criteria.setCommentTypeId(entityCommentTypeId);
		criteria.addSort("updateDate", false);
		List<EntityComment> comments = criteria.getResultList();
		comments = setAttachmentsForEntityComments(comments);				
		Collections.sort(comments);
		Collections.reverse(comments);
		return comments;		 
	}
	
	private Map<Long,Comment> toCommentMap(List<Comment> comments) {
		return Maps.uniqueIndex(comments, new Function<Comment,Long>() {
			@Override
			public Long apply(Comment comment) {
				return comment.getId();
			}
		});
	}
	
	
	private List<EntityComment> cloneWithoutComments(List<EntityComment> comments) {
		List<EntityComment> cloned = new ArrayList<>();
		for (EntityComment comment: comments) {
			EntityComment clonedEntityComment = new EntityComment();
			clonedEntityComment.copyFromWithoutComment(comment);
			cloned.add(clonedEntityComment);			
		}
		return cloned;
		
	}
	
	@Override
	public List<EntityComment> findEntityComments(Long entityTypeId, Long entityKey,Long entityCommentTypeId,boolean loadComments) {
		EntityCommentSearchCriteria criteria = getEntityCommentsCriteria();
		criteria.setEntityTypeId(entityTypeId);
		criteria.setEntityId(entityKey);
		if (entityCommentTypeId!=null) {
			criteria.setCommentTypeId(entityCommentTypeId);
		}
		criteria.addSort("updateDate", false);
		List<EntityComment> entityComments = criteria.getResultList();		
		Collections.sort(entityComments);
		Collections.reverse(entityComments);
		entityComments = cloneWithoutComments(entityComments);
		if (loadComments) {
			List<Long> commentIds = getCommentIdsFromEntityComments(entityComments);
			List<Comment> comments = findCommentsWithText(commentIds);
			Map<Long, Comment> commentsMap = toCommentMap(comments); 
			for (EntityComment entityComment:entityComments) {
				Long commentId = entityComment.getCommentId();
				if (commentsMap.containsKey(commentId)) {
					Comment comment = commentsMap.get(commentId);
					//get the long description to make sure is fetched					
					String longDescription = comment.getLongDescription();					
					comment.setLongDescription(CustomHTMLCleaner.CleanHTML(longDescription));
					entityComment.setComment(comment);
				}
			}
			
		}
		setAttachmentsForComments(entityComments);
		return entityComments;		 
	}
	
	
	@Override
	public List<EntityComment> findEntityCommentsToCopy(Long foxVersionId,boolean isBusiness) {
		return findHeaderCommentsExceptClearanceMemo(foxVersionId,isBusiness);				
	}
	
	private List<Long> findCommentEntityTypesByCategoryId(Long categoryId) {
		EntityCommentTypeSearchCriteria criteria = new EntityCommentTypeSearchCriteria(em);
		criteria.setCategoryId(categoryId);
		List<com.fox.it.erm.EntityCommentType> commentTypes = criteria.getResultList();
		List<Long> ids = IdsAccumulator.getIds(commentTypes, new IdProvider<com.fox.it.erm.EntityCommentType>() {

			@Override
			public Long getId(com.fox.it.erm.EntityCommentType o) {
				return o.getId();
			}
		});
		return ids;
	}
	
	@Override
	public List<EntityComment> findEntityCommentsForProductVersionByCommentCategory(Long foxVersionId,Long entityCommentCategoryId) {
		List<Long> entityTypeIds = findCommentEntityTypesByCategoryId(entityCommentCategoryId);
		EntityCommentSearchCriteria criteria = new EntityCommentSearchCriteria(em);
		criteria.setEntityCommentTypeIds(entityTypeIds);
		criteria.setFoxVersionId(foxVersionId);
		criteria.addSort("updateDate", false);
		List<EntityComment> comments = criteria.getResultList();			
		Collections.sort(comments);		
		Collections.reverse(comments);
		return comments;
	}
	
	@Override 
	public List<EntityComment> findEntityCommentsByIdsAndCommentType(List<Long> entityTypeIds, List<Long> commentIds, Long entityCommentTypeId) {
		logger.info("findEntityCommentsForCommentIds: commentIds " + commentIds);
		if (commentIds==null||commentIds.isEmpty()) {
			return new ArrayList<EntityComment>();
		}
		EntityCommentSearchCriteria criteria = getEntityCommentsCriteria();
		criteria.setEntityTypeIds(entityTypeIds);
		criteria.setCommentIds(commentIds);		
		criteria.setCommentTypeId(entityCommentTypeId);
		criteria.addSort("updateDate", false);
		List<EntityComment> comments = criteria.getResultList();
		Collections.sort(comments);		
		Collections.reverse(comments);
		return comments;
	}
	
	@Override 
	public List<EntityComment> findEntityCommentsForCommentIds(Long entityTypeId, List<Long> commentIds, Long entityCommentTypeId) {
		logger.info("findEntityCommentsForCommentIds: commentIds " + commentIds);
		if (commentIds==null||commentIds.isEmpty()) {
			return new ArrayList<EntityComment>();
		}
		EntityCommentSearchCriteria criteria = getEntityCommentsCriteria();
		criteria.setEntityTypeId(entityTypeId);
		criteria.setCommentIds(commentIds);		
		criteria.setCommentTypeId(entityCommentTypeId);
		criteria.addSort("updateDate", false);
		List<EntityComment> comments = criteria.getResultList();
		Collections.sort(comments);		
		Collections.reverse(comments);
		return comments;
	}
	
	@Override
	public HashMap<Long,BusinessLegal> getReviewedByBusiessLegalMapForCommentIds(List<Long> commentIds) {
		HashMap<Long,BusinessLegal> map = new HashMap<>();
		if (commentIds==null||commentIds.isEmpty()) return map;
		String idsAsString = IdsUtil.getIdsAsListInParenthesis(commentIds);
		String sql = "select cv.* From cmnt_ver cv, " +
					 "(SELECT CURR_CMNT_ID,MAX(prior_cmnt_id) max_prior_id " +
					 "  FROM CMNT_VER " +
					 "	where CURR_CMNT_ID IN " + idsAsString +
					 "	group by CURR_CMNT_ID) m " +
					 "where " +
					 "CV.prior_cmnt_Id = max_prior_id";
		Query query = em.createNativeQuery(sql, CommentVersion.class);
		JPA.setNoCacheHints(query);
		@SuppressWarnings("unchecked")
		List<CommentVersion> commentVersions = query.getResultList();
		Map<Long,CommentVersion> commentVersionsById = Maps.uniqueIndex(commentVersions, new Function<CommentVersion,Long>(){

			@Override
			public Long apply(CommentVersion c) {
				return c.getCurrentCommentId();
			}
			
		});
		
		for (Long commentId: commentIds) {
			boolean reviewedByBusiness = true;
			boolean reviewedByLegal = true;
			CommentVersion cv = commentVersionsById.get(commentId);
			if (cv!=null) {
				reviewedByBusiness = cv.isReviewedByBusiness();
				reviewedByLegal = cv.isReviewedByLegal();		
			}
			BusinessLegal bl = new BusinessLegal(reviewedByBusiness, reviewedByLegal);
			map.put(commentId,bl);
		}
		return map;
	}
		
	@SuppressWarnings("unchecked")
	@Override
	public HashMap<Long, Boolean> getReviewedByLegalMapForCommentIds(List<Long> commentIds) {
		//TODO re implement optimize 
		HashMap<Long, Boolean> reviewedByLegalMap = new HashMap<Long, Boolean>(); 
		for (Long commentId : commentIds) {
		 //"SELECT * FROM CMNT_VER WHERE prior_cmnt_id = (SELECT MAX(prior_cmnt_id) FROM CMNT_VER WHERE CURR_CMNT_ID = ?)";
		  Query q = em.createNativeQuery(CMNT_ACTIVE_VERSION_SQL, CommentVersion.class);
		  setNoCacheHints(q);							  
		  q.setParameter(1, commentId);		  		  
		  List<CommentVersion> commentVersions = q.getResultList();
		  for (CommentVersion commentVersion : commentVersions) {
		    if (commentVersion != null)
			  reviewedByLegalMap.put(commentId, commentVersion.isReviewedByLegal());
		    else
			  reviewedByLegalMap.put(commentId, true);
		  }		  
		}
		return reviewedByLegalMap;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	@Deprecated
	public HashMap<Long, Boolean> getReviewedByBusinessMapForCommentIds(List<Long> commentIds) {
		HashMap<Long, Boolean> reviewedByBusinessMap = new HashMap<Long, Boolean>(); 
		for (Long commentId : commentIds) {
		  Query q = em.createNativeQuery(CMNT_ACTIVE_VERSION_SQL, CommentVersion.class);
		  setNoCacheHints(q);
		  q.setParameter(1, commentId);
		  List<CommentVersion> commentVersions = q.getResultList();
		  for (CommentVersion commentVersion : commentVersions) {
		    if (commentVersion != null)
		      reviewedByBusinessMap.put(commentId, commentVersion.isReviewedByBusiness());
		    else
		      reviewedByBusinessMap.put(commentId, true);
		  }		  
		}
		return reviewedByBusinessMap;
	}
	
	@Override 
	public void getCommentMapComments(HashMap<Long, List<Long>> entityCommentMap, Long entityTypeId, List<EntityComment> comments) {
	  //entity comment map is mapped by comment id

	  for (EntityComment comment : comments) {
		List<Long> mappedEntities = new LinkedList<Long>();		  
		Long entityId = comment.getEntityId();
		Long commentId = comment.getCommentId();
		Long commentEntityTypeId = comment.getEntityTypeId(); 
		if (entityTypeId.equals(commentEntityTypeId)) {
			if (entityCommentMap.containsKey(commentId)) {
				mappedEntities = entityCommentMap.get(commentId);
			} else {
				entityCommentMap.put(commentId, mappedEntities);
			}
			mappedEntities.add(entityId);
		}
	  }
	}	
	
	@Override 
	public List<EntityComment> getCommentMapComments(List<Long> entityTypeIds, List<Long> commentIds, Long entityCommentTypeId) {	
		List<EntityComment> comments = findEntityCommentsByIdsAndCommentType(entityTypeIds, commentIds, entityCommentTypeId);
		return comments;
	}
	
	@Override 
	public HashMap<Long, List<Long>> getCommentMapForEntityIds(Long entityTypeId, List<Long> commentIds, Long entityCommentTypeId) {	
		List<EntityComment> comments = findEntityCommentsForCommentIds(entityTypeId, commentIds, entityCommentTypeId);
		HashMap<Long, List<Long>> entityCommentMap = new HashMap<Long, List<Long>>();
		long currentCommentId = 0l;
		List<Long> mappedEntities = new LinkedList<Long>();
		for (EntityComment comment : comments) {
		  if (comment.getCommentId() != currentCommentId && currentCommentId != 0) {			
			entityCommentMap.put(currentCommentId, mappedEntities);
			logger.info("findEntityCommentsForCommentIds: currentCommentId " + currentCommentId + " mappedEntities : " + entityCommentMap.get(currentCommentId));
			mappedEntities = new LinkedList<Long>();			
		  }
		  currentCommentId = comment.getCommentId();
		  mappedEntities.add(comment.getEntityId());
		}		
		entityCommentMap.put(currentCommentId, mappedEntities);
		logger.info("currentCommentId: " + currentCommentId + " entityCommentMap: " + entityCommentMap.get(currentCommentId));
		logger.info("entityCommentMap: " + entityCommentMap);
		return entityCommentMap;						
	}
	 
	@Override
	public List<EntityComment> findEntityCommentsForProductVersion(Long foxVersionId,Long entityCommentTypeId) {
		EntityCommentSearchCriteria criteria = getEntityCommentsCriteria();
		criteria.setEntityTypeId(EntityType.PRODUCT_VERSION.getId().longValue());
		criteria.setEntityId(foxVersionId);
		criteria.setCommentTypeId(entityCommentTypeId);
		List<EntityComment> comments = criteria.getResultList();
		return comments;		
	}
	
	private List<EntityComment> findEntityCommentsInBatch(Long entityTypeId,List<Long> ids,  Long entityCommentTypeId) {
		EntityCommentSearchCriteria criteria = getEntityCommentsCriteria();
		criteria.setEntityTypeId(entityTypeId);
		criteria.setEntityIds(ids);
		criteria.setCommentTypeId(entityCommentTypeId);
		List<EntityComment> comments = criteria.getResultList();
		return comments;								
	}
	
	@Override 
	public List<EntityComment> findEntityComments(Long entityTypeId,List<Long> ids,  Long entityCommentTypeId) {	
		List<EntityComment> all = new ArrayList<>();
		if (ids.size()<=JPA.IN_LIMIT) {
			all = findEntityCommentsInBatch(entityTypeId,ids,entityCommentTypeId);
		} else {
			List<List<Long>> lists = Lists.partition(ids, JPA.IN_LIMIT);
			for (List<Long> list: lists) {
				List<EntityComment> entityComments = findEntityCommentsInBatch(entityTypeId, list, entityCommentTypeId);
				all.addAll(entityComments);
			}
		}
		return all;
	}
	
	@Override
	public Comment saveComment(Comment comment,String userId, boolean isBusiness)  {
		setUserInDBContext(userId, isBusiness);
		UpdatableProcessor.setUserIdAndTypeIndicator(comment, userId, isBusiness, !isBusiness,  new java.util.Date());					
		if (comment.getLongDescription()!=null) {			
			String text = comment.getLongDescription();		
			if (text != null) {
			 comment.setLongDescription(CustomHTMLCleaner.CleanHTML(text));
			}			
		}
		if (comment.getId()==null) {
			em.persist(comment);
		} else {
			Comment savedComment = em.find(Comment.class, comment.getId());
			comment.setCreateDate(savedComment.getCreateDate());
			comment.setCreateName(savedComment.getCreateName());
			em.merge(comment);
		}
		em.flush();
		return comment;
	}	

	@Override
	public EntityComment addCommentToProductVersion(Long foxVersionId,
			Long entityCommentTypeId, Comment comment,String userId,boolean isBusiness)  {
		Long productVersionEntityType = new Long(EntityType.PRODUCT_VERSION.getId().longValue());
		return addNewComment(productVersionEntityType, foxVersionId, entityCommentTypeId, comment, userId, isBusiness);		
	}
	
	@Override
	public EntityComment addCommentToRightStrand(Long rightStrandId,Long commentTypeId,Comment comment, String userId, boolean isBusiness) throws ErmException {
		Long strandEntityType = new Long(EntityType.STRAND.getId().longValue());
		return addNewComment(strandEntityType,rightStrandId,commentTypeId,comment,userId,isBusiness);
	}
	
	@Override
	public EntityComment addCommentToRightStrand(Long rightStrandId,Comment comment, String userId, boolean isBusiness) throws ErmException {
		Long commentTypeId = EntityCommentType.RIGHT_STRAND_COMMENT.getId();
		comment.setCommentTypeId(commentTypeId);
		return addCommentToRightStrand(rightStrandId, commentTypeId, comment, userId, isBusiness);
	}

	@Override
	public EntityComment addCommentToProductInfoCode(Long productRestrictionId,Long commentTypeId,Comment comment, String userId, boolean isBusiness) throws ErmException {
		Long strandEntityType = new Long(EntityType.PROD_RSTRCN.getId().longValue());
		return addNewComment(strandEntityType,productRestrictionId,commentTypeId,comment,userId,isBusiness);
	}

	@Override
	public EntityComment addCommentToProductInfoCode(Long productRestrictionId,Comment comment, String userId, boolean isBusiness) throws ErmException {
		Long commentTypeId = EntityCommentType.INFO_CODE.getId();
		return addCommentToProductInfoCode(productRestrictionId, commentTypeId, comment, userId, isBusiness);
		
	}
	
	

	
	private EntityComment getEntityComment(Long entityTypeId,Long entityKey,Long entityCommentTypeId,String userId,boolean setCommentSequence) {

		EntityComment entityComment = new EntityComment();
		entityComment.setEntityId(entityKey);
		entityComment.setEntityTypeId(entityTypeId);
		entityComment.setEntityCommentTypeId(entityCommentTypeId);
		if (setCommentSequence) {
			Long maxCommentSeq = getMaxEntityCommentSeq(entityTypeId, entityKey,entityCommentTypeId);		
			entityComment.setCommentSequence(maxCommentSeq+1);
		}
		return entityComment;
		
	}
	
	public EntityComment saveEntityComment(EntityComment entityComment) {
		EntityComment saved = em.merge(entityComment);
		return saved;
	}
	
	private void setCreate(EntityComment entityComment,String userId,Date date) {
		entityComment.setCreateName(userId);
		entityComment.setUpdateName(userId);
		entityComment.setCreateDate(date);
		entityComment.setUpdateDate(date);
		
	}
	
	@Override
	public EntityComment addNewComment(Long entityTypeId, Long entityKey,
			Long entityCommentTypeId, Comment comment,String userId, boolean isBusiness)  {
		//first create the comment
		Comment saved = saveComment(comment, userId, isBusiness);
		Long commentId = saved.getId();
		//then create the entity relationship
		EntityComment entityComment = getEntityComment(entityTypeId, entityKey, entityCommentTypeId, userId,true);
		entityComment.setComment(saved);
		entityComment.setCommentId(commentId);
		Date now = new Date();
		setCreate(entityComment, userId, now);
		EntityComment savedEntityComment =saveEntityComment(entityComment);
		em.flush();
		return savedEntityComment;
	}

	@Override
	public Long addNewStrandComment(String[] productInfoCodeIdsArray, 
			String[] rightStrandIdsArray, 
			String[] rightStrandRestrictionIdsArray, Comment comment,String userId, boolean isBusiness)  {
		//first create the comment
		Comment saved = saveComment(comment, userId, isBusiness);
		Long commentId = saved.getId();
		//then create the entity relationships
		if (productInfoCodeIdsArray != null) {
		  for (String productInfoCodeId : productInfoCodeIdsArray) {
			logger.log(Level.SEVERE,"saving entity comment for productInfoCodeId : " + productInfoCodeId);
			EntityComment entityComment = getEntityComment(EntityType.PROD_RSTRCN.getId(), Long.parseLong(productInfoCodeId), EntityCommentType.INFO_CODE.getId(), userId,true);
			entityComment.setComment(saved);
			entityComment.setCommentId(commentId);
			Date now = new Date();
			setCreate(entityComment, userId, now);
			saveEntityComment(entityComment);
			em.flush();	
		  }
		}
		if (rightStrandIdsArray != null) {
		  for (String rightStrandId : rightStrandIdsArray) {
			logger.log(Level.SEVERE,"saving entity comment for strand id : " + rightStrandId);
			EntityComment entityComment = getEntityComment(EntityType.STRAND.getId(), Long.parseLong(rightStrandId), EntityCommentType.RIGHT_STRAND_COMMENT.getId(), userId,true);
			entityComment.setComment(saved);
			entityComment.setCommentId(commentId);
			Date now = new Date();
			setCreate(entityComment, userId, now);
			saveEntityComment(entityComment);
			em.flush();	
		  }
		}
		if (rightStrandRestrictionIdsArray != null) {
		  for (String rightStrandRestrictionId : rightStrandRestrictionIdsArray) {
			logger.log(Level.SEVERE,"saving entity comment for strand restriction id : " + rightStrandRestrictionId);
			EntityComment entityComment = getEntityComment(EntityType.STRAND_RESTRICTION.getId(), Long.parseLong(rightStrandRestrictionId), EntityCommentType.INFO_CODE.getId(), userId,true);
			entityComment.setComment(saved);
			entityComment.setCommentId(commentId);
			Date now = new Date();
			setCreate(entityComment, userId, now);
			saveEntityComment(entityComment);
			em.flush();	
		  }
		}
		return commentId;
	}
	
	@Override
	public Long getMaxEntityCommentSeq(Long entityTypeId, Long entityKey,Long entityCommentTypeId) {
//		String ql = "select max(e.commentSequence) from EntityComment e";
		String ql = "select max(e.commentSequence) from EntityComment e where e.entityTypeId=:entityTypeId and e.entityId=:entityKey and e.entityCommentTypeId=:entityCommentTypeId";
		Query q = em.createQuery(ql);
		q.setParameter("entityTypeId", entityTypeId);
		q.setParameter("entityKey", entityKey);
		q.setParameter("entityCommentTypeId", entityCommentTypeId);
		Long seq = (Long)q.getSingleResult();
		if (seq==null) {
			seq=0L;
		}
		return new Long(seq.longValue());
	}
	
	public Long getNextCommentSequence(Long entityTypeId, Long entityKey,Long entityCommentTypeId) {
		return getMaxEntityCommentSeq(entityTypeId, entityKey,entityCommentTypeId) + 1;
	}

	@Override
	public String getText(Long commentId) {
		String text = "";
		// need try catch in case single result set does not return a result
		try {
		  String sql  = "Select cmnt_lng_desc from cmnt where cmnt_id = ?";
		  Query q = em.createNativeQuery(sql).setParameter(1, commentId);
		  text = (String)  q.getSingleResult();		
		} catch (Exception e) {			
		}
		return text;
//		String text = "";
//		Comment comment = em.find(Comment.class, commentId);
//		if (comment != null)
//		  text = comment.getLongDescription();
//		return text;		
	}

	private List<Comment> cloneComments(List<? extends CommentBase> comments,boolean includeText) {
		List<Comment> clonedList = new ArrayList<>();
		for (CommentBase c: comments) {
			Comment cloned  = new Comment();
			cloned.copyFrom(c, includeText);
			clonedList.add(cloned);
		}
		return clonedList;
	}
	
	public List<Comment> findCommentsWithTextInBatch(List<Long> ids) {
		if (ids==null||ids.size()==0) return new ArrayList<>();
		String in = IdsUtil.getIdsAsListInParenthesis(ids);
		String sql = "Select * from CMNT where cmnt_id in " + in;
		Query q = em.createNativeQuery(sql,EagerComment.class);
		setNoCacheHints(q);
		@SuppressWarnings("unchecked")
		List<EagerComment> comments = (List<EagerComment>)q.getResultList();
		List<Comment> cloned = cloneComments(comments, true);
		return cloned;
		
	}
	

	
	public List<Comment> findCommentsWithText(List<Long> ids) {
		if (ids==null||ids.isEmpty()) return new ArrayList<>();
		//get the unique elements
		ids =  IdsUtil.unique(ids);
		if (ids.size()<=JPA.IN_LIMIT) {
			return findCommentsWithTextInBatch(ids);
		}
		List<Comment> all = new ArrayList<>(JPA.IN_LIMIT);
		List<List<Long>> lists = Lists.partition(ids, JPA.IN_LIMIT);
		for (List<Long> l : lists) {
			List<Comment> comments = findCommentsWithTextInBatch(l);
			all.addAll(comments);
		}
		return all;
	}
	
	@Override
	public void generatePDFOutputStream(InputStream cssStream, OutputStream os, Long foxVersionId, Long grantCodeId, String qualifiedURLPrefix, String fullyQualifiedURL) throws IOException {
	  try {    
		  String clearanceMemoHTML = getCommentsHTML(foxVersionId, grantCodeId, false, true, qualifiedURLPrefix, fullyQualifiedURL);  		  		  		  
		  String formatedstring = clearanceMemoHTML;		  
		  InputStream hTMLStream = new ByteArrayInputStream(formatedstring.getBytes());	               	     
	      pdfRenderService.writePdfToOutputStream(os, hTMLStream, cssStream, "Comments", true, fullyQualifiedURL);	      
	  } catch (Exception e) {
		logger.log(Level.SEVERE, "DocumentException creating PDF	: " + e.getLocalizedMessage());
	  }
	}
	
	public String getCommentsHTML(Long foxVersionId, Long grantCodeId, boolean printOnLoad, boolean isPDF, String qualifiedURLPrefix, String fullyQualifiedURL) {
		StringBuilder stringBuilder = new StringBuilder();		
		try {
			ProductVersionHeader version = productService.findProductVersionHeaderById(foxVersionId);
			logger.info("version " + version);
			ErmProductVersion emrProductVersion = ermProductVersionService.findById(foxVersionId);
			if(emrProductVersion == null)
			  emrProductVersion = new ErmProductVersion();		
			Product product = null;
			if (version != null)
			  product = productService.findById(version.getFoxId());				
			if (grantCodeId == 0)
			  grantCodeId = -1L;
			GrantsProxy grants = this.ermGrantsService.findAllCommentsForGrant(foxVersionId, grantCodeId);			
			List<EntityComment> comments = grants.getCommentList();
			if(comments != null && comments.size() > 0){
			  for (EntityComment comment : comments) {
				List<EntityAttachment> attachments = attachmentsService.findEntityAttachmentsForEntityTypeAndId(EntityType.COMMENT.getId().longValue(), comment.getCommentId(), EntityAttachmentType.COMMENT.getId());
				comment.setAttachments(attachments);
			  }
			}			
			stringBuilder.append("<!DOCTYPE html>\n");			  
			stringBuilder.append("<html>\n");
			stringBuilder.append("<head>\n");
			if (!isPDF) {
			  stringBuilder.append("<meta charset=\"utf-8\"/>\n");
			  stringBuilder.append("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"/>\n");
			}
			if (!isPDF) {							      	   
			  stringBuilder.append("<link rel=\"stylesheet\" href=\"/erm/css/comments-html.css\"/>\n");
		    stringBuilder.append("<link rel=\"stylesheet\" href=\"/erm/css/clearance-memo-toc.css\"/>\n");
		    stringBuilder.append("<link rel=\"stylesheet\" media=\"screen\" href=\"/erm/font-awesome/css/font-awesome.min.css\"/>\n");
		    stringBuilder.append("<script src=\"/erm/js/paths.js\"></script>\n");
		    stringBuilder.append("<script src=\"/erm/js/jquery.min.js\"></script>\n");
		    stringBuilder.append("<script src=\"/erm/js/clearance-memo-toc.js?_=" + System.currentTimeMillis() + "\"></script>  \n");
		    stringBuilder.append("<script type=\"text/javascript\">");
			stringBuilder.append("var foxVersionId = " + foxVersionId + ";\n");
			stringBuilder.append("var grantCodeId = " + grantCodeId + ";\n");
			stringBuilder.append("$(function() {\n");
			stringBuilder.append("setupToolbarButtons();\n");			      
			stringBuilder.append("});");
		    stringBuilder.append("</script>");			  						
			}			
			stringBuilder.append("</head>\n");
			stringBuilder.append("<body>\n");
			if (!isPDF) {							  							
			  stringBuilder.append("<div class=\"toolBarButton\" style=\"position: relative;\">\n");
			  stringBuilder.append("<a href=\"#\" title=\"Print\" id=\"print-comments\"><span class=\"icon-print\"> </span><span>Print</span></a>\n");
			  stringBuilder.append("</div>\n");
			  stringBuilder.append("<div class=\"toolBarButton\" style=\"position: relative; left: 10%;\">\n");
			  stringBuilder.append("<a href=\"#\" title=\"PDF\" id=\"download-comments\"><span class=\"icon-book\"> </span><span>PDF</span></a>\n");
			  stringBuilder.append("</div>\n");
			  stringBuilder.append("</div>\n");			  
			}
			stringBuilder.append("<div class=\"commentContent\">\n");
			
			// load description from product grants
			GrantsProxy productGrants = ermGrantsService.findAllProductGrants(foxVersionId, grantCodeId, 0);
			String grantDescription = "PROMOTIONAL MATERIAL";			
			for (GrantCode grantCode : productGrants.getGrantCodeList()) {
				if (grantCode.getId() == grantCodeId) {
					grantDescription = grantCode.getDescription();
				}
			}
			
			stringBuilder.append("<p class=\"legalClearanceTitle\" align=\"center\" style=\"text-align: left;\">");
			stringBuilder.append(product.getTitle() != null ? product.getTitle().toUpperCase() : "");
			stringBuilder.append("  ");
			stringBuilder.append(product.getProductionYear() != null ? "(" + product.getProductionYear() + ")" : "");
			stringBuilder.append("</p>\n");
			stringBuilder.append("<p class=\"legalClearanceTitle\" align=\"center\" style=\"text-align: left;\">" + grantDescription + " COMMENTS</p>\n");
			stringBuilder.append("\n<BR/><BR/>\n");											
			stringBuilder.append("<div class=\"commentsContent\">");
			// add public comments						
			logger.log(Level.SEVERE, "productGrants.getProductGrantList() %o", productGrants.getProductGrantList());			
			if(comments != null && comments.size() > 0){
			  if (grantCodeId == -1l) {
				List<Category> categoryList = productGrants.getGrantCategoryList();				
				List<SalesAndMarketingCategory> salesAndMarketingCategies = new ArrayList<SalesAndMarketingCategory>();
				List<GrantCategory> grantCategories = new ArrayList<GrantCategory>();
				for (Category category : categoryList) {
					if (category instanceof GrantCategory) {
					  grantCategories.add((GrantCategory)category);
					} else if (category instanceof SalesAndMarketingCategory) {
					  salesAndMarketingCategies.add((SalesAndMarketingCategory)category);
					}
				}
				Collections.sort(salesAndMarketingCategies);
				Collections.sort(grantCategories);
				for (GrantCategory category : grantCategories) {				  
				  for (EntityComment comment : comments) {
					String categoryDescription = category.getDescription();
					Long categoryId = category.getId();										
					logger.log(Level.SEVERE, "categoryDescription " +  categoryDescription);
					logger.log(Level.SEVERE, "categoryId " +  categoryId + " comment.getComment().getCategoryId() " + comment.getPromoMaterialId());						
					if (comment.getComment().getPublicInd() == 1 && categoryId == comment.getPromoMaterialId()) {							
						stringBuilder.append("<div class=\"subrights_HeaderClass\">");
						stringBuilder.append(categoryDescription);
						stringBuilder.append("</div>");
						stringBuilder.append("<div class=\"header\">");
						stringBuilder.append("<div class=\"contentTitle\">");
						stringBuilder.append("<span class=\"underline\">");
						stringBuilder.append(comment.getComment().getShortDescription());
						stringBuilder.append("</span>");
						stringBuilder.append("</div>");
						stringBuilder.append("<div class=\"headerContent\">");
						stringBuilder.append(comment.getComment().getLongDescription());						  					  					
						if (comment.getAttachments() != null && comment.getAttachments().size() > 0) {							
						  stringBuilder.append("<div class=\"contentAttachments\">");
						  for (int i = 0; i < comment.getAttachments().size(); i++) {
							stringBuilder.append("<br></br>");
						    stringBuilder.append("<a href=\"" + qualifiedURLPrefix + "/rest/Comments/getAttachment/" + comment.getAttachments().get(i).getDocumentId() + "/" + comment.getAttachments().get(i).getAttachmentName() + "\" target=\"_blank\">");
						    stringBuilder.append(comment.getAttachments().get(i).getAttachmentName());
					        stringBuilder.append("</a>");			        
					      }
					      stringBuilder.append("</div>");	
					    }
					    stringBuilder.append("</div>");				  
					    stringBuilder.append("</div>");
					    stringBuilder.append("<br/>");
					}
				  }
				}
			  } else {				 				 
				for (EntityComment comment : comments) {																							
				  if (comment.getComment().getPublicInd() == 1) {
					stringBuilder.append("<div class=\"header\">");
					stringBuilder.append("<div class=\"contentTitle\">");
					stringBuilder.append("<span class=\"underline\">");
					stringBuilder.append(comment.getComment().getShortDescription());
					stringBuilder.append("</span>");
					stringBuilder.append("</div>");
					stringBuilder.append("<div class=\"headerContent\">");
					stringBuilder.append(comment.getComment().getLongDescription());						  					  					
					if (comment.getAttachments() != null && comment.getAttachments().size() > 0) {		  
					  stringBuilder.append("<div class=\"contentAttachments\">");
					  for (int i = 0; i < comment.getAttachments().size(); i++) {
					    stringBuilder.append("<a href=\"" + qualifiedURLPrefix + "/rest/Comments/getAttachment/" + comment.getAttachments().get(i).getDocumentId() + "/" + comment.getAttachments().get(i).getAttachmentName() + "\" target=\"_blank\">");
					    stringBuilder.append(comment.getAttachments().get(i).getAttachmentName());
				        stringBuilder.append("</a>");				      stringBuilder.append("<br/>");
				      }
				      stringBuilder.append("</div>");	
				    }
				    stringBuilder.append("</div>");				  
				    stringBuilder.append("</div>");
				    stringBuilder.append("<br/>");
				  }
				}					
			  }
			}
		    stringBuilder.append("</div>\n");		
			stringBuilder.append("</div>\n");
			stringBuilder.append("</body>\n");
			stringBuilder.append("</html>\n");
		} catch(Exception e) {
			logger.log(Level.SEVERE, "Exception getting HTML for comments %o", e);
		}
		return stringBuilder.toString();
	}
	
	@Override
	public List<Comment> findComments(List<Long> ids) {
		if (ids==null||ids.size()==0) return new ArrayList<>();
		CommentSearchCriteria criteria = new CommentSearchCriteria(em);
		return criteria.setIds(ids).getResultList();
	}
	
	public List<Comment> findComments(List<Long> ids,boolean isBusiness) {
		if (ids==null||ids.size()==0) return new ArrayList<>();
		CommentSearchCriteria criteria = new CommentSearchCriteria(em);
		criteria.setIds(ids);
		if (isBusiness) {
			criteria.setIsBusiness();
		} else {
			criteria.setIsLegal();
		}
		return criteria.getResultList();
	}
	
	
	@Override
	public Comment findCommentById(Long id) {		
		CommentSearchCriteria criteria = new CommentSearchCriteria(em);
		Comment comment = criteria.setId(id).getSingleResult(); 
		return comment;		 
	}
	
	@Override
	public Comment findCommentWithText(Long id) {
		String sql = "Select * from cmnt where cmnt_id=?";
		Query query = em.createNativeQuery(sql,CommentWithText.class);
		query.setParameter(1, id);
		JPA.setNoCacheHints(query);		
		@SuppressWarnings("unchecked")
		List<CommentWithText> commentsWithText = query.getResultList();
		if (commentsWithText==null||commentsWithText.isEmpty()) return null;
		CommentWithText c = commentsWithText.get(0);
		Comment comment = new Comment();
		comment.copyBasicFrom(c);
		comment.copyTextFrom(c);
		return comment;
		
	}
	
	@Override
	public void setTitle(Long commentId, String title,String userId, boolean isBusiness) throws ErmException {
		Comment comment = em.find(Comment.class, commentId);
		if (comment!=null) {
			UpdatableProcessor.setUserIdAndTypeIndicator(comment, userId, isBusiness, !isBusiness,  new java.util.Date());
			comment.setShortDescription(title);
		}
		em.flush();
	}
	
	@Override
	public void setText(Long commentId,String text, int commentStatus, int publicIndicator,String userId,boolean isBusiness) throws ErmException {
		Comment comment = findComment(commentId);
		if (comment!=null) {
			UpdatableProcessor.setUserIdAndTypeIndicator(comment, userId, isBusiness, !isBusiness,  new java.util.Date());					
			String cleanedText = CustomHTMLCleaner.CleanHTML(text);
			comment.setLongDescription(cleanedText);
			comment.setPublicInd(publicIndicator);
			comment.setCommentStatus(commentStatus);
		}
		em.flush();
		
	}
	
	private Comment findComment(Long id) {
		Comment comment = em.find(Comment.class, id);
		return comment;
	}
	
	/**
	 * Copies the long description from one comment to another using raw SQL to avoid
	 * round trips of a CLOB from oralce to Java
	 * @param fromCommentId
	 * @param toCommentId
	 */
	private void updateText(Long fromCommentId,Long toCommentId) {
		getLogger().info("Updating text of comment " + toCommentId + " from comment " + fromCommentId);
		String sql = "Update cmnt set cmnt_lng_desc = (select cmnt_lng_desc from cmnt where cmnt_id =?) where cmnt_id=?";
		Query query = em.createNativeQuery(sql);
		query.setParameter(1,fromCommentId);
		query.setParameter(2, toCommentId);
		int updated = query.executeUpdate();
		getLogger().info("Updated text of " + updated + " comments");
		
	}
	
	private Long copy(Comment comment, String userId, boolean isBusiness)  {		 
	  Comment newComment = new Comment();
	  newComment.copyBasicFrom(comment);
	  UpdatableProcessor.setUserIdAndTypeIndicator(newComment, userId, isBusiness, !isBusiness, new Date());
	  em.persist(newComment);
	  em.flush();
	  Long newCommentId = newComment.getId();
	  updateText(comment.getId(),newCommentId);
	  return newCommentId;		
	}
	
	private Long copy(Long commentId,String userId)  {
		 Comment comment = findComment(commentId);
		 boolean isBusiness = comment.isBusiness();
		 return copy(comment,userId,isBusiness);
		
	}
	
	@Override
	public Long copy(Long commentId,String userId, boolean isBusiness) throws ErmException {
		 Comment comment = findComment(commentId);
		 return copy(comment,userId,isBusiness);
	}
		
	public Long addComment(String json, 
			String userId,
			Long entityTypeId,
			Long entityKey,  
			Long commentTypeId,
			boolean isBusiness) throws ErmException {		
		Comment comment = commentConverter.convert(json);
		logger.info("this is the comment's short description: " + comment.getShortDescription());
		logger.info("comment type id: " + commentTypeId);
		return addNewComment(entityTypeId, entityKey, commentTypeId, comment, userId, isBusiness).getCommentId();
	}
	
	public Long addStrandComment(String json, 
			String userId,
			String[] productInfoCodeIdsArray, 
			String[] rightStrandIdsArray, 
			String[] rightStrandRestrictionIdsArray,
			boolean isBusiness) throws ErmException {		
		Comment comment = commentConverter.convert(json);
		logger.info("this is the comment's short description: " + comment.getShortDescription());
		return addNewStrandComment(productInfoCodeIdsArray, rightStrandIdsArray, rightStrandRestrictionIdsArray, comment, userId, isBusiness);
	}	

   private Map<Long,List<EntityComment>> getEntityCommentsMapByEntityKeys(List<EntityComment> entityComments) {
	 Map<Long,List<EntityComment>> map = new HashMap<Long, List<EntityComment>>();
	 for (EntityComment comment: entityComments) {
		 List<EntityComment> comments = null;
		 if (!map.containsKey(comment.getEntityId())) {
			 comments = new ArrayList<>();
			 map.put(comment.getEntityId(),comments);
		 } else {
			 comments = map.get(comment.getEntityId());
		 }
		 comments.add(comment);
	 }
	 return map;
   }

   private Map<Long,List<EntityComment>> getEntityCommentsMapByEntityKeys(Long entityTypeId,List<Long> ids,Long entityCommentTypeId) {
	   return getEntityCommentsMapByEntityKeys(findEntityComments(entityTypeId, ids, entityCommentTypeId));
   }
   
   private boolean isMapped(List<EntityComment> entityComments, Long id, Long commentId) {
	   if (entityComments==null||entityComments.size()==0) return false;
	   for (EntityComment entityComment: entityComments) {
		   if (id.equals(entityComment.getEntityId()) &&
			   commentId.equals(entityComment.getCommentId())) {
			   return true;
		   }
	   }
	   return false;
   }
   
   
   @Override
   public List<EntityComment> map(Long entityTypeId,List<Long> ids,List<Long> commentIds, Long entityCommentTypeId, String userId, boolean isBusiness) {
	 //first fetch to see if the mapping exists
	 Map<Long,List<EntityComment>> existingMappedComments = getEntityCommentsMapByEntityKeys(entityTypeId,ids,entityCommentTypeId);
	 List<EntityComment> mappedComments =  new ArrayList<>();
	 Date now = new Date(); 
	 for (Long id: ids) {
		 Long maxSequece = getMaxEntityCommentSeq(entityTypeId, id,entityCommentTypeId);
		 for (Long commentId: commentIds) {
			 if (!isMapped(existingMappedComments.get(id),id,commentId)) {				 
				 EntityComment entityComment = getEntityComment(entityTypeId, id, entityCommentTypeId, userId,false);
				 entityComment.setCommentId(commentId);
				 entityComment.setCommentSequence(maxSequece+1);
				 setCreate(entityComment, userId, now);
				 em.persist(entityComment);
				 mappedComments.add(entityComment);				 				 
			 }
		 }
	 }
	 return mappedComments;
   }
   
   @Override
   public void unMapAll(Long foxVersionId) {	   
	   List<Long> strandIds = new ArrayList<Long>();
	   List<Long> strandRestrictionIds = new ArrayList<Long>();
	   List<Long> productInfoCodes = new ArrayList<Long>();
	   List<ErmProductRightStrand> rightStrands = rightStrandService.findAllRightStrands(foxVersionId);
	   for (ErmProductRightStrand rightStrand : rightStrands) {
		   strandIds.add(rightStrand.getRightStrandId());
		   for (ErmProductRightRestriction rightRestriction : rightStrand.getErmProductRightRestrictions()) {
			   strandRestrictionIds.add(rightRestriction.getRightRestrictionId());
		   }
	   }	   
	   List<ErmProductRestriction> productRestrictions = ermProductRestrictionService.findAllProductRestrictions(foxVersionId);	   
	   for (ErmProductRestriction productRestriction : productRestrictions) {
	     productInfoCodes.add(productRestriction.getProductRestrictionId());
	   }
	   	   
	   List<EntityComment> comments = null;
	   if (strandIds.size() > 0) {
	     comments = findEntityComments(EntityType.STRAND.getId(), strandIds, EntityCommentType.CLEARANCE_MEMO_MAP.getId());
	     for (EntityComment comment: comments) {
		   em.remove(comment);
	     }
	   }
	   if (strandRestrictionIds.size() > 0) {
	     comments = findEntityComments(EntityType.STRAND_RESTRICTION.getId(), strandRestrictionIds, EntityCommentType.CLEARANCE_MEMO_MAP.getId());
	     for (EntityComment comment: comments) {
		   em.remove(comment);
	     }
	   }
	   if (productInfoCodes.size() > 0) {
	     comments = findEntityComments(EntityType.PROD_RSTRCN.getId(), productInfoCodes, EntityCommentType.CLEARANCE_MEMO_MAP.getId());
	     for (EntityComment comment: comments) {
	       em.remove(comment);
	     }	   
	   }
	   em.flush();
   }

   @Override
   public void unMap(Long entityTypeId,List<Long> ids,List<Long> commentIds, Long entityCommentTypeId, String userId, boolean isBusiness) {
	   List<EntityComment> comments = findEntityComments(entityTypeId, ids, entityCommentTypeId);
	   for (EntityComment comment: comments) {
		   if (commentIds.contains(comment.getCommentId())){
		     em.remove(comment);
		   }
	   }
	   em.flush();
   }
   
   private List<Long> getCommentIdsFromEntityComments(List<EntityComment> entityComments) {
	   List<Long> commentIds = IdsAccumulator.getIds(entityComments, new IdProvider<EntityComment>() {

		@Override
		public Long getId(EntityComment o) {
			return o.getCommentId();
		}
	   });
	   //for some reason the ids can be not unique so we need to make the unique
	   commentIds = new ArrayList<Long>(new LinkedHashSet<Long>(commentIds));	   
	   return commentIds;
	   
   }
   
   private Map<Long,Comment> getCommentsToClone(List<EntityComment> entityComments,boolean isBusiness) {
	   List<Long> commentIds = getCommentIdsFromEntityComments(entityComments);
	   List<Comment> comments = findComments(commentIds,isBusiness);
	   Map<Long,Comment> commentsMap =  toCommentMap(comments);
	   Map<Long,Comment> entityCommentsMap = new LinkedHashMap<>();
	   for (EntityComment entityComment: entityComments) {
		   //see if there's a comment to clone
		   Long commentId = entityComment.getCommentId();
		   Long entityCommentId = entityComment.getId();
		   if (commentsMap.containsKey(commentId)) {
			  Comment comment = commentsMap.get(commentId); 
			  entityCommentsMap.put(entityCommentId, comment);
		   }
	   }
	   return entityCommentsMap;
   }

   
   private EntityComment getClone(EntityComment originalComment,Long newCommentId, Long nextSequence, String userId, boolean isBusiness) {
	   Date now = new Date();
	   EntityComment entityComment = new EntityComment();
	   entityComment.setCommentId(newCommentId);
	   entityComment.setCommentSequence(nextSequence);
	   entityComment.setCreateDate(now);
	   entityComment.setEntityCommentTypeId(originalComment.getEntityCommentTypeId());
	   entityComment.setEntityTypeId(originalComment.getEntityTypeId());
	   entityComment.setUpdateDate(now);
	   entityComment.setUpdateName(userId);
	   return entityComment;	   
   }
   
   
   private EntityComment clone(EntityComment entityComment, Long entityTypeId,Long newEntityKey,Long nextSequence, Comment comment, String userId, boolean isBusiness) {
	   Long commentId = comment.getId();
	   Long clonedCommentId = copy(comment,userId,isBusiness);
	   EntityComment clonedEntityComment = getClone(entityComment, clonedCommentId,nextSequence, userId, isBusiness);
	   clonedEntityComment.setEntityId(newEntityKey);
	   em.persist(clonedEntityComment);
	   //now also copy the attachments
	   attachmentsService.copyAttachments(commentId, clonedCommentId, userId, isBusiness);
	   return clonedEntityComment;	   
   }
   
   private List<EntityComment> cloneWithComments(Long entityTypeId,Long entityKey,List<EntityComment> entityComments,Map<Long,Comment> commentsByEntityId,String userId, boolean isBusiness)  {
		List<EntityComment> cloned = new ArrayList<>();		
		for (EntityComment entityComment:entityComments) {
			Long nextSequence = getNextCommentSequence(entityTypeId, entityKey,entityComment.getEntityCommentTypeId());			
			Comment comment = commentsByEntityId.get(entityComment.getId());
			if (comment!=null) {
				EntityComment clonedEntityComment = clone(entityComment,entityTypeId, entityKey,nextSequence, comment,userId,isBusiness);
				cloned.add(clonedEntityComment);
			}
		}
		return cloned;
   }
   
   @Override
   public List<EntityComment> cloneWithComments(Long entityTypeId, List<Long> entityKeys,List<EntityComment> entityComments,String userId, boolean isBusiness) {
	   	List<EntityComment> allCloned = new ArrayList<>();
	   	Map<Long,Comment> commentsToClone = getCommentsToClone(entityComments,isBusiness);
	    for (Long entityKey: entityKeys) {
	    	List<EntityComment> cloned  = cloneWithComments(entityTypeId, entityKey, entityComments, commentsToClone, userId, isBusiness);
	    	allCloned.addAll(cloned);
	    }
	    return allCloned;
   }

   	private void copyAttachments(Long fromCommentId,Long toCommentId,String userId) {
   	   boolean isBusiness = false;
 	   attachmentsService.copyAttachments(fromCommentId, toCommentId, userId, isBusiness);   		
   		//TODO implement
   	}
   
   	 @Override
	 public void copyComment(Long fromCommentId,Long toCommentId,String userId) {
		updateText(fromCommentId, toCommentId);
		copyAttachments(fromCommentId, toCommentId,userId);
	 }


	private String getIsBusinessPredicate(boolean isBusiness,String prefix) {
		String businessColumn="bsns_ind";
		String legalColumn="lgl_ind";
		if (prefix!=null) {
			businessColumn = prefix + "." + businessColumn;
			legalColumn = prefix + "." + legalColumn;
		}
		String column = legalColumn;
		if (isBusiness) {
			column=businessColumn;
		}
		return column +"=1";
	}
	 
	 
	 private List<EntityComment> findHeaderCommentsExceptClearanceMemo(Long foxVersionId,boolean isBusiness) {
		 String sql = productCommentsSqlBase + " and " + getIsBusinessPredicate(isBusiness, "c");
		 Query q = em.createNativeQuery(sql, EntityComment.class);
		 setNoCacheHints(q);
		 q.setParameter(1, foxVersionId);
		 @SuppressWarnings("unchecked")
		List<EntityComment> comments = (List<EntityComment>) q.getResultList();
		return comments;
	 }
	 
	 @Override
	 public void deleteEntityComments(List<EntityComment> comments,String userId) {

		 if (comments==null||comments.isEmpty()) return;
		 List<Long> ids = IdsAccumulator.getIds(comments, new IdProvider<EntityComment>() {

			@Override
			public Long getId(EntityComment o) {
				return o.getId();
			}
		 });
		 String in = IdsUtil.getIdsAsListInParenthesis(ids);
		 String sql = deleteCommentsSqlBase + in;
		 Query q =em.createNativeQuery(sql);
		 q.executeUpdate();
	 }
	 
	 @Override
	 public void deleteHeaderComments(Long foxVersionId,String userId, boolean isBusiness) {	 
		 //first find all the comments for the product version
		 List<EntityComment> comments = findHeaderCommentsExceptClearanceMemo(foxVersionId,isBusiness);
		 deleteEntityComments(comments, userId);
	 }
	 
	 @Override
	 public CommentCount getCommentCount(Long foxVersionId,boolean isBusiness, boolean canViewPrivateComments) {
		 CommentCountProcessor commentCountProcessor = new CommentCountProcessor(em);
		 return commentCountProcessor.getCommentCount(foxVersionId, isBusiness, canViewPrivateComments);
	 }
	 
	 @Override
	 public Long getStrandCommentCount(Long foxVersionId, boolean isBusiness, boolean canViewPrivateComments) {
		 CommentCountProcessor commentCountProcessor = new CommentCountProcessor(em);
		 return commentCountProcessor.getStrandCommentsCount(foxVersionId, isBusiness, canViewPrivateComments);
	 }
	 
	 @Override
	 public Long getStrandRestrictionsCommentCount(Long foxVersionId, boolean isBusiness, boolean canViewPrivateComments) {
		 CommentCountProcessor commentCountProcessor = new CommentCountProcessor(em);
		 return commentCountProcessor.getStrandRestrictionCommentsCount(foxVersionId, isBusiness, canViewPrivateComments);
	 }
	 
	 @Override
	 public Long getProductRestrictionsCommentCount(Long foxVersionId, boolean isBusiness, boolean canViewPrivateComments) {
		 CommentCountProcessor commentCountProcessor = new CommentCountProcessor(em);
		 return commentCountProcessor.getProductRestrictionCommentsCount(foxVersionId, isBusiness, canViewPrivateComments);
	 }
	 
	 @Override
	 public Long getProductRestrictionsCommentCountForStrand(Long strandId, boolean isBusiness, boolean canViewPrivateComments) {
		 CommentCountProcessor commentCountProcessor = new CommentCountProcessor(em);
		 return commentCountProcessor.getRestrictionCommentCountForStrand(strandId, isBusiness, canViewPrivateComments);
	 }
	
	 @Override
	 public Long getStrandCommentCountByStrandId(Long strandId, boolean isBusiness, boolean canViewPrivateComments) {
		 CommentCountProcessor commentCountProcessor = new CommentCountProcessor(em);
		 return commentCountProcessor.getStrandCommentCountForStrand(strandId, isBusiness, canViewPrivateComments);		 
	 }
	 
	 @Override
	 public Long getStrandRestrictionCommentCountByStrandRestrictionId(Long strandRestrictionId, boolean isBusiness, boolean canViewPrivateComments) {
		 CommentCountProcessor commentCountProcessor = new CommentCountProcessor(em);
		 return commentCountProcessor.getStrandRestrictionCommentCountForStrandRestriction(strandRestrictionId, isBusiness, canViewPrivateComments);		 
		 
	 }
	 
	 @Override
	 public Long getStrandRestrictionCommentCountByStrandId(Long strandId, boolean isBusiness, boolean canViewPrivateComments) {
		 CommentCountProcessor commentCountProcessor = new CommentCountProcessor(em);
		 return commentCountProcessor.getRestrictionCommentCountForStrand(strandId, isBusiness, canViewPrivateComments);
	 }
	 
	 @Override
	 public Long cloneComment(Long commentId,String userId) {
		 Long newCommentId = copy(commentId, userId);
		 return newCommentId;
	 }
	
	
}

