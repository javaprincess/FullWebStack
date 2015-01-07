package com.fox.it.erm.service.impl;

import com.fox.it.erm.EntityAttachment;
import com.fox.it.erm.service.AttachmentUrlProvider;
import com.fox.it.erm.service.DocumentsUrlProvider;

public class ErmDocumentsUrlProvider implements DocumentsUrlProvider {
	private AttachmentUrlProvider attachmentUrlProvider;
	private final String baseUrl;
	private final String fullyQualifiedUrl;
	
	public ErmDocumentsUrlProvider(String baseUrl, String fullyQualifiedUrl) {
		this.baseUrl = baseUrl;
		this.fullyQualifiedUrl = fullyQualifiedUrl;
		attachmentUrlProvider = new ErmAtachmentUrlProvider(baseUrl);
		
	}

	@Override
	public String get(EntityAttachment attachment) {
		return attachmentUrlProvider.get(attachment);
	}

	@Override
	public String getDocumentFullyQualifiedURL() {
		return fullyQualifiedUrl;
	}

	@Override
	public String getBaseUrl() {
		return baseUrl;
	}

	@Override
	public String getLogoUrl() {
		String logoUrl = baseUrl + "/img/20th_century_fox_logo.gif";
		return logoUrl;
	}

}
