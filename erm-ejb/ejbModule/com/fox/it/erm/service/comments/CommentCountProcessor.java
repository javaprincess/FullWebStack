package com.fox.it.erm.service.comments;

import javax.persistence.EntityManager;
import javax.persistence.Query;

public class CommentCountProcessor {
	
	private static final String BASE_STRAND_SQL = "select count(distinct c.cmnt_id) from entty_cmnt ec, cmnt c " +
												  "where " +
												  "C.CMNT_ID = EC.CMNT_ID and " +
												  "entty_cmnt_typ_id = 17 and ec.entty_typ_id =2 and " +
												  "exists (select 1 from rght_strnd s where S.RGHT_STRND_ID = EC.ENTTY_KEY and S.FOX_VERSION_ID = ?) ";

	private static final String BASE_STRAND_FOR_STRAND_SQL = "select count(distinct c.cmnt_id) from entty_cmnt ec, cmnt c " +
															  "where " +
															  "C.CMNT_ID = EC.CMNT_ID and " +
															  "entty_cmnt_typ_id = 17 and ec.entty_typ_id =2 and " +
															  "EC.ENTTY_KEY=? ";
	
	
	private static final String BASE_STRAND_RESTRICTION_SQL = "select count(distinct c.cmnt_id) from entty_cmnt ec, cmnt c " +
															  "where  " +
															  "C.CMNT_ID = EC.CMNT_ID and " +
															  "entty_cmnt_typ_id = 18 and entty_typ_id =3 and " +
															  "exists (select 1 from rght_rstrcn rr,  rght_strnd r where EC.ENTTY_KEY = RR.RGHT_RSTRCN_ID and RR.RGHT_STRND_ID = R.RGHT_STRND_ID and R.FOX_VERSION_ID  = ? )";


	private static final String BASE_STRAND_RESTRICTION_FOR_STRAND_SQL = "select count(distinct c.cmnt_id) from entty_cmnt ec, cmnt c " +
																		  "where  " +
																		  "C.CMNT_ID = EC.CMNT_ID and " +
																		  "entty_cmnt_typ_id = 18 and entty_typ_id =3 and " +
																		  "exists (select 1 from rght_rstrcn rr where EC.ENTTY_KEY = RR.RGHT_RSTRCN_ID and RR.RGHT_STRND_ID =  ? )";
	
	
	private static final String BASE_PRODUCT_RESTRICTIONS_SQL ="select count(distinct c.cmnt_id) from entty_cmnt ec, cmnt c " +
															   "where " +
															   "C.CMNT_ID = EC.CMNT_ID and " +
															   "entty_cmnt_typ_id = 18 and ec.entty_typ_id =4 and " +
															   "exists (select 1 from PROD_RSTRCN r where r.PROD_RSTRCN_ID = EC.ENTTY_KEY and r.FOX_VERSION_ID = ?) ";

	
	private static final String BASE_RESTRICTIONS_FOR_RESTRICTION_SQL = "select count(distinct c.cmnt_id) from entty_cmnt ec, cmnt c " +
																		"where  " +
																		"C.CMNT_ID = EC.CMNT_ID and " +
																		"entty_cmnt_typ_id = 18 and entty_typ_id =3 and " +
																		"EC.ENTTY_KEY =? ";
	
	private final EntityManager em;
	
	public CommentCountProcessor(EntityManager em) {
		this.em = em;
	}
	
	private String addSecurity(String sql, boolean isBusiness, boolean canViewPrivateComments) {
		String businessLegalField = "c.bsns_ind";
		if (!isBusiness) {
			businessLegalField = "c.lgl_ind";
		}

		String clause = null;
		if (canViewPrivateComments) {
			clause = "and ((C.PUB_IND = 1 or c.pub_ind is null) or " + businessLegalField + "=1)";
			return sql + clause;
		}
		clause = "and (C.PUB_IND = 1 or c.pub_ind is null)";
		return sql + clause;
	}
	
	public CommentCount getCommentCount(Long foxVersionId,boolean isBusiness,boolean canViewPrivateComments) {
		CommentCount commentCount = new CommentCount();
		commentCount.setProductRestrictionComments(getProductRestrictionCommentsCount(foxVersionId, isBusiness, canViewPrivateComments));
		commentCount.setStrandComments(getStrandCommentsCount(foxVersionId, isBusiness, canViewPrivateComments));
		commentCount.setStrandRestrictionComments(getStrandRestrictionCommentsCount(foxVersionId, isBusiness, canViewPrivateComments));
		return commentCount;
	}
	
	private Long getCount(String sql,Long foxVersionId) {
		Query query = em.createNativeQuery(sql);
		query.setParameter(1, foxVersionId);
		Long count = ((Number)query.getSingleResult()).longValue();
		return count;
	}
	
	public Long getStrandCommentsCount(Long foxVersionId,boolean isBusiness,boolean canViewPrivateComments) {
		String sql = addSecurity(BASE_STRAND_SQL, isBusiness, canViewPrivateComments);
		return getCount(sql,foxVersionId);
	}
	
	public Long getRestrictionCommentCountForStrand(Long strandId, boolean isBusiness, boolean canViewPrivateComments) {
		String sql = addSecurity(BASE_STRAND_RESTRICTION_FOR_STRAND_SQL, isBusiness, canViewPrivateComments);
		return getCount(sql,strandId);
	}
	
	public Long getStrandCommentCountForStrand(Long strandId,boolean isBusiness,boolean canViewPrivateComments) {
		String sql = addSecurity(BASE_STRAND_FOR_STRAND_SQL, isBusiness, canViewPrivateComments);
		return getCount(sql,strandId);
	}
	
	public Long getStrandRestrictionCommentCountForStrandRestriction(Long strandRestrictionId,boolean isBusiness,boolean canViewPrivateComments) {
		String sql = addSecurity(BASE_RESTRICTIONS_FOR_RESTRICTION_SQL, isBusiness, canViewPrivateComments);
		return getCount(sql,strandRestrictionId);

	}

	public Long getStrandRestrictionCommentsCount(Long foxVersionId,boolean isBusiness,boolean canViewPrivateComments) {
		String sql = addSecurity(BASE_STRAND_RESTRICTION_SQL, isBusiness, canViewPrivateComments);
		return getCount(sql,foxVersionId);
		
	}
	
	public Long getProductRestrictionCommentsCount(Long foxVersionId,boolean isBusiness,boolean canViewPrivateComments) {
		String sql = addSecurity(BASE_PRODUCT_RESTRICTIONS_SQL, isBusiness, canViewPrivateComments);
		return getCount(sql,foxVersionId);
		
	}
	
}
