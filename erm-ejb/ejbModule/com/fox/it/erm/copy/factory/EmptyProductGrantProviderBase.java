package com.fox.it.erm.copy.factory;

import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.fox.it.erm.util.IdsUtil;

public class EmptyProductGrantProviderBase extends EmptyProductProviderBase { //implements EmptyProductProvider{
	private static final String sqlBase = "select distinct fox_version_id " + 
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

	private Long entityCommentCategoryId;
	
	
	public EmptyProductGrantProviderBase() {
		
	}
	
	public EmptyProductGrantProviderBase(EntityManager em,Long entityCommentCategoryId) {
		super(em);
		this.entityCommentCategoryId = entityCommentCategoryId;
	}
	
	protected List<Long> getFoxVersionIdsByCommentCategory(List<Long> foxVersionIds,
			Long entityCommentCategoryId, 
			boolean isBusiness){
		
		
		String sql = sqlBase + IdsUtil.getIdsAsListInParenthesis(foxVersionIds);
		sql+=" and T.ENTTY_CMNT_CAT_ID = " + entityCommentCategoryId;
		sql = addBusinessPredicate(sql,isBusiness,"c");
		
		Query query = getEntityManager().createNativeQuery(sql);
		@SuppressWarnings("unchecked")
		List<Object> results = (List<Object>) query.getResultList();
		return getFoxVersionIdsFromColumns(results);
	}

	@Override
	public Map<Long, Boolean> getEmpty(List<Long> foxVersionIds,
			boolean isBusiness) {
		List<Long> ids = getFoxVersionIdsByCommentCategory(foxVersionIds, entityCommentCategoryId, isBusiness);
		return toMap(foxVersionIds,ids);		
	}

//	@Override
//	public EntityManager getEntityManager() {
//		return this.eM;
//	}
//
//	@Override
//	public void setEntityManager(EntityManager eM) {
//		this.eM = eM;
//	}


 

}
