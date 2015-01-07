package com.fox.it.erm.enums;

public enum GrantType {

	FILMS_CLIPS_STILLS(2L),
	REMAKES_SEQUELS(7L),
	LEGITIMATE_STAGE(10L),
	ANCILLARY_RIGHTS(13L),
	MERCHANDISING_COMMERCIAL_TIE_INS(3L),
	PAID_AD_MEMO(14L),
	//TODO, is this right? this in not in the Grant Code table
	COMMERICAL_TIE_INS(15L),
	BILLING_BLOCK(15L),
	TITLE_CREDITS(16L),
	ARTWORK_RESTRICTIONS(17L);
	
	private final Long id;
	
	private GrantType(Long id) {
		this.id = id;
	}
	
	
	public Long getId() {
		return id;
	}
	
	public String getName() {
		return toString();
	}
	
	public static GrantType get(Long id) {
		for (GrantType g: values()) {
			if (g.getId().equals(id)) {
				return g;
			}
		}
		return null;
	}

}
