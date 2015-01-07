package com.fox.it.erm.factories.attachment;

import com.fox.it.erm.enums.DocumentContentType;

public class PDFAttachment extends AttachmentFactoryProduct {
	
	static public class PDFAttachmentClass extends AttachmentFactory {
		
		public PDFAttachmentClass() {
			super(DocumentContentType.APP_PDF);
		}
		
		public AttachmentFactoryProduct createAttachment() {
			return new PDFAttachment(this);
		}
		
	}
	
	protected PDFAttachment(PDFAttachmentClass clazz) {
		super(clazz);
	}

	@Override
	public void getContent() {
		
	}
	
	

}
