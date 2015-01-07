package com.fox.it.erm.service.documentmanagement;

import com.fox.it.erm.factories.attachment.AttachmentFactoryProduct;

public interface DocumentManagementService {

	public void save(String fileName);
	
	public AttachmentFactoryProduct retrieve(String fileName);
	
	public String getServiceName();
}
