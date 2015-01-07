package com.fox.it.erm.copy.factory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;


import com.fox.it.erm.copy.factory.products.EmptyProductProvider;
import com.fox.it.erm.util.IdsUtil;

public abstract class EmptyProductProviderBase extends EmptyProductProvider {

	@Inject
	protected EntityManager em;
	
	public EmptyProductProviderBase() {
	}
	
	@Inject
	public EmptyProductProviderBase(EntityManager em) {
		this.em = em;
	}
	

	protected Map<Long,Boolean> toMap(List<Long> ids, List<Long> subset) {
		Map<Long,Boolean> map = new HashMap<Long, Boolean>(ids.size());
		Set<Long> subsetSet = new HashSet<>();
		subsetSet.addAll(subset);
		for (Long id:ids) {
			boolean contains = subsetSet.contains(id);
			map.put(id, !contains);
		}
		return map;
	}

	protected List<Long> getFoxVersionIds(List<Long> foxVersionIds, boolean isBusiness, String sqlBase) {
		String sql = sqlBase + IdsUtil.getIdsAsListInParenthesis(foxVersionIds);
		sql = addBusinessPredicate(sql,isBusiness);
		Query query = getEntityManager().createNativeQuery(sql);
		@SuppressWarnings("unchecked")
		List<Object> results = (List<Object>) query.getResultList();
		return getFoxVersionIdsFromColumns(results);
	}

	protected String addBusinessPredicate(String sql, boolean isBusiness,String prefix) {
		String predicate = " and " + getIsBusinessPredicate(isBusiness,prefix);
		return sql + predicate;
	}
	
	protected String addBusinessPredicate(String sql, boolean isBusiness) {
		return addBusinessPredicate(sql,isBusiness,null);
	}
	
	private List<Long> getIds(List<Object> columns) {
		List<Long> ids = new ArrayList<>(columns==null?0:columns.size());
		if (columns!=null) {
			for (Object o: columns) {
//				Object o = row[position];
				if (o instanceof Number) {
					Long id = ((Number) o).longValue();
					ids.add(id);
					
				}
			}
		}
		return ids;
	}
	
	
	protected List<Long> getFoxVersionIdsFromColumns(List<Object> columns) {		
		return getIds(columns);
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
	
	protected String getIsBusinessPredicate(boolean isBusiness) {
		return getIsBusinessPredicate(isBusiness, null);
	}
	
//	private void setNoCacheHints(Query query) {
//		query.setHint(QueryHints.CACHE_USAGE, CacheUsage.DoNotCheckCache);
//		query.setHint(QueryHints.REFRESH, HintValues.TRUE);					
//	}	

	public EntityManager getEntityManager() {
		return em;
	}
	
	public abstract Map<Long, Boolean> getEmpty(List<Long> foxVersionIds,boolean isBusiness);

}
