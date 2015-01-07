package com.fox.it.erm.service.documentmanagement.providers.db;

import java.util.logging.Logger;

import com.fox.it.erm.factories.attachment.AttachmentFactoryProduct;
import com.fox.it.erm.service.documentmanagement.DocumentManagementService;

/**
 * 
 * @author tracyade
 * Manages documents stored in the database
 */
public class DBProvider implements DocumentManagementService {

	private final String serviceName = "DBProvider";
	
	private Logger logger = Logger.getLogger(DBProvider.class.getName());
	
	public void save(String fileName) {
		
		logger.info("saving...: " + fileName);
		
	}

	
	public AttachmentFactoryProduct retrieve(String fileName) {
		
		logger.info("retrieving...: " + fileName);
		return null;
	}


	@Override
	public String getServiceName() {
		
		return serviceName;
	}

}
