package com.fox.it.erm.factories.attachment;

import com.fox.it.erm.enums.DocumentContentType;

//this is abstract representation of the product produced by the factory
public abstract class AttachmentFactoryProduct {
	AttachmentFactory factory = null;
	
	
	//the specialized implementations of the attachment (PDFAttachment, XCELAttachment, EmailAttachment, etc)
	//will call this constructor
	//these specialized implementations are specific factory products
	//each is a child of the factory
	//so in the protected constructor of the specific product, there 
	//is going to call super so we know WHAT is being created.
	public AttachmentFactoryProduct(AttachmentFactory theFactory) {
		
		factory = theFactory;
		
	}
	
	public AttachmentFactory getFactory() {
		return factory;
	}
	
	public DocumentContentType getContentType() {
		
		return factory.getContentType();
	}

	//of course this should return something
	//it is going to return the actual content of whatever is attached
	//I just haven't done this part yet....TODO
	public abstract void getContent();
}
