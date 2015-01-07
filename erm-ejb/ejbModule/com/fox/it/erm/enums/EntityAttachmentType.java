package com.fox.it.erm.enums;

public enum EntityAttachmentType {
	COMMENT(1l),
	CLEARANCE_MEMO_VERSION(2l);	
	
	private final Long id;
	
	private EntityAttachmentType(Long id) {
		this.id = id;
	}
	
	
	public Long getId() {
		return id;
	}
}
