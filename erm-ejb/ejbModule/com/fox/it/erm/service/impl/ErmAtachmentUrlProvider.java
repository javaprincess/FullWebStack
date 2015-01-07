package com.fox.it.erm.service.impl;

import com.fox.it.erm.EntityAttachment;
import com.fox.it.erm.service.AttachmentUrlProvider;

public class ErmAtachmentUrlProvider implements AttachmentUrlProvider {
	private final String qualifiedURLPrefix;
	
	public ErmAtachmentUrlProvider(String baseUrl) {
		this.qualifiedURLPrefix = baseUrl;
	}

	@Override
	public String get(EntityAttachment attachment) {
		String str = qualifiedURLPrefix + "/rest/Comments/getAttachment/" + attachment.getDocumentId() + "/" + attachment.getAttachmentName();
		return str;
	}

}
