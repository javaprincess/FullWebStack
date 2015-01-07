package com.fox.it.erm.enums;

public enum ContactType {
	FOX_CONTACT(1L),
	ATTORNEY(2L),
	RESTRICTION_CONTACT(3L);
	
	private final Long id;
	
	private ContactType(Long id) {
		this.id = id;
	}
		
	public Long getId() {
		return id;
	}
}
