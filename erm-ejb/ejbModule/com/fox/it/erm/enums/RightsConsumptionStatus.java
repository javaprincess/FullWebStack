package com.fox.it.erm.enums;

public enum RightsConsumptionStatus {	
	PRIVATE(1L),
	PUBLIC(2L);
	
	private final Long id;
	
	private RightsConsumptionStatus(Long id) {
		this.id= id;
	}
	
	public Long getId() {
		return id;
	}
}
