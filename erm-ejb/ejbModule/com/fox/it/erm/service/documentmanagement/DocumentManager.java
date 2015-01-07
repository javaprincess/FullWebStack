package com.fox.it.erm.service.documentmanagement;

import java.io.Serializable;

import org.springframework.beans.factory.annotation.Autowired;

/**
 * 
 * @author tracyade
 * knows who is going to be responsible for
 * document management.  
 *
 */
@SuppressWarnings("serial")
public class DocumentManager implements Serializable {
	
	@Autowired
	DocumentManagementService documentManagementService;

	public DocumentManagementService getDocumentManagementService() {
		return documentManagementService;
	}

	public void setDocumentManagementService(
			DocumentManagementService documentManagementService) {
		this.documentManagementService = documentManagementService;
	}
	
	

}
