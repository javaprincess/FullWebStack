package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

@MappedSuperclass
public abstract class ProductBase {
	
	@Id
	@Column(name="FOX_ID")
	private Long foxId;
	
	
	@Column(name="DEFAULT_VERSION_ID")
	private Long defaultVersionId;
	
	@Column(name="FIN_PROD_ID")
	private String financialProductId;
	
	@Column(name="PRODN_YEAR")
	private Integer productionYear;
	
	@Temporal(value=TemporalType.TIMESTAMP)	
	@Column(name="FRST_REL_DT")
	private Date releaseDate;
	
	@Column(name="PROD_TYP_CD")
	private String productTypeCode;
	
	@Column(name="PROD_TYP_DESC")
	private String productTypeDesc;
	
	@Column(name="EDM_TITLE")
	private String title;
	
	@Column(name="FIN_DIV_CD")
	private String financialDivisionCode;
	
	@Column(name="FIN_DIV_DESC")
	private String financialDivisionDesc;
	
	@Column(name="LIFE_CYCL_STAT_CD", length=15)
	private String lifecycleStatusCode;
	
	@Column(name="LIFE_CYCL_STAT_DESC", length=100)
	private String lifecycleStatusDescription;
	
	@Column(name="ORIG_MEDIA_CD")
	private String originalMediaCode;
	
	@Column(name="ORIG_MEDIA_DESC")
	private String originalMediaDesc;
	
	@Column(name="PUB_STAT_CD")
	private String statusCode;
	
	
	
	@Transient
	private String strandsQuery; 
	
	
	public ProductBase() {
		
	}
	
	
	public ProductBase(Long id, String title) {
		setFoxId(id);
		setTitle(title);
	}

	public ProductBase(Long id) {
		setFoxId(id);
	}
	
	
	
	public Long getFoxId() {
		return foxId;
	}

	public void setFoxId(Long foxId) {
		this.foxId = foxId;
	}

	public Long getDefaultVersionId() {
		return defaultVersionId;
	}

	public void setDefaultVersionId(Long defaultVersionId) {
		this.defaultVersionId = defaultVersionId;
	}

	public String getFinancialProductId() {
		return financialProductId;
	}

	public void setFinancialProductId(String financialProductId) {
		this.financialProductId = financialProductId;
	}

	public String getProductTypeCode() {
		return productTypeCode;
	}

	public void setProductTypeCode(String productTypeCode) {
		this.productTypeCode = productTypeCode;
	}	
	
	public String getProductTypeDesc() {
		return productTypeDesc;
	}

	public void setProductTypeDesc(String productTypeDesc) {
		this.productTypeDesc = productTypeDesc;
	}


	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}


	public Integer getProductionYear() {
		return productionYear;
	}


	public void setProductionYear(Integer productionYear) {
		this.productionYear = productionYear;
	}


	public Date getReleaseDate() {
		return releaseDate;
	}


	public void setReleaseDate(Date releaseDate) {
		if (releaseDate!=null) {
			this.releaseDate = new java.sql.Date(releaseDate.getTime());
		}
	}


	public String getFinancialDivisionCode() {
		return financialDivisionCode;
	}


	public void setFinancialDivisionCode(String financialDivisionCode) {
		this.financialDivisionCode = financialDivisionCode;
	}


	public String getLifecycleStatusCode() {
		return lifecycleStatusCode;
	}


	public void setLifecycleStatusCode(String lifecycleStatusCode) {
		this.lifecycleStatusCode = lifecycleStatusCode;
	}


	public String getLifecycleStatusDescription() {
		return lifecycleStatusDescription;
	}


	public void setLifecycleStatusDescription(String lifecycleStatusDescription) {
		this.lifecycleStatusDescription = lifecycleStatusDescription;
	}
	
	public String getStrandsQuery() {
		return strandsQuery;
	}

	public void setStrandsQuery(String strandsQuery) {
		this.strandsQuery = strandsQuery;
	}


	public String getOriginalMediaCode() {
		return originalMediaCode;
	}


	public void setOriginalMediaCode(String originalMediaCode) {
		this.originalMediaCode = originalMediaCode;
	}


	public String getOriginalMediaDesc() {
		return originalMediaDesc;
	}


	public void setOriginalMediaDesc(String originalMediaDescription) {
		this.originalMediaDesc = originalMediaDescription;
	}


	public String getStatusCode() {
		return statusCode;
	}


	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}


	public String getFinancialDivisionDesc() {
		return financialDivisionDesc;
	}


	public void setFinancialDivisionDesc(String financialDivisionDesc) {
		this.financialDivisionDesc = financialDivisionDesc;
	}
	
	
	

}
