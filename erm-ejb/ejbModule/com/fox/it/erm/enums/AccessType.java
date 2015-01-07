package com.fox.it.erm.enums;

public enum AccessType {
	PUBLIC(1L),
	PRIVATE(2L),
	PRIVATE_ADMIN(3L);
	
	private final Long id;
	
	private AccessType(Long id) {
		this.id = id;
	}
		
	public Long getId() {
		return id;
	}
}
