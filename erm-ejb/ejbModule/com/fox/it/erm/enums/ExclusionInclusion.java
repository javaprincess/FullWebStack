package com.fox.it.erm.enums;

public enum ExclusionInclusion {
	INCLUSION(1L),
	EXCLUSION(2L),
	BOTH(3L);

	private Long id;
	
	private ExclusionInclusion(Long id) {
		this.id = id;
	}
	
	public Long getId() {
		return id;
	}

}
