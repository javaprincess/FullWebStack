package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

@MappedSuperclass
public abstract class ProductVersionBase implements Comparable<ProductVersion> {
	@Id
	@Column(name="FOX_VERSION_ID")
	private Long foxVersionId;
	
	
	@Column(name="FOX_ID")
	private Long foxId;
	
	@Column(name="FIN_PROD_ID")
	private String financialProductId;
	
	@Column(name="TITLE_DESC")
	private String title;
	
	@Column(name="TITLE_VER_DESC")
	private String versionTitle;
	
	@Column(name="TITLE_VER_TYP_CD")
	private String versionTypeCode;
	
	@Column(name="TITLE_VER_TYP_DESC")
	private String versionTypeDescription;
	
	@Column(name="ACT_RUN_TM")
	private Integer actRunTime;
	
	@Column(name="PROG_RUN_TM")
	private Integer progRunTime;

	
	@Transient
	private Boolean isDefaultVersion = false;
	
	@Transient
	private String rightsIndicator;
	
	@Transient
	private Boolean hasLegalApprovedAllRights;
	
	@Transient
	private String productTypeCode;
	
	//Used by the front end
	@Transient
	private Boolean showFactor = false;
	
	@Transient	
	private Long doNotLicenseID;
	
	@Transient	
	private String scriptedFlag;
	
	@Transient
	private Integer futureMediaInd; 
	
		
	@Transient	
	private ClearanceMemo clearanceMemo;
	
	@Transient
	private String jdeId;
	
	
	
	
	
	public ProductVersionBase() {
	}
	
	
	public Long getFoxVersionId() {
		return foxVersionId;
	}

	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}

	public String getVersionTitle() {
		return versionTitle;
	}

	public void setVersionTitle(String versionTitle) {		
		this.versionTitle = versionTitle;
	}

	public String getVersionTypeCode() {
		return versionTypeCode;
	}

	public void setVersionTypeCode(String versionTypeCode) {
		this.versionTypeCode = versionTypeCode;
	}

	public String getVersionTypeDescription() {
		return versionTypeDescription;
	}

	public void setVersionTypeDescription(String versionTypeDescription) {
		this.versionTypeDescription = versionTypeDescription;
	}

	public Long getFoxId() {
		return foxId;
	}

	public void setFoxId(Long foxId) {
		this.foxId = foxId;
	}

	public Boolean getIsDefaultVersion() {
		return isDefaultVersion;
	}

	
	
	public String getFinancialProductId() {
		return financialProductId;
	}

	public void setFinancialProductId(String financialProductId) {
		this.financialProductId = financialProductId;
	}

	public void setIsDefaultVersion(Boolean isDefaultVersion) {
		this.isDefaultVersion = isDefaultVersion;
	}

	public String getRightsIndicator() {
		return rightsIndicator;
	}

	
	
	public String getRightsIconType() {
		return getRightsIndicator();
	}

	public void setRightsIndicator(String rightStrandsIndicator) {
		this.rightsIndicator = rightStrandsIndicator;
	}

	public Boolean getHasLegalApprovedAllRights() {
		return hasLegalApprovedAllRights;
	}

	public void setHasLegalApprovedAllRights(Boolean hasLegalApprovedAllRights) {
		this.hasLegalApprovedAllRights = hasLegalApprovedAllRights;
	}

	public Integer getActRunTime() {
		return actRunTime;
	}

	public void setActRunTime(Integer actRunTime) {
		this.actRunTime = actRunTime;
	}

	public Integer getProgRunTime() {
		return progRunTime;
	}

	public void setProgRunTime(Integer progRunTime) {
		this.progRunTime = progRunTime;
	}

	public Boolean getShowFactor() {
		return showFactor;
	}

	public void setShowFactor(Boolean showFactor) {
		this.showFactor = showFactor;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getProductTypeCode() {
		return productTypeCode;
	}

	public void setProductTypeCode(String productTypeCode) {
		this.productTypeCode = productTypeCode;
	}

	@Override
	public int compareTo(ProductVersion o) {
	  return this.getVersionTitle().compareTo(o.getVersionTitle());
	}
	
	public ClearanceMemo getClearanceMemo() {
		return clearanceMemo;
	}

	public void setClearanceMemo(ClearanceMemo clearanceMemo) {
		this.clearanceMemo = clearanceMemo;	
	}
	
	public Long getDoNotLicenseID() {
		return doNotLicenseID;
	}

	public void setDoNotLicenseID(Long doNotLicenseID) {
		this.doNotLicenseID = doNotLicenseID;
	}

	public boolean isScriptedFlag() {
		return scriptedFlag != null && scriptedFlag.equalsIgnoreCase("Y");
	}
	
	public void setScriptedFlag(boolean scriptedFlag) {
		this.scriptedFlag = scriptedFlag ? "Y" : "N";
	}
	
	
	
	
	
	public Integer getFutureMediaInd() {
		return futureMediaInd;
	}


	public void setFutureMediaInd(Integer futureMedia) {
		this.futureMediaInd = futureMedia;
	}
	

	public String getJdeId() {
		return jdeId;
	}


	public void setJdeId(String jdeId) {
		this.jdeId = jdeId;
	}


	public abstract Product getProduct();
	public abstract void setProduct(Product product);
	

}
