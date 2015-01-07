package com.fox.it.erm.service.impl;




import java.util.Map;

import com.fox.it.erm.ProductQuery;
import com.fox.it.erm.service.impl.ProductSearchCriterias.ProductSearchCriteria;
import com.fox.it.erm.service.impl.ProductSearchCriterias.ProductVersionSearchCriteria;

public class ProductQueryToSearchCriteriaConverter{

	public ProductVersionSearchCriteria convertVersionCriteria(Long foxId, boolean includeDefaultVersion, String strandsQuery, ProductVersionSearchCriteria searchCriteria) {
		String sql = "SELECT egtv.FOX_VERSION_ID, egtv.ACT_RUN_TM, egtv.FIN_PROD_ID, egtv.FOX_ID, egtv.PROG_RUN_TM, egtv.TITLE_DESC, egtv.TITLE_VER_DESC, egtv.TITLE_VER_TYP_CD, egtv.TITLE_VER_TYP_DESC FROM ERM.EDM_GLOBAL_TITLE_VERSION_VW egtv, ERM_PROD_VER epv WHERE egtv.FOX_VERSION_ID = epv.FOX_VERSION_ID(+) ";
		ProductQueryToNativeSQLConverter sqlConverter = new ProductQueryToNativeSQLConverter(sql, new ProductQuery());
		String updatedSql = sqlConverter.getVersionSQL(foxId, includeDefaultVersion, strandsQuery, searchCriteria);		
		Map<String,Object> params = sqlConverter.getParameters();
		searchCriteria.setNativeSQL(updatedSql, params);		
		return searchCriteria;
	}
	
	public ProductHeaderSearchCriteria convert(ProductQuery query,ProductHeaderSearchCriteria criteria) {
		ProductQueryToNativeSQLConverter sqlConverter = new ProductQueryToNativeSQLConverter(query);
		String sql = sqlConverter.getSQL();
		Map<String,Object> params = sqlConverter.getParameters();
		criteria.setNativeSQL(sql, params);
		if (query.getMaxResults()!=null) {
			criteria.setMaxResults(query.getMaxResults());
		}
		if (query.getStrandsQuery() !=null) {
			criteria.setStrandsQuery(query.getStrandsQuery());
		}
		return criteria;
		
	}

	
	@Deprecated
	public ProductSearchCriteria convert(ProductQuery query,ProductSearchCriteria criteria) {
		ProductQueryToNativeSQLConverter sqlConverter = new ProductQueryToNativeSQLConverter(query);
		String sql = sqlConverter.getSQL();
		Map<String,Object> params = sqlConverter.getParameters();
		criteria.setNativeSQL(sql, params);
		if (query.getMaxResults()!=null) {
			criteria.setMaxResults(query.getMaxResults());
		}
		if (query.getStrandsQuery() !=null) {
			criteria.setStrandsQuery(query.getStrandsQuery());
		}
		return criteria;
		
	}
}
