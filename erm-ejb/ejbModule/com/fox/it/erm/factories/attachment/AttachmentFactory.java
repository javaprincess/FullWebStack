package com.fox.it.erm.factories.attachment;

import com.fox.it.erm.enums.DocumentContentType;

public abstract class AttachmentFactory {
	
	private DocumentContentType contentType;
	
	public AttachmentFactory(DocumentContentType cType) {
		contentType = cType;
	}

	public DocumentContentType getContentType() {
		return contentType;
	}
	
	public abstract AttachmentFactoryProduct createAttachment();
}
