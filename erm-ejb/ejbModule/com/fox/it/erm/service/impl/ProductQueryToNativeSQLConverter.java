package com.fox.it.erm.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fox.it.erm.ProductQuery;
import com.fox.it.erm.PublicStatusCodes;
import com.fox.it.erm.service.impl.ProductSearchCriterias.ProductVersionSearchCriteria;

public class ProductQueryToNativeSQLConverter {
//	private static final Logger logger = Logger.getLogger(ProductQueryToNativeSQLConverter.class.getName());
	private final ProductQuery query;

	private String sql = "Select distinct p.* From edm_global_title_vw p ";
//	private static final String productVersion = ", edm_global_title_version_vw pv, erm_prod_ver epv, cntrct_info cntr where p.fox_id = pv.fox_id (+) and pv.fox_version_id = epv.fox_version_id (+) and pv.fox_version_id = cntr.fox_version_id (+)  ";
	private static final String contractualPartyTable = ", edm_global_title_version_vw pv, erm_prod_ver epv, cntrct_info cntr where p.fox_id = pv.fox_id (+) and pv.fox_version_id = epv.fox_version_id (+) and pv.fox_version_id = cntr.fox_version_id (+)"; 
//	private static final String contractualParty = " and pv.fox_version_id = cntr.fox_version_id (+) "; 
	private static final String productVersion = ", edm_global_title_version_vw pv, erm_prod_ver epv where p.fox_id = pv.fox_id (+) and pv.fox_version_id = epv.fox_version_id (+)  ";	
	private static final String datesOutOfSyncSql = "(SELECT fox_version_id " +
									   "FROM rght_strnd sync_rs, edm_global_title_vw sync_p " +
									   "WHERE sync_rs.fox_version_id = sync_p.default_version_id and sync_rs.bsns_ind=1 and (sync_rs.EXCLD_FLG is null or sync_rs.EXCLD_FLG=0)" +
									   "GROUP BY fox_version_id " +
									   "HAVING MIN (nvl(frst_rel_dt, to_date('1/1/1900', 'mm/dd/yyyy'))) <> MIN (nvl(rlse_dt,to_date('1/1/1900', 'mm/dd/yyyy'))) " +
									   "UNION ALL " +
									   "SELECT fox_version_id " +
									   "FROM rght_strnd sync_rs, " +
									   "edm_global_title_vw sync_p " +
									   "WHERE sync_rs.fox_version_id = " +
									   "sync_p.default_version_id and sync_rs.bsns_ind=1 and (sync_rs.EXCLD_FLG is null or sync_rs.EXCLD_FLG=0)" +
									   "GROUP BY fox_version_id " +
									   "HAVING MIN (nvl(frst_rel_dt, to_date('1/1/1900', 'mm/dd/yyyy'))) <> MAX (nvl(rlse_dt,to_date('1/1/1900', 'mm/dd/yyyy')))" +
									   ")";
	private boolean productVersionIncuded = false;	
	private boolean contractualPartyIncluded = false;
	
	
	private boolean firstCondition = true;
	private final Map<String,Object> parameters = new HashMap<String, Object>();
	
	public ProductQueryToNativeSQLConverter(String sql, ProductQuery productQuery) {
		this.firstCondition = false;
		this.sql = sql;
		this.query = productQuery;
	}

	public ProductQueryToNativeSQLConverter(ProductQuery productQuery) {
		this.query = productQuery;
	}

	private void addCriteria(String criteria) {
		if (firstCondition) {
			sql+= "where ";
			firstCondition = false;
		} else {
			sql+= "and ";
		}
		sql+=criteria;		
	}
	
	private String getCriteria(String field, String operand, String parameterName) {
		return field + " " + operand + " " + parameterName + " ";
	}
	
	private String neq(String field, String parameterName) {
		return getCriteria(field, "<>", parameterName);
	}

	private String eq(String field, String parameterName) {
		return getCriteria(field, "=", parameterName);
	}
	
	private String gt(String field, String parameterName) {
		return getCriteria(field, ">=", parameterName);
	};
	
	private String lt(String field, String parameterName) {
		return getCriteria(field, "<=", parameterName);
	};


	private void addParameterValue(String name, Object value) {
		parameters.put(name,value);
	}
	
	private void setProductionYearFrom(Integer productionYearFrom) {
		String fieldName="p.prodn_year";
		String parameterName = "fromProdYear";
		addParameterValue(parameterName, productionYearFrom);
		String predicate = gt(fieldName,"?"+parameterName);
		addCriteria(predicate);
	}
	
	private void setProductionYearTo(Integer productionYearTo) {
		String fieldName="p.prodn_year";
		String parameterName="toProdYear";		
		addParameterValue(parameterName, productionYearTo);		
		String predicate = lt(fieldName,"?"+parameterName);
		addCriteria(predicate);
		
	}
	
	private void setReleaseDateFrom(Date releaseFrom) {
		String fieldName="p.frst_rel_dt";
		String parameterName="fromRelease";
		addParameterValue(parameterName, releaseFrom);		
		String predicate = gt(fieldName,"?" +parameterName);
		addCriteria(predicate);
		
	}
	
	private void setContractualParty(Long partyId) {
		String fieldName = "cntr.cntrct_pty_id";
		String parameterName="contractualPartyId";
		addParameterValue(parameterName, partyId);
		String predicate = eq(fieldName, "?" +parameterName);
		addCriteria(predicate);
	}
	
	private void setContractualPartyTypeId(Long partyTypeId) {
		String fieldName = "cntr.cntrct_pty_typ_id";
		String parameterName="contractualPartyTypeId";
		addParameterValue(parameterName, partyTypeId);
		String predicate = eq(fieldName, "?" +parameterName);
		addCriteria(predicate);
	}	
	
	private void setReleaseDateTo(Date releaseTo) {
		String fieldName="p.frst_rel_dt";		
		String parameterName="toRelease";		
		addParameterValue(parameterName, releaseTo);		
		String predicate = lt(fieldName,"?" + parameterName);
		addCriteria(predicate);
		
	}
	
	private String toInList(List<String> list) {
		StringBuilder builder = new StringBuilder();
		boolean first = true;
		for (String s: list) {
			if (!first) {
				builder.append(", ");
			}
			builder.append("'" + s + "'");
			first = false;
		}
		
		return builder.toString();
	}
	
	private void setProductTypes(List<String> productTypes) {
		String fieldName = "p.prod_typ_cd";
		String inSubQuery = toInList(productTypes);
		String predicate = getIn(fieldName,inSubQuery);
		addCriteria(predicate);
		
	}
	
	private void setPublicStatusCode(String statusCode) {
		String fieldName = "p.pub_stat_cd";
		String predicate = fieldName + "='" + statusCode + "' ";
		addCriteria(predicate);
	}
	
	private void setConfidential() {
		setPublicStatusCode(PublicStatusCodes.CONFIDENTIAL);
	}
	
	private String getIn(String field, String subquery) {
		return field + " in " + "(" + subquery+") ";
	}
	
	private String getInStringify(String field, String subquery,boolean isNumeric) {
		String[] splitString = subquery.split(",");
		String subQueryStringified = "";
		for (int i = 0; i < splitString.length; i++) {
		  if (i > 0)
			  subQueryStringified+= ", ";
		  if (isNumeric) {
			  subQueryStringified+=  splitString[i].replaceAll("^\\s+", "").replaceAll("\\s+$", "");
			  
		  } else {
			  subQueryStringified+= "'" + splitString[i].replaceAll("^\\s+", "").replaceAll("\\s+$", "") + "'";
			  
		  }
		}
		return field + " in " + "(" + subQueryStringified+") ";
	}
	
	private boolean canBeFinancialCode(String q) {
		if (q==null||q.length()==0) return false;
		String[] tokens = q.split(" ");
		return tokens!=null && tokens.length==1;
	}
	
	
	private String getTitleAliasOrFinancialProudctIdSubQuery(String title, boolean searchAlias, String sqlSearchOp, boolean isAdvancedSearch) {
		String alias ="select apv.fox_id from edm_global_title_alias_vw a, edm_global_title_version_vw apv where a.fox_version_id=apv.fox_version_id and ";					  
		String productOrFinancialId = "select fox_id from edm_global_title_vw ";						
		String sql = "";		
		String[] splitString = title.split(";");		
		if (searchAlias) {
			sql += alias;
			for (int i = 0; i < splitString.length; i++) {
			  if (i > 0)
				sql += "or ";
			  sql += "(upper(a.title_disp) " + sqlSearchOp + " ?title" + i + ") ";
			}
			sql += "union all ";
		}
		sql += productOrFinancialId;
		if (title != null && title.length() > 0) {
			sql += "where  ";					
			for (int i = 0; i < splitString.length; i++) {
			  if (i > 0)
				  sql += "or "; 
			  if (!isAdvancedSearch && canBeFinancialCode(splitString[i]))
			    sql += "(upper(edm_title) " + sqlSearchOp + " ?title" + i + " or fin_prod_Id " + sqlSearchOp + " ?title" + i +") ";
			  else 
				sql += "(upper(edm_title) " + sqlSearchOp + " ?title" + i + ") ";			  
			}		
			String parameterName = "title";			
			for (int i = 0; i < splitString.length; i++)
			  addParameterValue(parameterName+i, splitString[i]);		
			//logger.log(Level.SEVERE, "getSQL: q - " + sql);
		}
		return sql;
	}
	
	
	private String getWPRIdSubQuery(String searchIDs) {
		String sql = "select apv.fox_id from  edm_global_title_version_vw apv where ";
//		String sql ="select apv.fox_id from edm_global_title_alias_vw a, edm_global_title_version_vw apv where a.fox_version_id=apv.fox_version_id and ";
		String fieldName = "apv.fin_prod_Id";
		String predicate = getInStringify(fieldName,searchIDs,false);
		sql+= predicate;		
		return sql;
	}
	
	private String getFoxVersionIdSubQuery(String searchIDs) { 
		String sql ="select apv.fox_id from edm_global_title_version_vw apv where ";
		String fieldName = "apv.fox_version_id";
		String predicate = getInStringify(fieldName,searchIDs,true);
		sql+= predicate;	
		return sql;
	}
	
	private String getVaultIDSubQuery(String searchIDs) { 
		String sql ="select gta.fox_id from edm_global_title_alt_id_vw gta where upper(gta.title_alt_id_typ_cd) = 'VAULT_VER' and ";
		String fieldName = "gta.title_alt_id_cd";
		String predicate = getInStringify(fieldName,searchIDs,false);
		sql+= predicate;	
		return sql;
	}
	
	private String getOrderBy(String fieldName) {
		return "order by " + fieldName;
	}
	
	private void addOrderBy(String fieldName) {
		String orderBy = getOrderBy(fieldName);
		sql += orderBy;
	}

	private void addOrderByTitle() {
		addOrderBy("p.edm_title");
	}
	
	private void includeProductVersionTable() {
		if (!productVersionIncuded) {
			sql += productVersion;
		}
		firstCondition=false;
		productVersionIncuded=true;
	}
	
	private void includeContractualParty() {
		if (!contractualPartyIncluded) {
			sql+=contractualPartyTable;
		}
		firstCondition = false;
		contractualPartyIncluded = true;
		productVersionIncuded=true;
		
	}
	
	

	
	private void setStrandsQuery(String strandsQuery,boolean onlyDefault) {
	  setStrandsQuery(strandsQuery, true,onlyDefault);
	}
	private void setStrandsQuery(String strandsQuery, boolean includeProductVersionTable,boolean onlyDefault) {
		if (includeProductVersionTable)
			includeProductVersionTable();
		String fieldName = "";
		String parameterName = "";
		String predicate = "";
		if (strandsQuery.equalsIgnoreCase(ProductQuery.WITHOUT_LEGAL_RIGHT_STRANDS)) {		  
		  fieldName = "Right_Bitmaps.Is_Blank_Bitmap(epv.HDR_LGL_CVRG_BITMAP)";	
		  parameterName = "functionResult";
		  addParameterValue(parameterName, 'Y');
		  predicate = eq(fieldName,"?" + parameterName);
		  addCriteria(predicate);	
		}
		
		  if (strandsQuery.equalsIgnoreCase(ProductQuery.WITH_RIGHT_STRANDS)) {
			fieldName = "Right_Bitmaps.Is_Blank_Bitmap(epv.HDR_BSNS_CVRG_BITMAP)";	
			parameterName = "functionResult";
			addParameterValue(parameterName, 'N');	
		  }
		  if (strandsQuery.equalsIgnoreCase(ProductQuery.WITHOUT_RIGHT_STRANDS)) {
			fieldName = "Right_Bitmaps.Is_Blank_Bitmap(epv.HDR_BSNS_CVRG_BITMAP)";	
			parameterName = "functionResult";
			addParameterValue(parameterName, 'Y');	
		  }
		  if (strandsQuery.equalsIgnoreCase(ProductQuery.WITH_LEGAL_RIGHT_STRANDS)) {
			fieldName = "Right_Bitmaps.Is_Blank_Bitmap(epv.HDR_LGL_CVRG_BITMAP)";	
			parameterName = "functionResult";
			addParameterValue(parameterName, 'N');	
		  }
		  
		  if (onlyDefault) {
			  String criteria = "P.DEFAULT_VERSION_ID = PV.FOX_VERSION_ID ";
			  addCriteria(criteria);
		  }

		  predicate = eq(fieldName,"?" + parameterName);
		  addCriteria(predicate);		

	}
	
	private void setLegalConfirmationStatus(Long legalStatusId) {
		includeProductVersionTable();
		String fieldName="epv.lgl_conf_sts_id";		
		String parameterName="legalConfStatus";		
		addParameterValue(parameterName, legalStatusId);		
		String predicate = eq(fieldName,"?" + parameterName);
		addCriteria(predicate);		
	}
	
	private void setBusinessConfirmationStatus(Long businessConfirmationStatusId) {
		includeProductVersionTable();
		String fieldName="epv.bsns_conf_sts_id";		
		String parameterName="businessConfirmationStatus";		
		addParameterValue(parameterName, businessConfirmationStatusId);		
		String predicate = eq(fieldName,"?" + parameterName);
		addCriteria(predicate);		
	}
	public String getVersionSQL(Long foxId, boolean includeDefaultVersion, String strandsQuery, ProductVersionSearchCriteria searchCriteria) {
	  String fieldName="egtv.FOX_ID";		
	  String parameterName="FOXID";		
	  addParameterValue(parameterName, foxId);		
	  String predicate = eq(fieldName,"?" + parameterName);
	  addCriteria(predicate);			
	  if (!includeDefaultVersion) {        
        fieldName="egtv.TITLE_VER_TYP_CD";		
	  	parameterName="VERTYPCD";		
	  	addParameterValue(parameterName, "DFLT");		
	  	predicate = neq(fieldName,"?" + parameterName);
	  	addCriteria(predicate);	
	  }
	  if (strandsQuery != null) {
		setStrandsQuery(strandsQuery, false);
	  }
	  return sql;		
	}
	public String getSQL() {
		boolean searchAliases = query.isSearchAliases();
		//DO NO MOVE, this needs to be the first statement, otherwise the SQL won't be correct
		if (query.getContractualPartyId()!=null) {
			  includeContractualParty();
			  setContractualParty(query.getContractualPartyId());
			}	
			
		if (query.getContractualPartyTypeId()!=null) {
		  includeContractualParty();			
		  setContractualPartyTypeId(query.getContractualPartyTypeId());
		}
		
			
		if (query.getStrandsQuery() != null) {
			boolean onlyDefaultVersion = query.isOnlyDefaultVersion();
			setStrandsQuery(query.getStrandsQuery(),onlyDefaultVersion);			
		}
		if (query.getBusinessConfirmationStatusId()!=null) {
			setBusinessConfirmationStatus(query.getBusinessConfirmationStatusId());
		}
		if (query.getLegalConfirmationStatusId()!=null) {
			setLegalConfirmationStatus(query.getLegalConfirmationStatusId());
		}		
		if (query.getProdYearFrom()!=null) {
			setProductionYearFrom(query.getProdYearFrom());
		}
		if (query.getProdYearTo()!=null) {
			setProductionYearTo(query.getProdYearTo());
		}
		
		if (query.getReleaseYearFrom()!=null) {
			setReleaseDateFrom(SearchCriterias.getFirstDayOfYear(query.getReleaseYearFrom()));
		}
		
		if (query.getReleaseYearTo()!=null) {
			setReleaseDateTo(SearchCriterias.getFirstDayOfYear(query.getReleaseYearTo()));
		}
		
		if (query.getProductTypes().size()>0) {
			setProductTypes(query.getProductTypes());
		}
		
 
		
		String q = query.getQ();
		String wildcardType = query.getWildcardType();
		q=SearchCriterias.toWildcardType(q, wildcardType);		
		if (q!=null&&!q.trim().isEmpty()) {
			//logger.log(Level.SEVERE, "getSQL: q - " + q);
			q = q.toUpperCase();
			String subquery = getSubQuery(query, q, searchAliases, getSqlSearchOp(wildcardType));
			String in = getIn("p.fox_Id", subquery);
			addCriteria(in);
		}
		
		//DO NOT move this to other position. it needs to be the last one
		if (query.isOnlyConfidential()) {
			setConfidential();				
		}
		
		
		if (query.isWithMismatchedDates()) {
			String subquery = datesOutOfSyncSql;
			String in = getIn("p.default_version_id", subquery);
			addCriteria(in);
		}
		
		addOrderByTitle();
		return sql;		
	}
	
	public String getSubQuery(ProductQuery query, String q, boolean searchAliases, String getSqlSearchOp) {
	  if (query.isSearchByTitle())
	    return getTitleAliasOrFinancialProudctIdSubQuery(q,searchAliases, getSqlSearchOp, query.isAdvancedSearch());
	  else {
		if ("WPR".equalsIgnoreCase(query.getIdType()))
		  return getWPRIdSubQuery(q);
		if ("FOXID".equalsIgnoreCase(query.getIdType()))
		  return q;
		if ("FOXVERSIONID".equalsIgnoreCase(query.getIdType()))
		  return getFoxVersionIdSubQuery(q);
		if ("JDEVERSIONID".equalsIgnoreCase(query.getIdType()))
		  return getVaultIDSubQuery(q);
		else 
		  return getTitleAliasOrFinancialProudctIdSubQuery(q,searchAliases, getSqlSearchOp, query.isAdvancedSearch());
	  }
	}
	
	public String getSqlSearchOp(String wildcardType) {
	  if (wildcardType.equalsIgnoreCase(SearchCriterias.EQUALS))
		return "=";
	  else
		return "like";
	}
	
	public Map<String,Object> getParameters() {
		return parameters; 
	}
 

}
