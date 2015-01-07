package com.fox.it.erm.enums;

public enum EntityCommentType {
		PROMO_MATERIALS(10L),
		CLEARANCE_MEMO(11L),
		CLEARANCE_MEMO_COMMENT(12L),
		SUBRIGHTS(13L),
		MAY_ACQUIRE_RIGHTS(14L),
		PRODUCT_INFO(15L),		
		DO_NOT_LICENSE(16L),
		RIGHT_STRAND_COMMENT(17L),
		INFO_CODE(18L),
		SALES_AND_MARKETING_GNRL(19L),
		SALES_AND_MARKETING_SPECIAL(20L),
		CLEARANCE_MEMO_MAP(21L),
		CONTRACTUAL_PARTY_COMMENT(22L),
		CONTACT_COMMENT(23L);
		
		private final Long id;
		
		private EntityCommentType(Long id) {
			this.id = id;
		}
		
		
		public Long getId() {
			return id;
		}


}
