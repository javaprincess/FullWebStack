package com.fox.it.erm.enums;

public enum EntityType {
	PRODUCT_VERSION(1L),
	STRAND(2L),
	STRAND_RESTRICTION(3L),
	PROD_RSTRCN(4L),	
	PRODUCT_GRANT(5L),
	CONTRACT_INFO(6L),
	PRODUCT_PROMO_MTRL(7L),
	COMMENT(8L),
	CONTACT(9L),
	PRODUCT_CONTACT(10L);
	
	
	private final Long id;
	
	private EntityType(Long id) {
		this.id = id;
	}
	
	
	public Long getId() {
		return id;
	}
}
