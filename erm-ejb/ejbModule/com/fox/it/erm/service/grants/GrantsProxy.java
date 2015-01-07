package com.fox.it.erm.service.grants;



import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.persistence.EntityManager;

import com.fox.it.erm.EntityAttachment;
import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.comments.EntityCommentOnly;
import com.fox.it.erm.enums.EntityType;
import com.fox.it.erm.grants.Category;

import com.fox.it.erm.grants.GrantCode;
import com.fox.it.erm.grants.GrantStatus;
import com.fox.it.erm.grants.GrantType;
import com.fox.it.erm.grants.ProductGrant;
import com.fox.it.erm.grants.ProductPromoMaterial;

import com.fox.it.erm.service.AttachmentsService;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.service.impl.EntityCommentOnlySearchCriteria;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
import com.google.common.base.Function;
import com.google.common.collect.Maps;



//This object holds static/generic grant data
//which is data that is NOT specific to a given productVersion/foxVersionId
//it is a specialized POJO cause it goes out and gets the data it
//needs to populate its attributes.
public class GrantsProxy {
	
	private EntityManager eM;
	
	private Long foxVersionId;
	
	private Long grantCodeId;
	
	private int salesAndmarketingFlag;

	private List<ProductGrant> productGrantList;	
	private GrantsCodeTableValues codeTableValues;

	
//	private List<GrantStatus> grantStatusList;
//	
//	private List<GrantCode> grantCodeList;
//	
//	private List<Category> grantCategoryList;
//	
//	private List<GrantType> grantTypeList;
	

	
	private List<EntityComment> commentList;
	
	private Logger logger = Logger.getLogger(GrantsProxy.class.getName());
	
	//this constructor is used in the case of deleting or retrieving
	//all product grants (no foxVersionId required)
	public GrantsProxy(EntityManager eM,GrantsService grantsService) {
		new GrantsProxy(new Long(0), eM,grantsService);
	}
	
	private void setCodeTableValues(GrantsService service) {
		codeTableValues = service.getCodeTableVales();
	}
	
	public GrantsProxy(Long foxVersionId, EntityManager eM, GrantsService grantsService) {
		
		this.foxVersionId = foxVersionId;
		this.eM = eM;
		findProductGrantList();		
		setCodeTableValues(grantsService);
	}
	
	public GrantsProxy(Long foxVersionId, Long grantCodeId, int salesAndmarketingFlag, EntityManager eM,GrantsService grantsService, CommentsService commentsService,AttachmentsService attachmentsService) {
		
		this.foxVersionId = foxVersionId;
		this.salesAndmarketingFlag = salesAndmarketingFlag;
		
		//set a default grantCode for the 1st time we come into the grants section
		//if salesAndmarketingFlag == 1 then we are on the s&m tab and
		//the default grant to display data for is Films/Clips/Stills (2)
		//otherwise we are on subrights and the default grant is Remakes/Sequals (7)
		if (this.salesAndmarketingFlag == 1) 
			this.grantCodeId = new Long(2);
		else
			this.grantCodeId = new Long(7);
		
		this.eM = eM;

		findProductGrantList();		
		setCodeTableValues(grantsService);		
		findCommentList(commentsService,attachmentsService);
	}
	
	public GrantsProxy(Long foxVersionId, Long grantCodeId, EntityManager eM, CommentsService commentsService,AttachmentsService attachmentsService) {
		this.grantCodeId = grantCodeId;
		this.foxVersionId = foxVersionId;
		this.eM = eM;
		//findCommentList();
		findComments(commentsService,attachmentsService);
	}
	
	
	public List<EntityComment> getCommentList() {
		return commentList;
	}
	
	public List<GrantStatus> getGrantStatusList() {
		return codeTableValues.getGrantStatus();
	}
	
	public List<Category> getGrantCategoryList() {
		List<Category> all = new ArrayList<>();
		all.addAll(codeTableValues.getGrantCategories());
		all.addAll(codeTableValues.getSalesAndMarketingCategories());
		return all;
	}
	
	public List<GrantCode> getGrantCodeList() {
		return codeTableValues.getGrantCodes();
	}
	
	public List<GrantType> getGrantTypeList() {
		return codeTableValues.getGrantTypes();
	}
	
	public List<ProductGrant> getProductGrantList() {
		return productGrantList;
	}
	


	
	
//	private List<SalesAndMarketingCategory> findSalesAndMarketingCategories() {
//		SalesAndMarketingCategorySearchCriteria criteria = new SalesAndMarketingCategorySearchCriteria(eM);
//		criteria.setCategoryId(7L);
//		return criteria.getResultList();
//	}
	
//	private void findGrantCategoryList() {
//		
//		
//		List<? extends Category> list =  findAllGrantCategories();
//		
//
//		List<? extends Category> smList = findSalesAndMarketingCategories();		
//		List<Category> categories = new ArrayList<Category>();
//		categories.addAll(list);
//		categories.addAll(smList);
//		
//		setCategoryList(categories);
//	}
	

	private void findProductGrantList() {
		ProductGrantSearchCriteria productGrantSearchCriteria = new ProductGrantSearchCriteria(eM).setFoxVersionId(foxVersionId);
		List<ProductGrant> productGrants = productGrantSearchCriteria.getResultList();			
		if (productGrants.size() == 0) 
			return;
		else {
			setProductGrantList(productGrants);
		}
	}
	




	private void setAttachments(List<EntityComment> eC, AttachmentsService attachmentsService) {
		Map<Long,List<EntityComment>> entityCommentMapByCommentId = new HashMap<>();
		for (EntityComment entityComment: eC) {
			Long commentId = entityComment.getCommentId();
			List<EntityComment> entityComments = null;			
			if (entityCommentMapByCommentId.containsKey(commentId)) {
				entityComments = entityCommentMapByCommentId.get(commentId);				
			} else {
				entityComments  = new ArrayList<EntityComment>();
				entityCommentMapByCommentId.put(commentId, entityComments);
			}
			entityComments.add(entityComment);
		}
		List<Long> commentIds = IdsAccumulator.getIds(eC, new IdProvider<EntityComment>() {

			@Override
			public Long getId(EntityComment o) {
				return o.getCommentId();
			}
			
		});
		List<EntityAttachment> attachments = attachmentsService.findEntityAttachmentsForCommentIds(commentIds);
		Map<Long,List<EntityAttachment>> attachmentsByCommentId = new HashMap<>();
		for (EntityAttachment attachment: attachments) {
			Long commentId = attachment.getEntityId();
			List<EntityAttachment> attachmentList = new ArrayList<>();
			if (!attachmentsByCommentId.containsKey(commentId)) {
				attachmentsByCommentId.put(commentId,attachmentList);
			} else {
				attachmentList = attachmentsByCommentId.get(commentId);
			}
			attachmentList.add(attachment);
		}
		
		for (Long commentId: entityCommentMapByCommentId.keySet()) {
			List<EntityComment> entityComments = entityCommentMapByCommentId.get(commentId);
			for (EntityComment entityComment: entityComments) { 
				List<EntityAttachment> att = attachmentsByCommentId.get(commentId);
				if (att!=null) {
					entityComment.setAttachments(att);
				} else {
					entityComment.setAttachments(new ArrayList<EntityAttachment>());
				}
			}
		}
		
	}
	
	private List<EntityComment> toEntityComments(List<EntityCommentOnly> entityCommentsOnly, CommentsService commentsService) {


		//now get all the comments
		List<Long> commentIds = IdsAccumulator.getIds(entityCommentsOnly, new IdProvider<EntityCommentOnly>(){

			@Override
			public Long getId(EntityCommentOnly o) {
				return o.getCommentId();
			}
			
		});
		List<EntityComment> eC = new ArrayList<>();
		for (EntityCommentOnly eco: entityCommentsOnly) {
			EntityComment entityComment = new EntityComment();
			entityComment.copyFrom(eco);
			eC.add(entityComment);
		}
		//now find the comments
		List<Comment> comments = commentsService.findCommentsWithText(commentIds);
		//now set the comments in the entity comment
		Map<Long,Comment> commentsById = Maps.uniqueIndex(comments, new Function<Comment,Long>(){

			@Override
			public Long apply(Comment c) {
				return c.getId();
			}
			
		});
		for (EntityComment ec: eC) {
			Long commentId = ec.getCommentId();
			Comment comment = commentsById.get(commentId);
			ec.setComment(comment);
		}
		return eC;
		
	}
	
	private void findCommentList(CommentsService commentsService,AttachmentsService attachmentsService) {
		ProductGrantSearchCriteria productGrantSearchCriteria = new ProductGrantSearchCriteria(eM).setFoxVersionId(foxVersionId).setCodeId(grantCodeId);
		List<ProductGrant> productGrants = productGrantSearchCriteria.getResultList();
		
		
		
		if (productGrants.size() > 0) {
			logger.info("there are: " + productGrants.size() + " number of grants");			
			//go get the comments
			ProductGrant p = productGrants.get(0);


			EntityCommentOnlySearchCriteria entityCommentOnlySearchCriteria = new EntityCommentOnlySearchCriteria(eM).setEntityId(p.getId()).setEntityTypeId(EntityType.PRODUCT_GRANT.getId()); 
			List<EntityCommentOnly> entityCommentsOnly = entityCommentOnlySearchCriteria.getResultList();
			List<EntityComment> eC = toEntityComments(entityCommentsOnly, commentsService);
//			EntityCommentSearchCriteria entityCommentSearchCriteria = new EntityCommentSearchCriteria(eM).setEntityId(p.getId()).setEntityTypeId(EntityType.PRODUCT_GRANT.getId());
			
			
//			List<EntityComment> eC = entityCommentSearchCriteria.getResultList();
			setProductGrantList(productGrants);
			setAttachments(eC, attachmentsService);
			Collections.sort(eC);
			Collections.reverse(eC);
			setCommentList(eC);
		}
	}
	
	private void findComments(CommentsService commentsService,AttachmentsService attachmentsService){
		if (this != null && this.grantCodeId != null) {
		  if (this.grantCodeId > 0) {
		    this.findCommentList(commentsService,attachmentsService);
		  } else { 
		    this.findPromoMaterialCommentList(commentsService,attachmentsService);
		  }
		}
	}
	
	
	private void findPromoMaterialCommentList(CommentsService commentsService,AttachmentsService attachmentsService) {
		logger.info("findPromoMaterialCommentList entityTypeId: " + EntityType.PRODUCT_PROMO_MTRL.getId() + " foxVersionId: " + foxVersionId);		
		PromoMaterialSearchCriteria criteria = new PromoMaterialSearchCriteria(eM).setFoxVersionId(foxVersionId);
		List<ProductPromoMaterial> productPromoList = criteria.getResultList();
		Map<Long,ProductPromoMaterial> promoMaterialMap = Maps.uniqueIndex(productPromoList, new Function<ProductPromoMaterial,Long>() {
			@Override
			public Long apply(ProductPromoMaterial o) {
				return o.getId();
			}
			
		});				
		if(productPromoList != null && productPromoList.size() > 0){
			List<Long> promoMaterialIds = IdsAccumulator.getIds(productPromoList, new IdProvider<ProductPromoMaterial> () {
				@Override
				public Long getId(ProductPromoMaterial o) {
				  return o.getId();
				}				
			});
			EntityCommentOnlySearchCriteria entityCommentSearchCriteria = new EntityCommentOnlySearchCriteria(eM).setEntityIds(promoMaterialIds).setEntityTypeId(EntityType.PRODUCT_PROMO_MTRL.getId());
			List<EntityCommentOnly> entityCommentsOnly = entityCommentSearchCriteria.getResultList();
			List<EntityComment> eC = toEntityComments(entityCommentsOnly, commentsService);
			
			if(eC != null && eC.size() > 0){
				for (EntityComment comment : eC) {
					Long promoMaterialId = comment.getEntityId();
					ProductPromoMaterial promoMaterial = promoMaterialMap.get(promoMaterialId);
					if (promoMaterial!=null) {
						comment.setPromoMaterialId(promoMaterial.getPromotionalMaterialId());
					}
				}				
			}	
			setAttachments(eC, attachmentsService);
			setCommentList(eC);
		}

				
		
	}

	private void setCommentList(List<EntityComment> commentList) {
		this.commentList = commentList;
	}

	
	private void setProductGrantList(List<ProductGrant> productGrantList) {
		this.productGrantList = productGrantList;
	}

}
