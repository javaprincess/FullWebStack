package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.fox.it.erm.ContractualPartyCriteria;
import com.fox.it.erm.EntityAttachment;
import com.fox.it.erm.ErmAccessType;
import com.fox.it.erm.ErmContactType;
import com.fox.it.erm.ErmContractInfo;
import com.fox.it.erm.ErmContractualPartyType;
import com.fox.it.erm.ErmCountry;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmOrganizationType;
import com.fox.it.erm.ErmParty;
import com.fox.it.erm.ErmPartyType;
import com.fox.it.erm.ErmProductContact;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.enums.AccessType;
import com.fox.it.erm.enums.ContactType;
import com.fox.it.erm.enums.EntityAttachmentType;
import com.fox.it.erm.enums.EntityCommentType;
import com.fox.it.erm.enums.EntityType;
import com.fox.it.erm.service.AttachmentsService;
import com.fox.it.erm.service.ContractualPartyService;
import com.fox.it.erm.service.comments.CommentsService;

@Stateless
public class ContractualPartyServiceImpl extends ServiceBase implements ContractualPartyService {
	
	private Logger logger = Logger.getLogger(ContractualPartyServiceImpl.class.getName());
	
	private static final String DELETE_ERMCONTRACTINFO_SQL = "delete from CNTRCT_INFO where CNTRCT_INFO_ID = ?";
	
	private static final String PARTIES_ASS_WITH_PRODUCTS_SQL = "select * from PARTY_VW where pty_id in (select pty_id from PROD_CNTCT) order by upper(disp_nm)";
	
	private List<ErmCountry> countries;	

	private static List<ErmParty> contractualParties;
	private static List<ErmParty> foxEntities;
	private static List<ErmContractualPartyType> contractualPartyTypes;
	private static List<ErmPartyType> partyTypes;
	private static List<ErmContactType> contactTypes;
	private static List<ErmAccessType> accessTypes;
	private static List<ErmOrganizationType> organizationTypes;
	private static Date cachePartiesTimestamp;
	private static Date cacheFoxEntitiesTimestamp;
	private static Date cacheContractualPartyTypesTimestamp;
	private static Date cacheContactTypesTimestamp;
	private static Date cacheAccessTypesTimestamp;
	
	
	@Inject
	private EntityManager em;
	
	@EJB
	private AttachmentsService attachmentsService;
	
	@EJB
	private CommentsService commentsService;
	
	protected boolean shouldReloadParties() {
		if (contractualParties==null||cachePartiesTimestamp==null) return true;
		Date lastChangeTimestamp = getLastChangeContractualPartiesTimestamp();
		if (cachePartiesTimestamp.compareTo(lastChangeTimestamp)<=0)			
			return true;
		return false;
	}
	protected boolean shouldReloadFoxEntities() {
		if (foxEntities==null||cacheFoxEntitiesTimestamp==null) return true;
		Date lastChangeTimestamp = getLastChangeContractualPartiesTimestamp();
		if (cacheFoxEntitiesTimestamp.compareTo(lastChangeTimestamp)<=0)			
			return true;
		return false;
	}
	protected boolean shouldReloadContractualPartyTypes() {
		if (contractualPartyTypes==null||cacheContractualPartyTypesTimestamp==null) return true;
		Date lastChangeTimestamp = getLastChangeContractualPartyTypesTimestamp();
		if (cacheContractualPartyTypesTimestamp.compareTo(lastChangeTimestamp)<=0)			
			return true;
		return false;
	}
	protected boolean shouldReloadPartyTypes() {
		if (partyTypes==null||partyTypes.size() == 0) return true;
		return false;
	}
	protected boolean shouldReloadContactTypes() {
		if (contactTypes==null||cacheContactTypesTimestamp==null) return true;
		Date lastChangeTimestamp = getLastChangeContactTypesTimestamp();
		if (cacheContactTypesTimestamp.compareTo(lastChangeTimestamp)<=0)			
			return true;
		return false;
	}
	protected boolean shouldReloadAccessTypes() {
		if (accessTypes==null||cacheAccessTypesTimestamp==null) return true;
		Date lastChangeTimestamp = getLastChangeAccessTypesTimestamp();
		if (cacheAccessTypesTimestamp.compareTo(lastChangeTimestamp)<=0)			
			return true;
		return false;
	}
	protected boolean shouldReloadOrganizationTypes() {
		if (organizationTypes==null||organizationTypes.size() == 0) return true;
		return false;
	}
	
	public Date getLastChangeContractualPartiesTimestamp() {
		return getLastModified("party_vw");
	}	
	public Date getLastChangeContractualPartyTypesTimestamp() {
		return getLastModified("ref_cntrct_pty_typ");
	}
	public Date getLastChangePartyTypesTimestamp() {
		return getLastModified("ref_party_typ");
	}	
	public Date getLastChangeContactTypesTimestamp() {
		return getLastModified("ref_cntct_typ");
	}
	public Date getLastChangeAccessTypesTimestamp() {
		return getLastModified("ref_access_typ");
	}
	
	@Override
	public List<ErmParty> findAllContractualParties() {
	  if (shouldReloadParties()) {
		logger.info("Reloading Parties from DB");
		contractualParties = ContractualPartyCriteria.getContractualPartiesCriteria(em).getResultList();
		Date date = new Date();
		cachePartiesTimestamp = date;
      } else {
		logger.info("Reloading Parties from Cache");
	  }
	  return contractualParties;
	}
	
	@Override
	public List<ErmParty> findAllFoxEntities() {
	  if (shouldReloadFoxEntities()) {
		logger.info("Reloading Fox Entities from DB");
		foxEntities = ContractualPartyCriteria.getFoxEntitiesCriteria(em).getResultList();		
		Date date = new Date();
		cacheFoxEntitiesTimestamp = date;
	  } else {
		logger.info("Reloading Fox Entities from Cache");
	  }				
	  return foxEntities;
	}	
	
	/**
	 * Finds all contacts associated with a product
	 */
	@Override
	public List<ErmParty> findAllContatsAssociatedWithProducts() {
		logger.info("Finding all products associated with products");
		Query q = em.createNativeQuery(PARTIES_ASS_WITH_PRODUCTS_SQL, ErmParty.class);
		@SuppressWarnings("unchecked")
		List<ErmParty> parties = q.getResultList();
		return parties;
	}
	
	
	@Override
	public List<ErmParty> findAllContacts(Long foxVersionId) {	  
	  logger.info("findAllContacts");
	  List<ErmProductContact> productContacts = ContractualPartyCriteria.getContactsForProductCriteria(em, foxVersionId).getResultList();
	  List<Long> partyIds = new ArrayList<Long>();
	  for (ErmProductContact productContact : productContacts)
		  partyIds.add(productContact.getPartyId());	  
	  List<ErmParty> contacts = ContractualPartyCriteria.getContactsCriteria(em, partyIds).getResultList();	  
	  //for (ErmParty contact : contacts) {
	    //List<EntityComment> comments = commentsService.findEntityComments(EntityType.CONTACT.getId().longValue(), contact.getPartyId(), EntityCommentType.CONTACT_COMMENT.getId().longValue());
	    //if (comments != null && comments.size() > 0)
		  //contact.setComment(comments.get(0));
	  //}
	  return contacts;
	}
	
	@Override
	public List<ErmParty> findAllContacts() {	  
	  logger.info("findAllContacts");
	  List<ErmParty> contacts = ContractualPartyCriteria.getContactsCriteria(em).getResultList();	  	  		
	  return contacts;
	}
	
	@Override
	public List<ErmParty> searchContacts(Long foxVersionId, ErmParty ermParty) {	  
	  logger.info("findAllContacts");
	  List<ErmProductContact> productContacts = ContractualPartyCriteria.getContactsForProductCriteria(em, foxVersionId).getResultList();
	  List<Long> partyIds = new ArrayList<Long>();
	  for (ErmProductContact productContact : productContacts)
		  partyIds.add(productContact.getPartyId());	  
	  List<ErmParty> contacts = ContractualPartyCriteria.getSearchContactsCriteria(em, ermParty, partyIds).getResultList();
	  return contacts;
	}
	
	@Override
	public ErmParty findContact(Long partyId) {	  
	  logger.info("findContact");	  	 
	  ErmParty contact = ContractualPartyCriteria.getContactCriteria(em, partyId).getSingleResult();	  
	  List<EntityComment> comments = commentsService.findEntityComments(EntityType.CONTACT.getId().longValue(), contact.getPartyId(), EntityCommentType.CONTACT_COMMENT.getId().longValue());
	  if (comments != null && comments.size() > 0)
		  contact.setComment(comments.get(0));
	  return contact;
	}
	
	@Override
	public List<ErmProductContact> findAllContactsForProduct(Long foxVersionId) {	  
	  logger.info("findAllProductContacts");
	  List<ErmProductContact> productContacts = ContractualPartyCriteria.getContactsForProductCriteria(em, foxVersionId).getResultList();
	  return productContacts;
	}
	
	@Override
	public List<ErmContractualPartyType> findAllContractualPartyTypes() {
	  if (shouldReloadContractualPartyTypes()) {
		logger.info("Reloading Contractual Party Types from DB");
		contractualPartyTypes = ContractualPartyCriteria.getContractualPartyTypesCriteria(em).getResultList();		
		Date date = new Date();
		cacheContractualPartyTypesTimestamp = date;
	  } else {
		logger.info("Reloading Contractual Party Types from Cache");
	  }								
	  return contractualPartyTypes;
	}
		
	@Override
	public List<ErmPartyType> findAllPartyTypes() {
	  if (shouldReloadPartyTypes()) {
		logger.info("Reloading Contractual Party Types from DB");
		partyTypes = ContractualPartyCriteria.getPartyTypesCriteria(em).getResultList();
	  } else {
		logger.info("Getting Party Types from Cache");
	  }								
	  return partyTypes;
	}
	
	
	@Override
	public List<ErmContactType> findAllContactTypes() {
	  if (shouldReloadContactTypes()) {
		logger.info("Reloading Contact Types from DB");
		contactTypes = ContractualPartyCriteria.getContactTypesCriteria(em).getResultList();		
		Date date = new Date();
		cacheContactTypesTimestamp = date;
	  } else {
		logger.info("Getting Contact Types from Cache");
	  }								
	  return contactTypes;
	}
	
	@Override
	public List<ErmAccessType> findAllAccessTypes() {
	  if (shouldReloadAccessTypes()) {
		logger.info("Reloading Access Types from DB");
		accessTypes = ContractualPartyCriteria.getAccessTypesCriteria(em).getResultList();		
		Date date = new Date();
		cacheAccessTypesTimestamp = date;
	  } else {
		logger.info("Getting Access Types from Cache");
	  }								
	  return accessTypes;
	}
	
	@Override
	public List<ErmOrganizationType> findAllOrganizationTypes() {
	  if (shouldReloadOrganizationTypes()) {
		logger.info("Reloading Organization Types from DB");
		organizationTypes = ContractualPartyCriteria.getOrganizationTypesCriteria(em).getResultList();		
	  } else {
		logger.info("Getting Organization Types from Cache");
	  }								
	  return organizationTypes;
	}
	
	private boolean shouldReloadCountries() {
		return shouldRefreshCache(countries);
	}
	
	@Override
	public List<ErmCountry> loadCountries() {
	  if (shouldReloadCountries()) {
		  countries =  ContractualPartyCriteria.getCountriesCriteria(em).getResultList();		  
	  }
	  Collections.sort(countries);	  
	  return countries;
	}
	
	
	/* (non-Javadoc)
	 * @see com.fox.it.erm.service.ContractualPartyService#findErmContractsByFoxVersionID(java.lang.Long)
	 */
	@Override
	public List<ErmContractInfo> findErmContractsByFoxVersionID(Long foxVersionId) {
		List<ErmContractInfo> contractInfoList = ContractualPartyCriteria.getErmContractInfoCriteria(foxVersionId, em).getResultList();
		for (ErmContractInfo contractInfo : contractInfoList) {
		  List<EntityComment> comments = commentsService.findEntityComments(EntityType.CONTRACT_INFO.getId().longValue(), contractInfo.getContractInfoId(), EntityCommentType.CONTRACTUAL_PARTY_COMMENT.getId().longValue());
		  for (EntityComment comment : comments) {			
			List<EntityAttachment> attachments = attachmentsService.findEntityAttachmentsForEntityTypeAndId(EntityType.COMMENT.getId().longValue(), comment.getCommentId(), EntityAttachmentType.COMMENT.getId());
			comment.setAttachments(attachments);			
		    contractInfo.setComment(comment);
		  }
		}
		return contractInfoList;
	}
	
	
	@Override
	public void deleteErmContract(Long contractInfoId, String userId, Boolean isBusiness) throws ErmException{																					
		// Delete all the comments and attachments for this entity comment
		List<EntityComment> comments = commentsService.findEntityComments(EntityType.CONTRACT_INFO.getId().longValue(), contractInfoId, EntityCommentType.CONTRACTUAL_PARTY_COMMENT.getId().longValue());
		for (EntityComment comment : comments) {
		  List<EntityAttachment> attachments = attachmentsService.findEntityAttachmentsForEntityTypeAndId(EntityType.COMMENT.getId().longValue(), comment.getCommentId(), EntityAttachmentType.COMMENT.getId());
		  for (EntityAttachment attachment : attachments)
		    attachmentsService.deleteAttachment(attachment.getDocumentId());
		  em.remove(comment);
		}
		logger.info("Deleting contractInfoId " + contractInfoId);								
		String sql = DELETE_ERMCONTRACTINFO_SQL;
		Query q =  em.createNativeQuery(sql);		
		q.setParameter(1, contractInfoId);
		q.executeUpdate();			
		em.flush();					
	}		
	
	@Override
	public void saveErmContractsByFoxVersionID(Long foxVersionId, String userId, Boolean isBusiness, List<ErmContractInfo> ermContractInfoList) throws ErmException{
		Date now = new Date();
		for (ErmContractInfo ermContractInfo: ermContractInfoList) {
		  ermContractInfo.setCreateDate(now);
		  ermContractInfo.setUpdateDate(now);
		  ermContractInfo.setCreateName(userId);
		  ermContractInfo.setUpdateName(userId);		  
		  ermContractInfo.setFoxVersionId(foxVersionId);			
		  saveErmContractInfo(foxVersionId,userId, isBusiness, ermContractInfo);
		}
	}
	
	@Override
	public void saveContact(ErmParty party, String userId, Boolean isBusiness) throws ErmValidationException, ErmException {
		Date now = new Date();
		if (party.getPartyId()==null||party.getPartyId().intValue()==0) {
			party.setCreateDate(now);
			party.setCreateName(userId);			
		}
		party.setUpdateDate(now);
		party.setUpdateName(userId);
		saveErmParty(userId, isBusiness, party);
		if (party.getComment() != null && party.getComment().getComment() != null) {
			if (party.getComment().getId() == null)		  
			  commentsService.addNewComment(EntityType.CONTACT.getId(), party.getPartyId(), EntityCommentType.CONTACT_COMMENT.getId(), party.getComment().getComment(), userId, isBusiness);
			else								    
			  commentsService.saveComment(party.getComment().getComment(), userId, isBusiness);
		}
	}

	@Override
	public void assignContactToProduct(Long foxVersionId, String userId, Boolean isBusiness, Long partyId) throws ErmValidationException, ErmException {
		assignContactToProduct(foxVersionId,userId,isBusiness,partyId,AccessType.PRIVATE_ADMIN.getId());
	}
	
	@Override
	public void assignContactToProduct(Long foxVersionId, String userId, Boolean isBusiness, Long partyId,Long accessTypeId, Long contactTypeId) throws ErmValidationException, ErmException {
		Date now = new Date();
		ErmProductContact ermProductContact = new ErmProductContact();		
		ermProductContact.setCreateDate(now);
		ermProductContact.setUpdateDate(now);
		ermProductContact.setCreateName(userId);
		ermProductContact.setUpdateName(userId);
		ermProductContact.setDelInd(false);
		ermProductContact.setFoxVersionId(foxVersionId);
		ermProductContact.setPartyId(partyId);
		ermProductContact.setContactTypeId(contactTypeId);
		ermProductContact.setAccessTypeId(accessTypeId);
		saveErmProductContact(userId, isBusiness, ermProductContact);
		
		
	}
	
	@Override
	public void assignContactToProduct(Long foxVersionId, String userId, Boolean isBusiness, Long partyId,Long accessTypeId) throws ErmValidationException, ErmException {
		assignContactToProduct(foxVersionId, userId, isBusiness, partyId,accessTypeId,ContactType.FOX_CONTACT.getId());
	}
	
	
	@Override
	public void switchAccessType(Long productContactId, String userId, Boolean isBusiness, Long accessTypeId) throws ErmValidationException, ErmException {
		Date now = new Date();
		ErmProductContact ermProductContact = ContractualPartyCriteria.getContactForProductCriteria(em, productContactId).getSingleResult();		
		ermProductContact.setUpdateDate(now);		
		ermProductContact.setUpdateName(userId);		
		ermProductContact.setAccessTypeId(accessTypeId);		
		saveErmProductContact(userId, isBusiness, ermProductContact);
	}
	
	@Override
	public void switchContactType(Long productContactId, String userId, Boolean isBusiness, Long contactTypeId) throws ErmValidationException, ErmException {
		Date now = new Date();
		ErmProductContact ermProductContact = ContractualPartyCriteria.getContactForProductCriteria(em, productContactId).getSingleResult();		
		ermProductContact.setUpdateDate(now);		
		ermProductContact.setUpdateName(userId);		
		ermProductContact.setContactTypeId(contactTypeId);		
		saveErmProductContact(userId, isBusiness, ermProductContact);
	}
	
	@Override
	public void deleteErmProductContact(Long productContactId, String userId, Boolean isBusiness) throws ErmException{																					
		Date now = new Date();
		ErmProductContact ermProductContact = ContractualPartyCriteria.getContactForProductCriteria(em, productContactId).getSingleResult();		
		ermProductContact.setUpdateDate(now);		
		ermProductContact.setUpdateName(userId);		
		ermProductContact.setDelInd(true);	
		saveErmProductContact(userId, isBusiness, ermProductContact);				
	}
	
	public void saveErmContractInfo(Long foxVersionId, String userId, Boolean isBusiness, ErmContractInfo ermContractInfo) throws ErmException{
		setUserInDBContext(userId, isBusiness);
		if (ermContractInfo.getContractInfoId() != null && ermContractInfo.getContractInfoId() > 0)
			em.merge(ermContractInfo);
		else
			em.persist(ermContractInfo);
		em.flush();
	}
	
	public void saveErmParty(String userId, Boolean isBusiness, ErmParty party) throws ErmException{
		setUserInDBContext(userId, isBusiness);
		if (party.getPartyId() != null && party.getPartyId() > 0)
		  em.merge(party);
		else
		  em.persist(party);
		em.flush();
	}

	
	public void saveErmProductContact(String userId, Boolean isBusiness, ErmProductContact ermProductContact) throws ErmException{
		setUserInDBContext(userId, isBusiness);
		if (ermProductContact.getProductContactId() != null && ermProductContact.getProductContactId() > 0)
		  em.merge(ermProductContact);
		else
		  em.persist(ermProductContact);
		em.flush();
	}

}
