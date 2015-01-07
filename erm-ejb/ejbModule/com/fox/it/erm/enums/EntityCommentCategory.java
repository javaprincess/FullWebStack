package com.fox.it.erm.enums;

public enum EntityCommentCategory {
	CLEARANCE_MEMO(1L),
	CLEARANCE_MEMO_COMMENT(2L),
	GENERAL(3L),
	SUBRIGHTS(4L),
	STRANDS(5L),
	INFO_CODES(6L),
	SALES_AND_MARKETING(7L);
	
	private final Long id;
	
	private EntityCommentCategory(Long id) {
		this.id = id;
	}
		
	public Long getId() {
		return id;
	}

}
