package com.fox.it.erm.service;

public interface DocumentsUrlProvider extends AttachmentUrlProvider{
	String getDocumentFullyQualifiedURL();
	
	String getBaseUrl();
	
	String getLogoUrl();
}
