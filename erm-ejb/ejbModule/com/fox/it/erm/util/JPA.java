package com.fox.it.erm.util;

import javax.persistence.Query;

import org.eclipse.persistence.config.CacheUsage;
import org.eclipse.persistence.config.HintValues;
import org.eclipse.persistence.config.QueryHints;

public class JPA {
	public static final int IN_LIMIT = 1000;
	
	
	public JPA() {

	}
	
	public static void setNoCacheHints(Query query) {
		query.setHint(QueryHints.CACHE_USAGE, CacheUsage.DoNotCheckCache);
		query.setHint(QueryHints.REFRESH, HintValues.TRUE);					
	}


}
