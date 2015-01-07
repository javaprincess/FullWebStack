package com.fox.it.erm;

import java.util.ArrayList;
import java.util.List;

import com.fox.it.erm.service.impl.SearchCriterias;

public class ProductQuery {
	
	public static final String FOX_VERSION_ID_TYPE_NAME ="FOXVERSIONID";
	public static final String WITH_RIGHT_STRANDS = "withRightStrands";
	public static final String WITHOUT_RIGHT_STRANDS = "withoutRightStrands";
	public static final String WITH_LEGAL_RIGHT_STRANDS="withLegalRightStrands";
	public static final String WITHOUT_LEGAL_RIGHT_STRANDS="withoutLegalRightStrands";
//	public static final String CONFIDENTIAL = "confidential";
	
	private String q;
	private String wildcardType = SearchCriterias.CONTAINS;
	private String idType;
	private String strandsQuery;
	private boolean onlyDefaultVersion; //This is used in conjunction with strandsQuery
	private Integer prodYearFrom;
	private Integer prodYearTo;
	private Integer releaseYearFrom;
	private Integer releaseYearTo;
	private Integer maxResults;
	private boolean searchByID;
	private boolean searchByTitle;
	private boolean advancedSearch;
	private boolean includeVersions;
	private boolean includeHasRights;
	private boolean includeAliases;
	private boolean searchAliases;
	private boolean onlyConfidential;
	private boolean isFoxipediaGroupSearch;
	private Long legalConfirmationStatusId;
	private Long businessConfirmationStatusId;
	private Long contractualPartyTypeId; 
	private Long contractualPartyId;
	private List<String> productTypes;
	
	//this attribute is to support searches directly in foxipedia
	private boolean isFoxipediaSearch;


	
	private boolean withMismatchedDates;
	
	public String getQ() {
		return q;
	}

	public ProductQuery setQ(String title) {
		this.q = title;
		return this;
	}
	
	
	public Integer getProdYearFrom() {
		return prodYearFrom;
	}
	public ProductQuery setProdYearFrom(Integer prodYearFrom) {
		this.prodYearFrom = prodYearFrom;
		return this;
	}
	public Integer getProdYearTo() {
		return prodYearTo;
	}

	public Integer getReleaseYearFrom() {
		return releaseYearFrom;
	}

	public ProductQuery setReleaseYearFrom(Integer releaseYearFrom) {
		this.releaseYearFrom = releaseYearFrom;
		return this;
	}

	public Integer getReleaseYearTo() {
		return releaseYearTo;
	}

	public ProductQuery setReleaseYearTo(Integer releaseYearTo) {
		this.releaseYearTo = releaseYearTo;
		return this;
	}

	public boolean isIncludeAliases() {
		return includeAliases;
	}

	public ProductQuery setIncludeAliases(boolean includeAliases) {
		this.includeAliases = includeAliases;
		return this;
	}
	
	public String getStrandsQuery() {
		return strandsQuery;
	}

	public ProductQuery setStrandsQuery(String strandsQuery) {
		this.strandsQuery = strandsQuery;
		return this;
	}

	public String getWildcardType() {
		return wildcardType;
	}

	public ProductQuery setWildcardType(String wildcardType) {
		this.wildcardType = wildcardType;
		return this;
	}

	public boolean isSearchAliases() {
		return searchAliases;
	}

	public ProductQuery setSearchAliases(boolean searchAliases) {
		this.searchAliases = searchAliases;
		return this;
	}

	public ProductQuery setProdYearTo(Integer prodYearTo) {
		this.prodYearTo = prodYearTo;
		return this;
	}
	public List<String> getProductTypes() {
		if (productTypes==null) {
			productTypes = new ArrayList<>();
		}
		return productTypes;
	}
	public ProductQuery setProductTypes(List<String> productionTypes) {
		this.productTypes = productionTypes;
		return this;
	}
	
	

	public boolean isAdvancedSearch() {
		return advancedSearch;
	}

	
	public ProductQuery setAdvancedSearch(boolean advancedSearch) {
		this.advancedSearch = advancedSearch;
		return this;
	}

	public boolean isIncludeVersions() {
		return includeVersions;
	}
	
	


	public boolean isIncludeHasRights() {
		return includeHasRights;
	}

	public ProductQuery setIncludeHasRights(boolean includeHasRights) {
		this.includeHasRights = includeHasRights;
		return this;
	}

	public ProductQuery setIncludeVersions(boolean includeVersions) {
		this.includeVersions = includeVersions;
		return this;
	}

	public Integer getMaxResults() {
		return maxResults;
	}

	public ProductQuery setMaxResults(Integer maxSearchResults) {
		this.maxResults = maxSearchResults;
		return this;
	}

	public boolean isFoxipediaGroupSearch() {
		return isFoxipediaGroupSearch;
	}	
		
	public String getIdType() {
		return idType;
	}

	public void setIdType(String idType) {
		this.idType = idType;
	}

	public boolean isSearchByID() {
		return searchByID;
	}

	public void setSearchByID(boolean searchByID) {
		this.searchByID = searchByID;
	}

	public boolean isSearchByTitle() {
		return searchByTitle;
	}

	public void setSearchByTitle(boolean searchByTitle) {
		this.searchByTitle = searchByTitle;
	}

	public Long getLegalConfirmationStatusId() {
		return legalConfirmationStatusId;
	}

	public ProductQuery setLegalConfirmationStatusId(Long legalConfirmationStatusId) {
		this.legalConfirmationStatusId = legalConfirmationStatusId;
		return this;
	}
	
	public Long getBusinessConfirmationStatusId() {
		return businessConfirmationStatusId;
	}

	public ProductQuery setBusinessConfirmationStatusId(Long businessConfirmationStatusId) {
		this.businessConfirmationStatusId = businessConfirmationStatusId;
		return this;
	}
	
	public ProductQuery setFoxipediaGroupSearch(boolean isFoxipediaGroupSearch) {
		this.isFoxipediaGroupSearch = isFoxipediaGroupSearch;
		return this;
	}

	public Long getContractualPartyTypeId() {
		return contractualPartyTypeId;
	}

	public ProductQuery setContractualPartyTypeId(Long contractualPartyTypeId) {
		this.contractualPartyTypeId = contractualPartyTypeId;
		return this;
	}

	public Long getContractualPartyId() {
		return contractualPartyId;
	}

	public ProductQuery setContractualPartyId(Long contractualPartyId) {
		this.contractualPartyId = contractualPartyId;
		return this;
	}

	public boolean isWithMismatchedDates() {
		return withMismatchedDates;
	}
	
	public ProductQuery setWithMismatchedDates(boolean withMismatchedDates) {
		this.withMismatchedDates = withMismatchedDates;
		return this;
	}

	public boolean isOnlyDefaultVersion() {
		return onlyDefaultVersion;
	}

	
	

	public boolean isFoxipediaSearch() {
		return isFoxipediaSearch;
	}
	
	public boolean isOnlyConfidential() {
		return onlyConfidential;
	}
	
	public ProductQuery setOnlyConfidential(boolean onlyConfidential) {
		this.onlyConfidential = onlyConfidential;
		return this;
	}

	public void setFoxipediaSearch(boolean isFoxipediaSearch) {
		this.isFoxipediaSearch = isFoxipediaSearch;
	}

	public ProductQuery setOnlyDefaultVersion(boolean onlyDefaultVersion) {
		this.onlyDefaultVersion = onlyDefaultVersion;
		return this;
	}

	
	

	
	
}
