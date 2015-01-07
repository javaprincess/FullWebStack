package com.fox.it.erm.service.comments.attachments;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.service.documentmanagement.providers.db.Attachment;

//TODO remove not used?
@Stateless
@Deprecated
public class AttachmentServiceBean implements AttachmentService {
	
	@Inject
	EntityManager eM;
	
	private Logger logger = Logger.getLogger(AttachmentServiceBean.class.getName());

	@Override
	public Long save(Long entityTypeId, Long entityKey,
			Long entityCommentTypeId, String fileName, String userId,
			boolean isBusiness) {
	
		Attachment attachment  = new Attachment();
		
		attachment.setFileName(fileName);
		attachment.setCreateName(userId);
		
		logger.info("saving the attachment with name: " + fileName + "for the user: " + userId);
		
		try {
			eM.persist(attachment);
			eM.flush();
		} catch (Exception e) {
			logger.log(Level.SEVERE, "something horrible has happened in the process of saving.");
		}
		
		return null;
	}



	
}
