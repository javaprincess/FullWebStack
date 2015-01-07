package com.fox.it.erm.service.impl;

import java.io.IOException;
import java.io.OutputStream;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.fox.it.erm.Document;
import com.fox.it.erm.EntityAttachment;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.enums.DocumentContentType;
import com.fox.it.erm.enums.EntityAttachmentType;
import com.fox.it.erm.enums.EntityType;
import com.fox.it.erm.service.AttachmentsService;
import com.fox.it.erm.service.PropertiesService;
import com.fox.it.erm.service.comments.attachments.DBAttachmentReader;
import com.fox.it.erm.service.comments.attachments.DBUploadProcessor;
import com.fox.it.erm.service.comments.attachments.UploadException;
import com.fox.it.erm.service.comments.attachments.UploadProcessor;
import com.fox.it.erm.util.EntityManagerConnectionProvider;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.JPA;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
import com.fox.it.erm.util.UpdatableProcessor;
import com.google.common.base.Function;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

/**
 * Retrieves and saves the attachments for an entity
 * @author JonathanP
 *
 */

@Stateless
public class AttachmentsServiceBean extends ServiceBase implements AttachmentsService {

	static final String UPLOAD_DIR_PATH_PROPERTY_NAME="upload.path";
	static final String DOWNLOAD_DIR_PATH_PROPERTY_NAME="download.path";
	
	private static final String DELETE_DOCUMENT_SQL = "delete from document where doc_id = ?";
	private static final String DELETE_ENTITY_ATTACHMENT_SQL = "delete from ENTTY_ATTCHMNT where doc_id = ?";

	
	private static final Logger logger = Logger.getLogger(AttachmentsServiceBean.class.getName());
	
	@Inject
	private EntityManager em;
	

	@Inject
	private EntityManagerConnectionProvider connectionProvider;
		
	private UploadProcessor uploadProcessor;
	
	private DBAttachmentReader dbAttachmentReader;
	
	@EJB
	@Inject
	private PropertiesService propertiesService;
	

	private EntityAttachmentSearchCriteria getEntityAttachmentsCriteria(){
		return new EntityAttachmentSearchCriteria(em);
	}
	
	
	private Logger getLogger() {
		return logger;
	}
	
	@Override
	public String getUploadFileLocation() {
		return propertiesService.getValue(UPLOAD_DIR_PATH_PROPERTY_NAME);
	}


	@Override
	public String getDocumentOuputType(Long documentTypeId) {
		DocumentContentType documentContentType = DocumentContentType.get(documentTypeId);
		if (documentContentType!=null) {
			return documentContentType.getOutputType();
		}
		//default return octet stream
		return "application/octet-stream";
	}
	
	@Override
	public List<EntityAttachment> findEntityAttachmentsForProductVersion(
			Long foxVersionId) {
		EntityAttachmentSearchCriteria criteria = getEntityAttachmentsCriteria();
		criteria.setEntityTypeId(EntityType.PRODUCT_VERSION.getId().longValue());
		criteria.setEntityId(foxVersionId);
		List<EntityAttachment> attachments = criteria.getResultList();
		return attachments;
	}
	
	@Override
	public List<EntityAttachment> findEntityAttachments(Long entityTypeId, Long entityKey,Long attachmentTypeId) {
		EntityAttachmentSearchCriteria criteria = getEntityAttachmentsCriteria();
		criteria.setEntityTypeId(entityTypeId);
		criteria.setEntityId(entityKey);
		criteria.setAttachmentTypeId(attachmentTypeId);
		List<EntityAttachment> attachments = criteria.getResultList();
		return attachments;
		 
	 }
	 
	@Override
	public List<EntityAttachment> findEntityAttachmentsForEntityTypeAndId(Long entityTypeId, Long entityId, Long attachmentTypeId) {
		EntityAttachmentSearchCriteria criteria = getEntityAttachmentsCriteria();
		criteria.setEntityTypeId(entityTypeId);
		criteria.setEntityId(entityId);
		criteria.setAttachmentTypeId(attachmentTypeId);
		List<EntityAttachment> attachments = criteria.getResultList();
		logger.info("attachments entityTypeId : " + entityTypeId + " entityId: " + entityId + " attachmentTypeId: " +  attachmentTypeId + " attachments: " + attachments);
		Collections.reverse(attachments);
		return attachments;		
	}
	
	private List<EntityAttachment> findEntityAttachmentsForCommentIdsInBatch(List<Long> commentIds) {
		if (commentIds==null||commentIds.isEmpty()) {
			return new ArrayList<>();
		}
		EntityAttachmentSearchCriteria criteria = getEntityAttachmentsCriteria();
		criteria.setEntityTypeId(EntityType.COMMENT.getId());
		criteria.setEntityIds(commentIds);
		return criteria.getResultList();		
	}
	
	@Override
	public List<EntityAttachment> findEntityAttachmentsForCommentIds(List<Long> commentIds) {
		if (commentIds==null||commentIds.isEmpty()) {
			return new ArrayList<>();
		}
		if (commentIds.size()<=JPA.IN_LIMIT) {
			return findEntityAttachmentsForCommentIdsInBatch(commentIds);
		}
		List<List<Long>> lists = Lists.partition(commentIds, JPA.IN_LIMIT);
		List<EntityAttachment> all = new ArrayList<>();
		for (List<Long> l: lists) {
			List<EntityAttachment> attachments = findEntityAttachmentsForCommentIdsInBatch(l);
			all.addAll(attachments);
		}
		return all;
	}
	
	@Override
	public Document saveDocument(Document document, String userId, boolean isBusiness) throws ErmException {		
		setUserInDBContext(userId, isBusiness);
		UpdatableProcessor.setUserIdAndTypeIndicator(document, userId, isBusiness, !isBusiness,  new java.util.Date());
		Document merged = em.merge(document);
		em.flush();			
		return merged;
	}

	private EntityAttachment getEntityAttachment(Long entityTypeId,Long entityKey,Long attachmentTypeId,String userId,Date timestamp) {
		Long maxAttachmentSeq = getMaxEntityAttachmentSeq(entityTypeId, entityKey);
		EntityAttachment entityAttachment = new EntityAttachment();
		entityAttachment.setEntityId(entityKey);
		entityAttachment.setEntityTypeId(entityTypeId);
		entityAttachment.setAttachmentTypeId(attachmentTypeId);
		entityAttachment.setAttachmentSequence(maxAttachmentSeq+1);
		entityAttachment.setCreateDate(timestamp);
		entityAttachment.setUpdateDate(timestamp);
		entityAttachment.setCreateName(userId);
		entityAttachment.setUpdateName(userId);
		return entityAttachment;		
	}
	
	private EntityAttachment save(EntityAttachment entityAttachment) {
		EntityAttachment saved = em.merge(entityAttachment);
		return saved;
	}
	
	@Override
	public EntityAttachment createNewEntityAttachmentFromCopiedDoc(Long entityTypeId, EntityAttachment entityAttachment, Long documentId, Long entityKey, String userId, boolean isBusiness) throws ErmException {
		//first create the attachment			
		EntityAttachment savedEntityAttachment = null;
		Date now = new Date();		
		EntityAttachment newEntityAttachment = getEntityAttachment(entityAttachment.getEntityTypeId(), entityKey, entityAttachment.getAttachmentTypeId(), userId,now);
		newEntityAttachment.setDocumentId(documentId);		
		newEntityAttachment.setAttachmentName(entityAttachment.getAttachmentName());
		savedEntityAttachment = save(newEntityAttachment);
		em.flush();					
		return savedEntityAttachment;
	}
	
	@Override
	public EntityAttachment addNewDocument(Long entityTypeId,Long entityKey, Long attachmentTypeId, Document document, String filePath, String userId, boolean isBusiness) throws ErmException {
		//first create the attachment			
		EntityAttachment savedEntityAttachment = null;
		try {					
			Document saved = saveDocument(document, userId, isBusiness);
			Long documentId = saved.getId();
			Date now = new Date();			
			EntityAttachment entityAttachment = getEntityAttachment(entityTypeId, entityKey, attachmentTypeId, userId,now);
			entityAttachment.setDocumentId(documentId);
			entityAttachment.setAttachmentName(document.getDocumentName());
			savedEntityAttachment = save(entityAttachment);
			em.flush();
			uploadProcessor = new DBUploadProcessor(connectionProvider.get());			
			// upload content length of document
			int numberOfBytes = uploadProcessor.upload(filePath, saved.getId());
			saved.setContentLength(new Integer(numberOfBytes).longValue());
			saveDocument(saved, userId, isBusiness);			
		} catch (IOException e) {
		  logger.log(Level.SEVERE,"IOException: ", e);
		  throw new ErmException(e);
		} catch (UploadException e) {
		  logger.log(Level.SEVERE,"UploadException: ", e);
		  throw new ErmException(e);
		}
		return savedEntityAttachment;
	}

	@Override
	public Long getMaxEntityAttachmentSeq(Long entityTypeId, Long entityKey) {
		String ql = "select max(e.attachmentSequence) from EntityAttachment e";
		Long seq = (Long)em.createQuery(ql).getSingleResult();
		if (seq==null)
		  seq=0L;		
		return new Long(seq.longValue());
	}

	@Override
	public void getDocumentContent(Long documentId, OutputStream os) throws SQLException, IOException {		
		dbAttachmentReader = new DBAttachmentReader(connectionProvider.get());		
		dbAttachmentReader.write(documentId, os);		
	}

	@Override
	public List<Document> findDocuments(List<Long> ids) {
		if (ids==null||ids.size()==0) return new ArrayList<>();
		DocumentSearchCriteria criteria = new DocumentSearchCriteria(em);
		return criteria.setIds(ids).getResultList();
	}
	
	@Override
	public Document findDocumentById(Long id) {
		DocumentSearchCriteria criteria = new DocumentSearchCriteria(em);
		return criteria.setId(id).getSingleResult();		 
	}
	
	@Override
	public void setDocumentName(Long documentId, String name,String userId,boolean isBusiness) throws ErmException {
		Document document = findDocument(documentId);
		if (document!=null) {
			UpdatableProcessor.setUserIdAndTypeIndicator(document, userId, isBusiness, !isBusiness,  new java.util.Date());
			document.setDocumentName(name);
		}
		em.flush();
	}
	
	@Override
	public void setDocumentContent(Long documentId, String filePath, String userId, boolean isBusiness) throws ErmException {
		try {
			Document document = findDocument(documentId);
			uploadProcessor = new DBUploadProcessor(connectionProvider.get());		
			uploadProcessor.upload(filePath, document.getId());
		} catch (IOException | UploadException e) {
			String message = "Error setting document content for documentId: " + documentId + " and filepath " + filePath;
			getLogger().log(Level.SEVERE,message,e);
			throw new ErmException(message,e);
		}	
	}
	
	private Document findDocument(Long id) {
		DocumentSearchCriteria criteria = new DocumentSearchCriteria(em).setId(id);
		Document document = criteria.getSingleResult();				
//		Document document = em.find(Document.class, id);
		return document;
	}		
	
	/**
	 * Copies the document content from one document to another using raw SQL to avoid
	 * round trips of a CLOB from oracle to Java
	 * @param fromDocumentId
	 * @param toDocumentId
	 */
	@Override
	public void updateDocumentContent(Long fromDocumentId,Long toDocumentId) {	
		getLogger().info("Updating content of document " + toDocumentId + " from document " + fromDocumentId);
		String sql = "Update document set doc_content = (select doc_content from document where doc_id =?) where doc_id=?";
		Query query = em.createNativeQuery(sql);
		query.setParameter(1, fromDocumentId);
		query.setParameter(2, toDocumentId);
		int updated = query.executeUpdate();
		getLogger().info("Updated conent of " + updated + " documents");
	}
	
	
	@Override
	public Long copy(Long documentId, String userId, boolean isBusiness)  {
		 Document document = findDocument(documentId);
		 return copy(document,userId,isBusiness);
	}
	
	private Long copy(Document document,String userId, boolean isBusiness){
		 Long documentId = document.getId();
		 Document newDocument = new Document();
		 newDocument.copyBasicFrom(document);
		 UpdatableProcessor.setUserIdAndTypeIndicator(newDocument, userId, isBusiness, !isBusiness, new Date());
		 em.persist(newDocument);
		 em.flush();
		 Long newDocumentId = newDocument.getId();
		 updateDocumentContent(documentId, newDocumentId);
		 return newDocumentId;
		
	}
	
	
	
	@Override
	public void deleteAttachment(Long documentId) throws ErmException{
		getLogger().info("Deleting atatchment for documentid " +  documentId);					
		String sql = DELETE_ENTITY_ATTACHMENT_SQL;
		Query q =  em.createNativeQuery(sql);
		q.setParameter(1, documentId);
		q.executeUpdate();			
		em.flush();
		
		sql = DELETE_DOCUMENT_SQL;
		q =  em.createNativeQuery(sql);
		q.setParameter(1, documentId);
		q.executeUpdate();			
		em.flush();
	}

	
	private Map<Long,Document> toDocumentMapById(List<Document> documents) {
		Map<Long,Document> documentsById = Maps.uniqueIndex(documents, new Function<Document,Long>() {

			@Override
			public Long apply(Document document) {
				return document.getId();
			}
			
		});
		return documentsById;
	}
	
	
	private Map<Long,Document> getDocumentsByDocumentId(List<EntityAttachment> entityAttachments) {
		Map<Long,Document> map = new HashMap<>();
		if (entityAttachments==null||entityAttachments.isEmpty()) {
			return map;
		}
		List<Long> documentIds = IdsAccumulator.getIds(entityAttachments, new IdProvider<EntityAttachment>() {

			@Override
			public Long getId(EntityAttachment o) {
				return o.getDocumentId();
			} 				
		});
		List<Document> documents = findDocuments(documentIds);
		Map<Long,Document> documentsMap = toDocumentMapById(documents);

		for (EntityAttachment attachment: entityAttachments) {
			Long documentId = attachment.getDocumentId();
			if (documentsMap.containsKey(documentId)) {
				Document document = documentsMap.get(documentId);
				map.put(documentId,document);
			}
		}
		return map;
	}
	
	
	@Override
	public void copyAttachments(Long fromCommentId, Long toCommentId,String userId, boolean isBusiness) {
		List<EntityAttachment> attachments = findEntityAttachmentsForEntityTypeAndId(EntityType.COMMENT.getId(), fromCommentId, EntityAttachmentType.COMMENT.getId());
		if (attachments==null||attachments.isEmpty()) {
			return;
		}
		Map<Long,Document> documentsMap = getDocumentsByDocumentId(attachments);
		for (EntityAttachment attachment: attachments) {
			Long id = attachment.getDocumentId();
			if (documentsMap.containsKey(id)) {
				Document document = documentsMap.get(id);
				Long clonedDocumentId = copy(document, userId, isBusiness);	
				//now we need to create a new EntityAttachment with the cloned documentId
				Date now = new Date();
				EntityAttachment entityAttachment = getEntityAttachment(attachment.getEntityTypeId(), toCommentId, attachment.getAttachmentTypeId(), userId,now);
				entityAttachment.setAttachmentName(attachment.getAttachmentName());
				entityAttachment.setDocumentId(clonedDocumentId);

				//now just persist the entity attachment
				em.persist(entityAttachment);
			}
		}
	 
	}
	
}
