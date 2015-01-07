package com.fox.it.erm.service;

import java.io.IOException;
import java.io.OutputStream;
import java.sql.SQLException;
import java.util.List;

import javax.ejb.Local;

import com.fox.it.erm.Document;
import com.fox.it.erm.EntityAttachment;
import com.fox.it.erm.ErmException;

/**
 * Retrieves and saves the attachments for an entity
 * @author JonathanP
 *
 */
@Local
public interface AttachmentsService {
	
	 public List<EntityAttachment> findEntityAttachmentsForProductVersion(Long foxVersionId);
	 
	 public List<EntityAttachment> findEntityAttachments(Long entityTypeId, Long entityKey, Long entityCommentTypeId);
	 
	 public List<Document> findDocuments(List<Long> ids);
	 
	 public Document findDocumentById(Long id);
	 
	 public String getDocumentOuputType(Long documentTypeId);
	 
	 public List<EntityAttachment> findEntityAttachmentsForEntityTypeAndId(Long entityTypeId, Long entityId, Long entityAttachmentTypeId);	 	 	 
	 	 
	 public Document saveDocument(Document document, String userId, boolean isBusiness) throws ErmException;
	 
	 public Long getMaxEntityAttachmentSeq(Long entityTypeId, Long entityKey);
	 
	 public EntityAttachment addNewDocument(Long entityTypeId,Long entityKey,Long attachmentTypeId, Document document, String filePath, String userId,boolean isBusiness) throws ErmException;		
	 
	 public EntityAttachment createNewEntityAttachmentFromCopiedDoc(Long entityTypeId, EntityAttachment entityAttachment, Long documentId, Long entityKey, String userId, boolean isBusiness) throws ErmException;
		 	
	 public void getDocumentContent(Long documentId, OutputStream os) throws SQLException, IOException;
	 
	 public void setDocumentName(Long documentId, String name,String userId,boolean isBusiness) throws ErmException;
	 
	 public void setDocumentContent(Long documentId, String filePath, String userId, boolean isBusiness) throws ErmException;
	 
	 public String getUploadFileLocation();
	 
	 public Long copy(Long documentId, String userId, boolean isBusiness) throws ErmException;
		 
	 public void deleteAttachment(Long documentId) throws ErmException;
	 
	 public void updateDocumentContent(Long fromDocumentId,Long toDocumentId);
	 
	 public void copyAttachments(Long fromCommentId, Long toCommentId,String userId, boolean isBusiness);
	 
	 public List<EntityAttachment> findEntityAttachmentsForCommentIds(List<Long> commentIds);	 
}
