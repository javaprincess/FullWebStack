package com.fox.it.erm.service.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;


import com.fox.it.erm.ProductContains;
import com.google.common.base.Joiner;

public class ProductContainsProcessor {
	private final EntityManager em;
	

	private static final String LEGAL_CNF_STATUS_AS_STR = getCMLegalCnfStatus();
	private static final String STRANDS_SQL = "select 'B',1 from dual where exists (select 1 from rght_strnd where fox_version_id = ? and bsns_ind = 1) " +
											  "union all " +
											  "select 'L',1 from dual where exists (select 1 from rght_strnd where fox_version_id = ? and lgl_ind = 1) " +
											  "union all " +
											  "select 'CM',1 from dual where exists (select 1 from entty_cmnt, ERM_PROD_VER where entty_key  = ? and entty_cmnt_typ_id=11 and fox_version_id = ? and LGL_CONF_STS_ID IN ( " + LEGAL_CNF_STATUS_AS_STR+"))";
	 
	
	public ProductContainsProcessor(EntityManager em) {
		this.em = em;
	}
	
	
	private static String getCMLegalCnfStatus() {
		ClearanceMemoInciatorLglConfStatusProvider clearanceMemoInciatorLglConfStatusProvider = new ClearanceMemoInciatorLglConfStatusProvider();		
		return  Joiner.on(",").join(clearanceMemoInciatorLglConfStatusProvider.getLegalIndicatorsWithCM());
	}
 
	
	
	public ProductContains get(Long foxVersionId) {
		Query query = em.createNativeQuery(STRANDS_SQL);
		query.setParameter(1, foxVersionId);
		query.setParameter(2, foxVersionId);
		query.setParameter(3, foxVersionId);
		query.setParameter(4, foxVersionId);
		query.setParameter(5, foxVersionId);
		query.setParameter(6, foxVersionId);
		@SuppressWarnings("unchecked")
		List<Object[]> results = query.getResultList();
		ProductContains productContains = new ProductContains();
		for (Object[] r: results) {
			if ("B".equals(r[0])) {
				productContains.setBusinessStrands(true);
			}
			if ("L".equals(r[0])) {
				productContains.setLegalStrands(true);
			} else if ("CM".equals(r[0])) {
				productContains.setClearanceMemo(true);
			}			
		}
		return productContains;
	}

}
