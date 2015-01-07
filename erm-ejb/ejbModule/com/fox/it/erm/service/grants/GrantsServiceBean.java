/** 
 * @author Tracy M. Adewunmi
 * for the remove/edit status, the productGrantId is in the json
 * for the remove/edit comment, the productGrantId is in the request
 * this is because the comment pojo doesn't have a productGrantId BUT
 * the productGrantId is needed to associate the comment with a productGrant
 **/
package com.fox.it.erm.service.grants;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.fox.it.erm.EntityAttachment;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.comments.EntityCommentOnly;
import com.fox.it.erm.enums.EntityAttachmentType;
import com.fox.it.erm.enums.EntityCommentType;
import com.fox.it.erm.enums.EntityType;
import com.fox.it.erm.enums.GrantType;
import com.fox.it.erm.grants.GrantCode;
import com.fox.it.erm.grants.ProductGrant;
import com.fox.it.erm.grants.ProductPromoMaterial;
import com.fox.it.erm.service.AttachmentsService;
import com.fox.it.erm.service.ClearanceMemoService;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.service.impl.EntityCommentOnlySearchCriteria;
import com.fox.it.erm.service.impl.EntityCommentSearchCriteria;
import com.fox.it.erm.service.impl.ServiceBase;
import com.fox.it.erm.service.xproduct.delete.XProductDeleteSpec;
import com.fox.it.erm.util.IdsUtil;
import com.fox.it.erm.util.JPA;
import com.fox.it.erm.util.UpdatableProcessor;
import com.fox.it.erm.util.converters.JsonToCommentConverter;
import com.fox.it.erm.util.converters.JsonToListConverter;
import com.fox.it.erm.util.converters.JsonToProductGrantConverter;


@Stateless
public class GrantsServiceBean extends ServiceBase implements GrantsService {
	@Inject
	private EntityManager eM;
		
	@Inject
	private JsonToProductGrantConverter productGrantConverter;
	
	@Inject
	private JsonToCommentConverter commentConverter;
	
	@Inject
	private JsonToListConverter listConverter;
	
	
	@Inject
	private CommentsService commentsService;
	
	@Inject
	@EJB
	private ClearanceMemoService clearanceMemoService;
	
	
	
	@EJB
	private AttachmentsService attachmentsService;
	
	@Inject
	private IncludeCommentInCMPredicate inCMPredicate;
	

	private GrantsCodeTableValues codeTableValues;
	
	private Logger logger = Logger.getLogger(GrantsServiceBean.class.getName());
	
	// Grant data returned by this method
	//is really generic to all grants.  What changes will be the comments
	//for the grant if any exist and the value of the status the user sees
	//when they come into the grants area
	public GrantsProxy findAllProductGrants(Long foxVersionId,
			Long grantCodeId,
			int salesAndmarketingFlag) {

		logger.log(Level.ALL,"finding all product grants by foxVersionId: ... " + foxVersionId);		
		GrantsProxy grants = new GrantsProxy(foxVersionId, grantCodeId, salesAndmarketingFlag, eM, this,commentsService,attachmentsService);
		return grants;
	}

	public void deleteProductGrant(String json, String userId, Long productGrantId, boolean isBusiness) throws ErmException {
		
		
		logger.log(Level.ALL,"deleting the product grant with productGrantId:  " + productGrantId);
		
		setUserInDBContext(userId, isBusiness);
		
		//convert the JSONString to a ProductGrant object
		//then find the ProductGrant with the given PK 
		ProductGrant productGrant = eM.find(ProductGrant.class, productGrantConverter.convert(json).getId());				
				
		try {
			eM.remove(productGrant);
		} catch (Exception e ) {
			throw new ErmException(e);
		}
		
	}


	public ProductGrant findById(Long id) {
		ProductGrantSearchCriteria criteria = new ProductGrantSearchCriteria(eM);
		return criteria.setId(id).getSingleResult();
	}
	
	@Override
	public ProductGrant createGrant(Long foxVersionId, Long grantCodeId,String userId) throws ErmException {
		ProductGrant productGrant = new ProductGrant();
		productGrant.setFoxVersionId(foxVersionId);
		productGrant.setGrantCodeId(grantCodeId);
		Date now = new Date();
		UpdatableProcessor.setUserIdAndTypeIndicator(productGrant, userId, false, true, now);
		try {
			eM.persist(productGrant);
			eM.flush();
			return productGrant;
		} catch (Exception e) {
			throw new ErmException(e);
		}
		
	}

	@Override
	public ProductGrant findOrCreateProductGrant(Long foxVersionId,Long grantCodeId, String userId) throws ErmException {
		return getProductGrant(foxVersionId, grantCodeId, userId);
	}
	
	@Override
	public ProductGrant findProductGrant(Long foxVersionId, Long grantCodeId) {
		List<ProductGrant> productGrantList = findAllGrants(foxVersionId,grantCodeId);		
		if(productGrantList != null && productGrantList.size() > 0){
			return productGrantList.get(0);
		}
		return null;
	}
	/**
	 * 
	 * @param foxVersionId
	 * @param grantCodeId
	 * @return
	 * @throws ErmException 
	 * @throws Exception
	 */
	private ProductGrant getProductGrant(Long foxVersionId, Long grantCodeId,String userId) throws ErmException{		
		List<ProductGrant> productGrantList = findAllGrants(foxVersionId,grantCodeId);		
		if(productGrantList != null && productGrantList.size() > 0){
			return productGrantList.get(0);
		}
		else {
			return createGrant(foxVersionId, grantCodeId,userId);
		}
	}
	
	@Override
	public List<ProductGrant> findAllGrants(Long foxVersionId, Long grantCodeId) {
		ProductGrantSearchCriteria criteria = new ProductGrantSearchCriteria(eM);
		criteria.setFoxVersionId(foxVersionId);
		criteria.setCodeId(grantCodeId);
		return criteria.getResultList();
	}
	
	private ProductGrant findGrantByFoxVersionIdAndGrantCode(Long foxVersionId, Long grantCodeId) {
		List<ProductGrant> grants = findAllGrants(foxVersionId,grantCodeId);
		if (grants==null||grants.isEmpty()) return null;
		return grants.get(0);
	}
	
	@Override
	public List<ProductGrant> findAllPulblicGrants(Long foxVersionId, List<Long> grantCodeIds) {
		if (grantCodeIds==null||grantCodeIds.isEmpty()) return new ArrayList<>();
		String idsAsString = IdsUtil.getIdsAsListInParenthesis(grantCodeIds);
		String sql= "select pg.* " + 
					"from  " +
					"prod_grnt pg, " +
					"entty_cmnt ec, " +
					"cmnt c " +
					"where  " +
					"pg.fox_version_id = ? and " +
					"PG.PROD_GRNT_ID = EC.ENTTY_KEY and " +
					"c.cmnt_Id = EC.CMNT_ID and " +
					"C.PUB_IND = 1 and " +
					"EC.ENTTY_TYP_ID = 5 and " +
					"PG.GRNT_CD_ID in " + idsAsString;
		Query q = eM.createNativeQuery(sql, ProductGrant.class);
		q.setParameter(1, foxVersionId);
		q.setParameter(2, grantCodeIds);
		JPA.setNoCacheHints(q);
		@SuppressWarnings("unchecked")
		List<ProductGrant> grants = q.getResultList();
		return grants;
	}
	
	
	private ProductGrant findProductGrant(Long grantId) {
		ProductGrantSearchCriteria criteria = new ProductGrantSearchCriteria(eM).setId(grantId);
		List<ProductGrant> grants = criteria.getResultList();
		if (grants==null||grants.isEmpty()) return null;
		if (grants.size()>1) throw new RuntimeException("Finding grant by id " + grantId + " returned " + grants.size() + " rows");
		return grants.get(0);
	}
	
	private ProductPromoMaterial getProductPromoMaterialById(Long id) {
		PromoMaterialSearchCriteria criteria = new PromoMaterialSearchCriteria(eM).setId(id);
		List<ProductPromoMaterial> productPromoMaterials = criteria.getResultList();		
		if (productPromoMaterials==null||productPromoMaterials.isEmpty()) return null;
		return productPromoMaterials.get(0);
	}
	
	private ProductPromoMaterial getProductPromoMaterial(Long foxVersionId, Long promoMaterialId,String userId) throws ErmException{
		PromoMaterialSearchCriteria criteria = new PromoMaterialSearchCriteria(eM);
		criteria.setFoxVersionId(foxVersionId).setPromoMaterialId(promoMaterialId);
				
		List<ProductPromoMaterial> productPromoList = criteria.getResultList();
		
		if(productPromoList != null && productPromoList.size() > 0){
			return productPromoList.get(0);
		}
		else {
			return createPromoMaterial(foxVersionId, promoMaterialId,userId);
		}
	}
	
	/**
	 * 
	 * @param foxVersionId
	 * @param categoryId
	 * @return
	 * @throws ErmException
	 */
	private ProductPromoMaterial createPromoMaterial(Long foxVersionId, Long categoryId,String userId) throws ErmException {
		ProductPromoMaterial promoMaterial = new ProductPromoMaterial();
		promoMaterial.setFoxVersionId(foxVersionId);
		promoMaterial.setPromotionalMaterialId(categoryId); 
		UpdatableProcessor.setUserIdAndTypeIndicator(promoMaterial, userId, false, true, new Date());
		try {
			//eM.merge( promoMaterial);
			eM.persist(promoMaterial);
		} catch (Exception e) {
			throw new ErmException(e);
		}
		return promoMaterial;
	}
	
	private Logger getLogger() {
		return logger;
	}
	
	private void addToCM(Long foxVersionId, Long commentId,String userId) {
		clearanceMemoService.linkGrantCommentToCM(foxVersionId,commentId,userId);
	}
	
	private void deleteFromCM(Long foxVersionId, Long commentId, String userId) {
		clearanceMemoService.deleteGrantCommentFromCM(foxVersionId, commentId, userId);
	}
	
	@Override
	public Long addComment(String userId, Comment comment, Long foxVersionId,Long categoryId, Long grantCodeId, boolean isBusiness) throws ErmException {
		//category id is being used as entity comment type id
		setUserInDBContext(userId, isBusiness);
		getLogger().info("GrantServiceBean.addComment grantCodeId: " + grantCodeId + " categoryId: " + categoryId );
		Long commentId = null;		
		if (grantCodeId == GrantType.FILMS_CLIPS_STILLS.getId().longValue() || 
				grantCodeId == GrantType.MERCHANDISING_COMMERCIAL_TIE_INS.getId().longValue() ||
				grantCodeId == GrantType.PAID_AD_MEMO.getId().longValue()
				|| grantCodeId == GrantType.COMMERICAL_TIE_INS.getId() ||
				grantCodeId == GrantType.TITLE_CREDITS.getId() || grantCodeId == GrantType.ARTWORK_RESTRICTIONS.getId()) {
		  ProductGrant p = getProductGrant(foxVersionId, grantCodeId,userId);
		  logger.info(" PRODUCT GRANT ID : "+p.getId());
		  commentId = commentsService.addNewComment(EntityType.PRODUCT_GRANT.getId().longValue(),
					p.getId(),
					categoryId,
					comment,
					userId,
					isBusiness).getCommentId();			
		} else if (grantCodeId == GrantType.REMAKES_SEQUELS.getId().longValue() || 
				grantCodeId == GrantType.LEGITIMATE_STAGE.getId().longValue()) {
			ProductGrant p = getProductGrant(foxVersionId, grantCodeId,userId);
			logger.info(" PRODUCT GRANT ID : "+p.getId());
			commentId = commentsService.addNewComment(EntityType.PRODUCT_GRANT.getId().longValue(),
					p.getId(),
					EntityCommentType.SUBRIGHTS.getId().longValue(),
					comment,
					userId,
					isBusiness).getCommentId();						
		} else {
			//The entityId of the EntityComment class correspond to the id of the ProductPromoMaterial class
			//It means that we must first have a ProductPromoMaterial object before creating a new EntityComment.
			ProductPromoMaterial productPromoMaterial = this.getProductPromoMaterial(foxVersionId, categoryId,userId);
			commentId = commentsService.addNewComment(EntityType.PRODUCT_PROMO_MTRL.getId().longValue(),
					productPromoMaterial.getId(),
					EntityCommentType.PROMO_MATERIALS.getId(),
					comment,
					userId,
					isBusiness).getCommentId();		
		}
		//now see if it needs to be added to CM and add it
		if (inCMPredicate.apply(categoryId, grantCodeId)) {
			getLogger().info("Comment id " + commentId + " for product " + foxVersionId + " should be in CM, attempting to add it");
			addToCM(foxVersionId, commentId, userId);
		}
		return commentId;
		
	}
	
	@Override
	public Long addComment(String json, 
			String userId, 
			Long foxVersionId, 
			Long categoryId,
			Long grantCodeId, 
			boolean isBusiness) throws ErmException {
		

			Comment comment = commentConverter.convert(json);
			return addComment(userId, comment, foxVersionId, categoryId, grantCodeId, isBusiness);
		
	}

	
	
	public void addGrantStatus(String json, String userId, boolean isBusiness) throws ErmException {
		setUserInDBContext(userId, isBusiness);
		
		try {
			ProductGrant productGrant = productGrantConverter.convert(json); 
			Long statusId = productGrant.getGrantStatusId();
			if (statusId!=null && statusId.intValue()<0) {
				//if the status id <0 it means no status (from the UI). So we should make it null
				statusId = null;
				productGrant.setGrantStatusId(null);
			}
			Long id = productGrant.getId();
			Long foxVersionId = productGrant.getFoxVersionId();
			Long grantCodeId = productGrant.getGrantCodeId();
			ProductGrant saved = null;
			if (id!=null) {
				//now fetch the grant
				saved = eM.find(ProductGrant.class,id);
			} else {
				//ther's no id so, we must find it by foxVersionId and grantCodeId
				//this is necessary because the grant might exist but the UI can be unaware of it.
				//ie product with no grant, create one and then immediately after change status
				saved = findGrantByFoxVersionIdAndGrantCode(foxVersionId, grantCodeId);
			}
			if (saved!=null) {
				saved.setGrantStatusId(statusId);
				UpdatableProcessor.setUserIdAndTypeIndicator(saved, userId, isBusiness, !isBusiness, new Date());
			} else {
				UpdatableProcessor.setUserIdAndTypeIndicator(productGrant, userId, isBusiness, !isBusiness, new Date());				
				eM.merge(productGrant);
			}
		} catch (Exception e) {
			throw new ErmException(e);
		}
		
		
		
	}

	@Override
	public void editGrantStatus(String json, String userId, boolean isBusiness) throws ErmException {
		//since add uses merge, I can just call the addGrantStatus to update too
		addGrantStatus(json, userId, isBusiness);
		
	}

	@Override
	public void removeGrantStatus(String json, String userId, boolean isBusiness) throws ErmException {
		ProductGrant productGrant = null;
		
		setUserInDBContext(userId, isBusiness);
		
			
		try {
			//convert the JSONString to a ProductGrant object
			//then find the ProductGrant with the given PK 
			productGrant = eM.find(ProductGrant.class, productGrantConverter.convert(json).getId());				
				
			eM.remove(productGrant);
		} catch (Exception e) {
			throw new ErmException(e);
		}
		
	}

	@Override
	public void deleteMultipleComments(Long foxVersionId,String json, String userId, boolean isBusiness) throws ErmException {		
		setUserInDBContext(userId, isBusiness);			
		try {
			//commendId is in the json body
			@SuppressWarnings("unchecked")
			List<Integer> commentIds = listConverter.convert(json);
			for (Integer commentId : commentIds) {			
			  logger.info(" COMMENT TO BE DELETED : "+ commentId);
			  deleteCommentByID(foxVersionId, new Long(commentId), userId);
			}
		} catch (Exception e) {
			throw new ErmException(e);
		}
		
	}
	
	private void deleteCommentByID(Long foxVersionId, Long commentId, String userId) throws ErmException {
		EntityCommentSearchCriteria criteria = (new EntityCommentSearchCriteria(eM)).setCommentId(commentId);
		List<EntityComment> entityComments = criteria.getResultList();
		Comment comment = eM.find(Comment.class, commentId);
		if (commentId==null) {
			getLogger().log(Level.SEVERE,"Attempted to delete comment " + commentId + " " + commentId + " but is not present in db");
			return;
		}
		//The entityManager.remove method does not delete an entity immediately
		//And that causes problem, because the entity slated
		//to be deleted at a later time still appear in
		//the result listing. To fix this problem we also have to delete the 
		//EntityComment associated with the comment.
		if(entityComments.size() > 0) {
			for(EntityComment e : entityComments){										
				// Delete all attachments for this entity comment
				List<EntityAttachment> attachments = attachmentsService.findEntityAttachmentsForEntityTypeAndId(EntityType.COMMENT.getId().longValue(), e.getCommentId(), EntityAttachmentType.COMMENT.getId());
				for (EntityAttachment attachment : attachments)
				  attachmentsService.deleteAttachment(attachment.getDocumentId());																			
				eM.remove(e);
			}
		}
		eM.remove(comment);
		deleteFromCM(foxVersionId, commentId, userId);
	}
	
	@Override
	public void deleteComment(Long foxVersionId,String json, String userId, boolean isBusiness) throws ErmException {		
		setUserInDBContext(userId, isBusiness);				
		try {
			//delete the comment 
			//commendId is in the json body
			Comment c = commentConverter.convert(json);
			Long commentId = c.getId();
			logger.info(" COMMENT TO BE DELETED : "+c.getId());
			deleteCommentByID(foxVersionId, commentId, userId);
		} catch (Exception e) {
			throw new ErmException(e);
		}		
	}
	
	
	private boolean isPromoMaterial(Long entityTypeId) {
		return EntityType.PRODUCT_PROMO_MTRL.getId().equals(entityTypeId);
	}

	
	private void setCategoryForPromomMaterial(ProductPromoMaterial promoMaterial,Long entityCommentId, Long categoryId,String userId) throws ErmException {
		//first find all the entity comments for that promo material
		Long promoMaterialId = promoMaterial.getId();
		Long foxVersionId = promoMaterial.getFoxVersionId();
		EntityCommentOnlySearchCriteria entityCommentSearchCriteria = new EntityCommentOnlySearchCriteria(eM);		
		List<EntityCommentOnly> comments = entityCommentSearchCriteria.setEntityId(promoMaterialId).getResultList();
		//if there are more than one comments we cannot change the category id
		if (comments.size()==1) {
			promoMaterial.setPromotionalMaterialId(categoryId);			
		} else {
			//there are multiple comments so we cannot change the promo material category.
			//instead we need to move the entity comment to a new PromoMaterial that has the desired category (or create a new one)
			ProductPromoMaterial targetPromoMaterial = getProductPromoMaterial(foxVersionId, categoryId,userId);
			//now fetch the entity comment and assign it to that promo material
			Long targetPromoMateriaId = targetPromoMaterial.getId();
			EntityCommentOnly entityComment = new EntityCommentOnlySearchCriteria(eM).setId(entityCommentId).getSingleResult();
			entityComment.setEntityId(targetPromoMateriaId);
			
		}
	}
	
	@Override
	public void editComment(Comment c, String userId,Long foxVersionId, boolean isBusiness) throws ErmException {
		
		setUserInDBContext(userId, isBusiness);
		
		//edit the comment
		//all the relevant information is in the json body which holds the commend info
		Long commentId = c.getId();
		Long entityCommentId = c.getEntityCommentId();
		//category id is the entity comment type id
		Long categoryId = c.getCategoryId();
		Long grantCodeId = null;
		if (entityCommentId!=null && entityCommentId.intValue()>0 && categoryId!=null&&categoryId.intValue()>0) {
			EntityCommentOnlySearchCriteria entityCommentSearchCriteria = new EntityCommentOnlySearchCriteria(eM).setId(entityCommentId);			
			EntityCommentOnly entityComment = entityCommentSearchCriteria.getSingleResult();			
			Long entityTypeId = entityComment.getEntityTypeId();
			Long entityCommentTypeId = entityComment.getEntityCommentTypeId();
			Long entityId = entityComment.getEntityId();
			//update the category of the entity comment
			if (isPromoMaterial(entityTypeId)) {
				ProductPromoMaterial promoMaterial = getProductPromoMaterialById(entityId);				
				if (promoMaterial!=null && !promoMaterial.getPromotionalMaterialId().equals(categoryId)) {
					//we cannot just change the category on the promo material because there might be more than one comment
					//associated with it, if there are all the comments will change category, which is WRONG.
					//instead we need to see if there are multiple entity comments for that promo material
					//if there are we either need to create a new promo material and assign the entity comment to the new material, if the promo material already exists
					//we need to assign the entity comment to that material 
					setCategoryForPromomMaterial(promoMaterial,entityCommentId,categoryId,userId);
				}
			} else {
				if (!categoryId.equals(entityCommentTypeId) && categoryId.intValue()>0) {
					//entity comment type needs to be updated
					entityComment.setEntityCommentTypeId(categoryId);
//					eM.flush();
				}
				ProductGrant productGrant = findProductGrant(entityId);
				grantCodeId = productGrant.getGrantCodeId();
			}
		}
		Comment comment = eM.find(Comment.class, commentId);
		comment.setShortDescription(c.getShortDescription());
		comment.setLongDescription(c.getLongDescription());
		comment.setPublicInd(c.getPublicInd());
		comment.setUpdateDate(Calendar.getInstance().getTime());
		comment.setUpdateName(userId);
		
		try {
			eM.merge(comment);
			eM.flush();
		} catch (Exception e) {
			throw new ErmException(e);
		}
		if (categoryId!=null && grantCodeId!=null) {
			if (inCMPredicate.apply(categoryId, grantCodeId)) {
				addToCM(foxVersionId, commentId, userId);
			} else {
				deleteFromCM(foxVersionId, commentId, userId);
			}
		}		
		
	}

	@Override
	public GrantsProxy findAllCommentsForGrant(Long foxVersionId, Long grantCodeId) {
		
		logger.log(Level.INFO,"finding all comments for the foxVersionId and grantCodeId: ... " + foxVersionId + " " + grantCodeId);
		GrantsProxy grants = new GrantsProxy(foxVersionId, grantCodeId, eM, commentsService,attachmentsService);		
		
		return grants;
	}
	
	@Override
	public void deleteGrantsInBulk(XProductDeleteSpec foxVersionIdList) {
		List<Long> foxVersionIds = foxVersionIdList.getFoxVersionIds();
		
			
		logger.info("foxversionId to be deleted in ProductGrant: "  + foxVersionIds);
			
		Query bulkDelete = eM.createNamedQuery(ProductGrant.BULK_DELETE);
			
		bulkDelete.setParameter("foxVersionIds", foxVersionIds);
			
		bulkDelete.executeUpdate();
		
	}
	
	@Override
	public GrantsCodeTableValues getCodeTableVales() {
		if (codeTableValues==null||shouldRefreshCache()) {
			codeTableValues = new GrantsCodeTableValues();
			GrantCodeSearchCriteria grantCodeSearchCriteria = new GrantCodeSearchCriteria(eM).setActive();
			List<GrantCode> grantCodes = grantCodeSearchCriteria.getResultList();
			for (GrantCode gc:grantCodes) {
				//do not remove
				@SuppressWarnings("unused")
				com.fox.it.erm.grants.GrantType grantType = gc.getGrantType();
			}
			codeTableValues.setGrantCodes(grantCodes);
			GrantStatusSearchCriteria grantStatusSearchCriteria = new GrantStatusSearchCriteria(eM);
			codeTableValues.setGrantStatus(grantStatusSearchCriteria.getResultList());
			GrantTypeSearchCriteria grantTypeSearchCriteria = new GrantTypeSearchCriteria(eM);
			codeTableValues.setGrantTypes(grantTypeSearchCriteria.getResultList());			
			GrantCategorySearchCriteria grantCateogrySearchCriteria = new GrantCategorySearchCriteria(eM);
			codeTableValues.setGrantCategories(grantCateogrySearchCriteria.getResultList());
			
			//TODO use enum
			SalesAndMarketingCategorySearchCriteria salesAndMarketingSearchCriteria = new SalesAndMarketingCategorySearchCriteria(eM).setCategoryId(7L);
			codeTableValues.setSalesAndMarketingCategories(salesAndMarketingSearchCriteria.getResultList());
			
		}
		return codeTableValues;
	}
	
	@Override
	public List<GrantCode> findAllGrantCode() {
		return getCodeTableVales().getGrantCodes();
	}
	
	
	
}
