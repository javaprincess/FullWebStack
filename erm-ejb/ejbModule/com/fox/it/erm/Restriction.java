package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.eclipse.persistence.annotations.BatchFetch;
import org.eclipse.persistence.annotations.BatchFetchType;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="RSTRCN_CODE")
public class Restriction {
	
	@Id
	@Column(name="RSTRCN_CD_ID")
	private Long id;

	@Column(name="RSTRCN_CD")
	private String code;
	
	@Column(name="RSTRCN_DESC")
	private String description;
	
	@ManyToOne
	@JoinColumn(name="RSTRCN_TYP_ID", nullable=false,insertable=false,updatable=false)		
	@BatchFetch(BatchFetchType.JOIN)
	private RestrictionType restrictionType;
	
	@Column(name="RSTRCN_TYP_ID")
	private Long restrictionTypeId;
	
	@Column(name="DFLT_BSNS_SVRTY")
	private Long defaultBusinessSeverity;
	
	@Column(name="DFLT_LGL_SVRTY")
	private Long defaultLegalSeverity;
	
	@Column(name="ALLOW_STRT_DT_FLG")
	private String allowStartDateFlag;
	
	@Column(name="ALLOW_END_DT_FLG")
	private String allowEndDateFlag;
	
	 @Column(name="ACTV_FLG")
	 private String activeFlag;
	
	
	//TODO remove fields
	@Deprecated
	@Transient
	private boolean hasComments;
	
	@Deprecated
	@Transient
	private boolean isMappedToClearanceMemo;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Long getRestrictionTypeId() {
		return restrictionTypeId;
	}

	public void setRestrictionTypeId(Long restrictionTypeId) {
		this.restrictionTypeId = restrictionTypeId;
	}

	public Long getDefaultBusinessSeverity() {
		return defaultBusinessSeverity;
	}

	public void setDefaultBusinessSeverity(Long defaultBusinessSeverity) {
		this.defaultBusinessSeverity = defaultBusinessSeverity;
	}

	public Long getDefaultLegalSeverity() {
		return defaultLegalSeverity;
	}

	public void setDefaultLegalSeverity(Long defaultLegalSeverity) {
		this.defaultLegalSeverity = defaultLegalSeverity;
	}
	
	public void setRestrictionType(RestrictionType restrictionType) {
		this.restrictionType = restrictionType;
	}

	@JsonIgnore
	public RestrictionType getRestrictionType() {
		return restrictionType;
	}
	
	public String getRestrictionTypeName() {
		return restrictionType==null?null:restrictionType.getName();
	}
	
	public String getActiveFlag() {
		return activeFlag;
	}

	@JsonIgnore
	public boolean isActive() {
		return "Y".equals(getActiveFlag());
	}



	public void setActiveFlag(String activeFlag) {
		this.activeFlag = activeFlag;
	}
	
	
	public boolean getHasComments() {
		return hasComments;
	}

	public void setHasComments(boolean hasComments) {
		this.hasComments = hasComments;
	}
	
	@Deprecated
	public boolean isMappedToClearanceMemo() {
		return isMappedToClearanceMemo;
	}

	@Deprecated	
	public void setMappedToClearanceMemo(boolean isMappedToClearanceMemo) {
		this.isMappedToClearanceMemo = isMappedToClearanceMemo;
	}

	public String getAllowStartDateFlag() {
		return allowStartDateFlag;
	}

	public void setAllowStartDateFlag(String allowStartDateFlag) {
		this.allowStartDateFlag = allowStartDateFlag;
	}

	public String getAllowEndDateFlag() {
		return allowEndDateFlag;
	}

	public void setAllowEndDateFlag(String allowEndDateFlag) {
		this.allowEndDateFlag = allowEndDateFlag;
	}	
	
	
	
}
