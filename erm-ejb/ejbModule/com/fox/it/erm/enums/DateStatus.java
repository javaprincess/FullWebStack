package com.fox.it.erm.enums;

public enum DateStatus {
	ACTUAL(1L),
	ESTIMATED(2L);

	private Long id;
	private DateStatus(Long id) {
		this.id = id;
	}
	
	public Long getId() {
		return id;
	}

}
