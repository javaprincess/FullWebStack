package com.fox.it.erm.copy;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.util.IdsUtil;

public class XProductCopyGrantFinder {

	private String sqlBase = "select distinct fox_version_id " + 
						 "from  " +
						 "entty_cmnt ec, " + 
						 "prod_grnt g, " +
						 "cmnt c, " +
						 "ref_entty_cmnt_typ t " + 
						 "where " +
						 "entty_typ_id = 5 and " + 
						 "ec.entty_key = G.PROD_GRNT_ID and " + 
						 "c.cmnt_id = ec.cmnt_id and " +
						 "G.FOX_VERSION_ID in";
	
	private final EntityManager em;
	
	public XProductCopyGrantFinder(EntityManager em) {
		this.em=em;
	}
	
	protected String getIsBusinessPredicate(boolean isBusiness,String prefix) {
		String businessColumn="bsns_ind";
		String legalColumn="lgl_ind";
		if (prefix!=null) {
			businessColumn = prefix + "." + businessColumn;
			legalColumn = prefix + "." + legalColumn;
		}
		String column = legalColumn;
		if (isBusiness) {
			column=businessColumn;
		}
		return column +"=1";
	}
	
	
	protected String addBusinessPredicate(String sql, boolean isBusiness,String prefix) {
		String predicate = " and " + getIsBusinessPredicate(isBusiness,prefix);
		return sql + predicate;
	}

	
	public String getSql(List<Long> foxVersionIds,Long entityCommentCategoryId,boolean isBusiness) {
		String sql = sqlBase + IdsUtil.getIdsAsListInParenthesis(foxVersionIds);
		sql+=" and T.ENTTY_CMNT_CAT_ID = " + entityCommentCategoryId;
		sql = addBusinessPredicate(sql,isBusiness,"c");
		return sql;
	}
	
	@SuppressWarnings("unchecked")
	protected List<EntityComment> find(Long foxVersionId,Long entityCommentCategoryId) {
		List<Long> foxVersionIds = new ArrayList<>();
		foxVersionIds.add(foxVersionId);
		String sql = getSql(foxVersionIds, entityCommentCategoryId, false); 
		Query query = em.createNativeQuery(sql, EntityComment.class);
		return query.getResultList();
	}

}
