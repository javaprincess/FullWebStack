package com.fox.it.erm.service.impl;

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

import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.ErmProductVersion;
import com.fox.it.erm.ErmValidation;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.enums.EntityCommentType;
import com.fox.it.erm.enums.EntityType;
import com.fox.it.erm.service.BitmapUpdater;
import com.fox.it.erm.service.ErmProductRestrictionService;
import com.fox.it.erm.service.ErmProductVersionService;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.ProductVersionSaveService;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.util.CommentCleanner;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
import com.fox.it.erm.util.ProductRestrictionCreateObject;
import com.fox.it.erm.util.UpdatableProcessor;

@Stateless
public class ProductVersionSaveServiceBean extends ServiceBase implements ProductVersionSaveService {


	
	
	@Inject
	private EntityManager em;
	
	@EJB
	@Inject
	private ErmProductRestrictionService productRestrictionService;
	
	@EJB
	@Inject
	private ErmProductVersionService ermProductVersionService;
	
	@EJB
	@Inject
	private CommentsService commentsService;
	
	@Inject
	private BitmapUpdater bitmapUpdater;
	
	@Inject
	private JsonService jsonService;
	
	
	public static final Long DO_NOT_LICENSE_ID = 106L;
	
	private static final String DELETE_PRODUCT_RESTRICTION_PROCEDURE_NAME = "REMOVE_PROD_RSTRCN(?,?,?,?)";		
	
	private static final Logger logger = Logger.getLogger(ErmProductRestrictionService.class.getName());
	
	
	private ErmProductRestriction save(ErmProductRestriction restriction) {
		restriction = em.merge(restriction);
		return restriction;
	}
	
	private Logger getLogger() {
		return logger;
	}
	
	private ErmProductRestriction update(ErmProductRestriction restriction){	
		ErmProductRestriction eres = this.productRestrictionService.findErmProductRestrictionByPrimaryKey(restriction.getProductRestrictionId());
		if(eres != null){
			eres.copyForUpdate(restriction);
			em.merge(eres);
		}
		return eres;
	}
	
	/**
	 * 
	 * @param productRestrictionId
	 * @param isBusiness
	 * @return
	 */
	private ErmProductRestriction adoptProductRestriction(Long productRestrictionId, String userId, boolean isBusiness){	
		ErmProductRestriction eres = this.productRestrictionService.findErmProductRestrictionByPrimaryKey(productRestrictionId);
		if(eres != null){
			if(isBusiness){
				setUserIdAndTypeIndicator(eres,userId, true,eres.getLegalInd(), Calendar.getInstance().getTime());
			}
			else {
				setUserIdAndTypeIndicator(eres,userId, eres.getBusinessInd(),true, Calendar.getInstance().getTime());
			}
			em.merge(eres);
		}
		return eres;
	}
	
	/**
	 * 
	 * @param createObject
	 * @param userId
	 * @param isBusiness
	 * @return
	 */
	private List<ErmProductRestriction> adoptProductRestrictions(ProductRestrictionCreateObject createObject, String userId, boolean isBusiness) throws ErmException{
		ProductRestrictionCreateToRestrictionConverter converter = new ProductRestrictionCreateToRestrictionConverter();
		List<ErmProductRestriction> adopted = new ArrayList<ErmProductRestriction>();
		List<ErmProductRestriction> restrictions = converter.convert(createObject);
		if(restrictions != null && restrictions.size() > 0){
			ProductAdoptValidator validator = new ProductAdoptValidator();
			for(ErmProductRestriction er : restrictions){
				validator.validateAdoptProductRestriction(er, isBusiness);
			}
			for(ErmProductRestriction er : restrictions){
				ErmProductRestriction ermpr = adoptProductRestriction(er.getProductRestrictionId(), userId, isBusiness);
				adopted.add(ermpr);
			}
		}
		return adopted;
	}
		
	public void updateScripted(Long foxVersionId, String userName, boolean isScripted) throws ErmValidationException{
		logger.info("Updating Scripted Flag to " + isScripted + " for foxVersionId " + foxVersionId);	
		ErmProductVersion productVersion = this.ermProductVersionService.findOrCreateNewProductVersion(foxVersionId, userName);
		if(productVersion != null) {
		  productVersion.setScriptedFlag(isScripted);			
		  em.merge(productVersion);
		}
		em.flush();
	}	
	
	@Override
	public void updateLegalConfirmationStatus(Long foxVersionId, String userName, Long legalConfirmationStatusId) {
		logger.info("Updating LegalConfirmationStatus Flag to " + legalConfirmationStatusId + " for foxVersionId " + foxVersionId);					
		ErmProductVersion productVersion = this.ermProductVersionService.findOrCreateNewProductVersion(foxVersionId, userName);
		if(productVersion != null){		  
		  productVersion.setLegalConfirmationStatusId(legalConfirmationStatusId);
		  em.merge(productVersion);			
		}
		em.flush();
		bitmapUpdater.setSummaryBitmap(foxVersionId, userName);
	}	

	@Override
	public void updateBusinessConfirmationStatus(Long foxVersionId,Long businessConfirmationStatusId,String userId) {
		logger.info("Updating BusinessConfirmationStatus Flag to " + businessConfirmationStatusId + " for foxVersionId " + foxVersionId);					
		ErmProductVersion productVersion = this.ermProductVersionService.findOrCreateNewProductVersion(foxVersionId, userId);
		if(productVersion != null){		  
		  productVersion.setBusinessConfirmationStatusId(businessConfirmationStatusId);
		  em.merge(productVersion);			
		}
		em.flush();
		bitmapUpdater.setSummaryBitmap(foxVersionId, userId);
	}
	
	@Override
	public void updateFoxProducedInd(Long foxVersionId, String userName, Integer foxProducedInd) throws ErmValidationException {
		logger.info("Updating Fox Produced Indicator Flag to " + foxProducedInd + " for foxVersionId " + foxVersionId);					
		ErmProductVersion productVersion = this.ermProductVersionService.findOrCreateNewProductVersion(foxVersionId, userName);
		if(productVersion != null){		  
		  productVersion.setFoxProducedInd(foxProducedInd);
		  em.merge(productVersion);			
		}
		em.flush();
	}
	
	@Override
	public void updateFutureMedia(Long foxVersionId, String userId, Integer futureMediaInd) {
		logger.info("Updating future media  Flag to " + futureMediaInd + " for foxVersionId " + foxVersionId);;					
		ErmProductVersion productVersion = this.ermProductVersionService.findOrCreateNewProductVersion(foxVersionId, userId);
		if(productVersion != null){
		  productVersion.setFutureMediaInd(futureMediaInd);
		  em.merge(productVersion);			
		}
		em.flush();
	}
	
	
	private List<ErmProductRestriction> saveAfterValidation(List<ErmProductRestriction> restrictions) {
		List<ErmProductRestriction> saved = new ArrayList<>();
		for (ErmProductRestriction restriction: restrictions) {
			Long restrictionId = restriction.getProductRestrictionId();
			if(restrictionId != null && restrictionId > 0){				
				restriction = update(restriction);
			}
			else {
				restriction = save(restriction);
			}			
			saved.add(restriction);
		}
		return saved;
	}

	private void setUserIdAndTypeIndicator(ErmProductRestriction restriction,String userId, boolean isBusiness,boolean isLegal, Date timestamp) {
		UpdatableProcessor.setUserIdAndTypeIndicator(restriction, userId, isBusiness,isLegal, timestamp);
	}
	
	private void setUserIdAndTypeIndicator(List<ErmProductRestriction> restrictions,String userId, boolean isBusiness,boolean isLegal, Date timestamp) {
		for (ErmProductRestriction restriction: restrictions) {
			setUserIdAndTypeIndicator(restriction,userId,isBusiness,isLegal,timestamp);
		}
	}
	
	
	private void setUserIdAndTypeIndicator(List<ErmProductRestriction> restrictions,String userId, boolean isBusiness, Date timestamp) {
		setUserIdAndTypeIndicator(restrictions, userId, isBusiness, !isBusiness, timestamp);
	}
	
	private ErmValidation validateOverlapping(ErmProductRestriction restriction,List<ErmProductRestriction> others, boolean isProductLevel) {
		ErmValidation ermValidation = new ErmValidation();
		ermValidation.setValid(true);
		if (!isProductLevel) {
		  return ermValidation;
		}
		for (ErmProductRestriction otherProductRestriction : others) {						
			if (otherProductRestriction.getRestrictionCdId().compareTo(restriction.getRestrictionCdId()) == 0) {
				logger.log(Level.SEVERE,"restriction overlaps existing restriction ");
				ermValidation.setMessage("Info Code " + otherProductRestriction.getRestriction().getCode()+ " already exists for this product");
				ermValidation.setValid(false);
			}
		}		
		return ermValidation;
	}
	
	
	private void validateOverlapingRestritions(List<ErmProductRestriction> restrictions, boolean isProductLevel) throws ErmValidationException{
		if (restrictions==null||restrictions.size()==0) return;
		Long foxVersionId = restrictions.get(0).getFoxVersionId();		
		List<ErmProductRestriction> existingRestrictions = productRestrictionService.findAllProductRestrictions(foxVersionId);
		for (ErmProductRestriction productRestriction: restrictions) {					
			ErmValidation validation =validateOverlapping(productRestriction, existingRestrictions, isProductLevel);						
			if (!validation.isValid()) {				
				throw getValidationException(validation);
			}		
		}
	}
	
	private ErmValidationException getValidationException(ErmValidation validation) {
		return new ErmValidationException(validation.getMessage());
	}
	
	
	@Override
	public List<ErmProductRestriction> saveRestrictions(
			String userId, boolean isBusiness,
			List<ErmProductRestriction> restrictions)throws ErmValidationException {
		setUserInDBContext(userId, isBusiness);		
		Date timestamp = new Date();
		setUserIdAndTypeIndicator(restrictions, userId, isBusiness, timestamp);
		validateOverlapingRestritions(restrictions, false);
		return saveAfterValidation(restrictions);
	}
	
	
	
	@Override
	public ErmProductRestriction saveRestriction(
			String userId, boolean isBusiness,boolean isLegal,
			ErmProductRestriction restriction)throws ErmValidationException {
		setUserInDBContext(userId, isBusiness);		
		Date timestamp = new Date();
		setUserIdAndTypeIndicator(restriction, userId, isBusiness, isLegal,timestamp);
		List<ErmProductRestriction> list = new ArrayList<ErmProductRestriction>();
		list.add(restriction);
		validateOverlapingRestritions(list, false);
		if(restriction.getProductRestrictionId() != null && restriction.getProductRestrictionId() > 0){				
			return update(restriction);
		} else {
			return save(restriction);
		}					
	}
	

	private void linkCommentToProductInfoCodes(Comment comment,List<Long> ids,String userId) {
		if (ids==null||ids.isEmpty()) return;
		getLogger().info("Linking commment " + comment.getId() + " to  " + ids.size() + " product info codes");
		commentsService.linkCommentToEntities(comment, EntityType.PROD_RSTRCN.getId(), EntityCommentType.INFO_CODE.getId(), ids, userId);		
	}
	
	private void linkCommentToProductInfoCodes(Long commentId, List<Long> ids,String userId) {
		if (ids==null||ids.isEmpty()) return;
		getLogger().info("Linking commment " + commentId + " to  " + ids.size() + " product info codes");
		commentsService.linkCommentToEntities(commentId, EntityType.PROD_RSTRCN.getId(), EntityCommentType.INFO_CODE.getId(), ids, userId);		
	}
	
 
	

	public void createLinkedCommentForProductInfoCodes(List<Long> ids,String subject,String text,String userId,boolean isBusiness) {
		if (text==null||text.trim().isEmpty()) return;
		Comment comment = CommentCleanner.getComment(subject,text,userId,isBusiness);
		comment = commentsService.saveComment(comment, userId, isBusiness);		
		linkCommentToProductInfoCodes(comment, ids, userId);
	}
	
	
	@Override
	public List<ErmProductRestriction> saveRestrictions(String userId, boolean isBusiness,ProductRestrictionCreateObject createObject) throws ErmValidationException {
		ProductRestrictionCreateToRestrictionConverter converter = new ProductRestrictionCreateToRestrictionConverter();
		List<ErmProductRestriction> restrictions = converter.convert(createObject);		
		validateOverlapingRestritions(restrictions, true);
		List<ErmProductRestriction> saved =  saveRestrictions(userId, isBusiness, restrictions);
		List<Long> ids = IdsAccumulator.getIds(saved, new IdProvider<ErmProductRestriction>() {

			@Override
			public Long getId(ErmProductRestriction o) {
				return o.getProductRestrictionId();
			}
			
		});
		if (createObject.hasComment()) {
			Long commentId = createObject.getCommentId();
			linkCommentToProductInfoCodes(commentId, ids, userId);
		}
		return saved;
	}
	
	@Override
	public List<ErmProductRestriction> saveRestrictions(String userId, boolean isBusiness,String  createObjectJson) throws ErmValidationException {
		JsonToProductRestrictionCreateObjectConverter converter = new JsonToProductRestrictionCreateObjectConverter(jsonService);
		ProductRestrictionCreateObject createObject = converter.convert(createObjectJson);
		return saveRestrictions(userId, isBusiness, createObject);
	}
	
	public List<ErmProductRestriction> adoptRestrictions(String userId, boolean isBusiness,String  createObjectJson) throws ErmException {
		JsonToProductRestrictionCreateObjectConverter converter = new JsonToProductRestrictionCreateObjectConverter(jsonService);
		ProductRestrictionCreateObject createObject = converter.convert(createObjectJson);
		return adoptProductRestrictions(createObject, userId, isBusiness);
	}
	
	@Override
	/**
	 * Deletes a restriction completely. Note this doesn't unlink a restriction if the restriction is shared. 
	 * It is used for Do Not License
	 * @param userId
	 * @param restrictionId
	 */
	public void deleteRestriction(String userId, boolean isBusiness, List<Long> restrictionIds, Long foxVersionId) throws ErmValidationException {
		setUserInDBContext(userId, isBusiness);		
		for (Long restrictionId : restrictionIds) {
			Query query = em.createNativeQuery("call " + DELETE_PRODUCT_RESTRICTION_PROCEDURE_NAME);		
			query.setParameter(1, restrictionId);						
			query.setParameter(2, isBusiness ? 'B' : 'L');
			query.setParameter(3, userId.toUpperCase());
			query.setParameter(4, 'Y');			
			long t0 = System.currentTimeMillis();			
			query.executeUpdate();
			long t1 = System.currentTimeMillis();
			logger.info("Done deleting restriction in " + (t1-t0) + " ms");								
		}		
	}
	
//	@Override
//	public void deleteRestriction(String userId, boolean isBusiness, String q) throws ErmValidationException {
//		setUserInDBContext(userId, isBusiness);		
//		JsonToDeleteRightsRestrictionStrandCreateObject converter = new JsonToDeleteRightsRestrictionStrandCreateObject(jsonService);		 
//		DeleteRightsRestrictionStrandCreateObject deleteRightRestriction = converter.convert(q); 
//		logger.info("delete restriction called for:  " + q + " and userId: " + userId);
//		deleteRestriction(userId, isBusiness, deleteRightRestriction.getRightStrandRestrictionIds(), deleteRightRestriction.getFoxVersionId());		
//	}
	
	
	@Override
	public void saveDoNotLicense(Long foxVersionId,String userId, boolean isBusiness, boolean doNotLicense) throws ErmValidationException{
		List<ErmProductRestriction> restrictions = productRestrictionService.findRestriction(foxVersionId, DO_NOT_LICENSE_ID, true);
		logger.info("saveDoNotLicense:  " + doNotLicense + " restriction: " + restrictions);
		if (!doNotLicense && restrictions!=null  && restrictions.size() > 0) {
			List<Long> restrictionIds = new ArrayList<Long>();
			for (ErmProductRestriction restriction : restrictions) {
				restrictionIds.add(restriction.getProductRestrictionId());
				saveRestriction(userId, true, false, restriction);
				deleteRestriction(userId, true, restrictionIds, foxVersionId);
			}
		}
		if (doNotLicense&&(restrictions==null || restrictions.size() == 0)) {
		    restrictions = new ArrayList<>();
			ErmProductRestriction doNotLicenseRestriction = new ErmProductRestriction();
			doNotLicenseRestriction.setFoxVersionId(foxVersionId);
			doNotLicenseRestriction.setRestrictionCdId(DO_NOT_LICENSE_ID);
			restrictions.add(doNotLicenseRestriction);
			saveRestriction(userId, true,false, doNotLicenseRestriction);			
		}
	}

}
