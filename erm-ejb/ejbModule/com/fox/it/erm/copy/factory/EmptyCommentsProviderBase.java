package com.fox.it.erm.copy.factory;


import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.fox.it.erm.enums.EntityCommentType;
import com.fox.it.erm.util.IdsUtil;

public abstract class EmptyCommentsProviderBase extends EmptyProductProviderBase {//implements EmptyProductProvider{

	private static final String sqlBase = "Select ec.entty_key from entty_cmnt ec, cmnt c where ec.cmnt_id = c.cmnt_id and ec.ENTTY_CMNT_TYP_ID <> " +EntityCommentType.CLEARANCE_MEMO.getId() + " and entty_key in ";	
	private static final String cmSqlBase = "Select ec.entty_key from entty_cmnt ec, cmnt c where ec.cmnt_id = c.cmnt_id and ec.ENTTY_CMNT_TYP_ID = " +EntityCommentType.CLEARANCE_MEMO.getId() + " and entty_key in ";
	
	public EmptyCommentsProviderBase() {
	}
	
	public EmptyCommentsProviderBase(EntityManager em) {
		super(em);
	}
	
	protected List<Long> getFoxVersionIds(List<Long> foxVersionIds, boolean isBusiness){
		String sql = sqlBase + IdsUtil.getIdsAsListInParenthesis(foxVersionIds);
		sql = addBusinessPredicate(sql,isBusiness,"c");
		Query query = getEntityManager().createNativeQuery(sql);
		@SuppressWarnings("unchecked")
		List<Object> results = (List<Object>) query.getResultList();
		return getFoxVersionIdsFromColumns(results);
	}
	
	protected List<Long> getFoxVersionIdsForCM(List<Long> foxVersionIds) {
		String sql = cmSqlBase + IdsUtil.getIdsAsListInParenthesis(foxVersionIds);
		Query query = getEntityManager().createNativeQuery(sql);
		@SuppressWarnings("unchecked")
		List<Object> results = (List<Object>) query.getResultList();
		return getFoxVersionIdsFromColumns(results);
		
	}
	
		


}
