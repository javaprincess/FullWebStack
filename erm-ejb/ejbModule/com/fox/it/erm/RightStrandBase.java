package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.SequenceGenerator;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

@MappedSuperclass
public abstract class RightStrandBase implements ErmUpdatable{

	@Id
	@SequenceGenerator(name = "RGHT_STRND_SEQ", sequenceName = "RGHT_STRND_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "RGHT_STRND_SEQ")	
	@Column(name="RGHT_STRND_ID")
	private Long rightStrandId;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="CRT_DT")
	private Date createDate;
	
	@Column(name="CRT_NM", length=50)
	private String createName;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="UPD_DT")
	private Date updateDate;
	
	@Column(name="UPD_NM")
	private String updateName;

	@Column(name="FOX_VERSION_ID")
	private Long foxVersionId;

	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="STRT_DT")
	private Date startDate;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="END_DT")
	private Date endDate;
	
	@Column(name="EXCLD_FLG")
	private Boolean excludeFlag;
	
	@Column(name="RSTRCSN_SVRTY")
	private Short restrictionSeverity;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="CONT_STRT_DT")
	private Date contractualStartDate;
	
	@Column(name="CONT_STRT_DT_CD_ID")
	private Long contractualStartDateCodeId;
	
	@Column(name="CONT_STRT_DT_STS_ID")
	private Long contractualStartDateStatusId;
	
	@Column(name="CONT_STRT_DT_EXPR_INSTNC_ID")
	private Long contractualStartDateExprInstncId;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="OVRRD_STRT_DT")
	private Date overrideStartDate;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="RLSE_DT")
	private Date releaseDate;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="CONT_END_DT")
	private Date contractualEndDate;
	
	@Column(name="CONT_END_DT_CD_ID")
	private Long contractualEndDateCodeId;
	
	@Column(name="CONT_END_DT_STS_ID")
	private Long contractualEndDateStatusId;
	
	@Column(name="CONT_END_DT_EXPR_INSTNC_ID")
	private Long contractualEndDateExprInstncId; 
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="OVRRD_END_DT")
	private Date overrideEndDate;
	
	@JsonIgnore
	@Column(name="RGHT_BITMAP")
	private byte[] rightLegalBitmap;

	@Column(name="RGHT_STRND_SET_ID")
	private Long strandSetId;
	
	@Column(name="LGL_IND")
	private Boolean legalInd;
	
	@Column(name="BSNS_IND")
	private Boolean businessInd;
	
	@Column(name="MEDIA_ID")
	private Long mediaId;

	@Column(name="LNGG_ID")
	private Long languageId;

	@Column(name="TRRTRY_ID")
	private Long territoryId;
	

	@Column(name="STRT_DT_CD_ID")
	private Long startDateCodeId;
	
	
	@Column(name="END_DT_CD_ID")
	private Long endDateCodeId;
	
	
	

	public Long getRightStrandId() {
		return rightStrandId;
	}

	public void setRightStrandId(Long rightStrandId) {
		this.rightStrandId = rightStrandId;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getCreateName() {
		return createName;
	}

	public void setCreateName(String createName) {
		this.createName = createName;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updatedDate) {
		this.updateDate = updatedDate;
	}

	public String getUpdateName() {
		return updateName;
	}

	public void setUpdateName(String updateName) {
		this.updateName = updateName;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}	
	
	public Boolean getExcludeFlag() {
		return excludeFlag;
	}

	public void setExcludeFlag(Boolean excludeFlag) {
		this.excludeFlag = excludeFlag;
	}
	
	public boolean isExclusion() {
		return Boolean.TRUE.equals(this.excludeFlag);
	}
	
	public boolean isInclusion() {
		return !isExclusion();
	}

	public Short getRestrictionSeverity() {
		return restrictionSeverity;
	}

	public void setRestrictionSeverity(Short restrictionSeverity) {
		this.restrictionSeverity = restrictionSeverity;
	}

	public Date getContractualStartDate() {
		return contractualStartDate;
	}

	public void setContractualStartDate(Date contractualStartDate) {
		this.contractualStartDate = contractualStartDate;
	}

	public Long getContractualStartDateCodeId() {
		return contractualStartDateCodeId;
	}

	public void setContractualStartDateCodeId(Long contractualStartDateCodeId) {
		this.contractualStartDateCodeId = contractualStartDateCodeId;
	}

	public Long getContractualStartDateStatusId() {
		return contractualStartDateStatusId;
	}

	public void setContractualStartDateStatusId(Long contractualStartDateStatusId) {
		this.contractualStartDateStatusId = contractualStartDateStatusId;
	}

	public Long getContractualStartDateExprInstncId() {
		return contractualStartDateExprInstncId;
	}

	public void setContractualStartDateExprInstncId(
			Long contractualStartDateExprInstncId) {
		this.contractualStartDateExprInstncId = contractualStartDateExprInstncId;
	}

	public Date getOverrideStartDate() {
		return overrideStartDate;
	}

	public void setOverrideStartDate(Date overrideStartDate) {
		this.overrideStartDate = overrideStartDate;
	}

	public Date getReleaseDate() {
		return releaseDate;
	}

	public void setReleaseDate(Date releaseDate) {
		this.releaseDate = releaseDate;
	}

	public Date getContractualEndDate() {
		return contractualEndDate;
	}

	public void setContractualEndDate(Date contractualEndDate) {
		this.contractualEndDate = contractualEndDate;
	}

	public Long getContractualEndDateCodeId() {
		return contractualEndDateCodeId;
	}

	public void setContractualEndDateCodeId(Long contractualEndDateCodeId) {
		this.contractualEndDateCodeId = contractualEndDateCodeId;
	}

	public Long getContractualEndDateStatusId() {
		return contractualEndDateStatusId;
	}

	public void setContractualEndDateStatusId(Long contractualEndDateStatusId) {
		this.contractualEndDateStatusId = contractualEndDateStatusId;
	}

	public Long getContractualEndDateExprInstncId() {
		return contractualEndDateExprInstncId;
	}

	public void setContractualEndDateExprInstncId(
			Long contractualEndDateExprInstncId) {
		this.contractualEndDateExprInstncId = contractualEndDateExprInstncId;
	}

	public Date getOverrideEndDate() {
		return overrideEndDate;
	}

	public void setOverrideEndDate(Date overrideEndDate) {
		this.overrideEndDate = overrideEndDate;
	}

	public byte[] getRightLegalBitmap() {
		return rightLegalBitmap;
	}

	public void setRightLegalBitmap(byte[] rightLegalBitmap) {
		this.rightLegalBitmap = rightLegalBitmap;
	}

	public Long getStrandSetId() {
		return strandSetId;
	}

	public void setStrandSetId(Long strandSetId) {
		this.strandSetId = strandSetId;
	}
	
	public Boolean getLegalInd() {
		return legalInd;
	}

	public void setLegalInd(Boolean legalInd) {
		this.legalInd = legalInd;
	}

	public Boolean getBusinessInd() {
		return businessInd;
	}
	
	public boolean isBusiness() {
		return Boolean.TRUE.equals(getBusinessInd());
	}

	public boolean isLegal() {
		return Boolean.TRUE.equals(getLegalInd());
	}

	public void setBusinessInd(Boolean businessInd) {
		this.businessInd = businessInd;
	}


	public Long getMediaId() {
		return mediaId;
	}

	public void setMediaId(Long mediaId) {
		this.mediaId = mediaId;
	}

	public Long getLanguageId() {
		return languageId;
	}

	public void setLanguageId(Long languageId) {
		this.languageId = languageId;
	}

	public Long getTerritoryId() {
		return territoryId;
	}

	public void setTerritoryId(Long territoryId) {
		this.territoryId = territoryId;
	}
	
	

	@JsonIgnore
	public boolean isNew() {
		return this.rightStrandId==null;
	}
	
	
	
	public Long getFoxVersionId() {
		return foxVersionId;
	}

	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}

	public Long getStartDateCodeId() {
		return startDateCodeId;
	}

	public void setStartDateCodeId(Long startDateCodeId) {
		this.startDateCodeId = startDateCodeId;
	}

	public Long getEndDateCodeId() {
		return endDateCodeId;
	}

	public void setEndDateCodeId(Long endDateCodeId) {
		this.endDateCodeId = endDateCodeId;
	}

	/**
	 * Returns a string representing the icon type that the strand will have when displayed on the UI
	 * possible values are:
	 * 	"L" : only legal
	 *  "B" : only business
	 *  "BL": legal and business
	 * 
	 * @return
	 */
	public String getIconType() {
		return IconTypeProcessor.getIconType(this);
	}
	
	public void copyFrom(RightStrandBase s) {
		setBusinessInd(s.getBusinessInd());
		setContractualEndDate(s.getContractualEndDate());
		setContractualEndDateCodeId(s.getContractualEndDateCodeId());
		setContractualEndDateExprInstncId(s.getContractualEndDateExprInstncId());
		setContractualEndDateStatusId(s.getContractualEndDateStatusId());
		setContractualStartDate(s.getContractualStartDate());
		setContractualStartDateCodeId(s.getContractualStartDateCodeId());
		setContractualStartDateExprInstncId(s.getContractualStartDateExprInstncId());
		setContractualStartDateStatusId(s.getContractualStartDateStatusId());
		setCreateDate(s.getCreateDate());
		setCreateName(s.getCreateName());
		setEndDate(s.getEndDate());
		setEndDateCodeId(s.getEndDateCodeId());
		Boolean excludeFlag = s.getExcludeFlag()==null?Boolean.FALSE:s.getExcludeFlag();
		setExcludeFlag(excludeFlag);
		setFoxVersionId(s.getFoxVersionId());
		setLanguageId(s.getLanguageId());
		setLegalInd(s.getLegalInd());
		setMediaId(s.getMediaId());
		setOverrideEndDate(s.getOverrideEndDate());
		setOverrideStartDate(s.getOverrideStartDate());
		setReleaseDate(s.getReleaseDate());
		setRestrictionSeverity(s.getRestrictionSeverity());
		setRightLegalBitmap(s.getRightLegalBitmap());
		setRightStrandId(s.getRightStrandId());
		setStartDate(s.getStartDate());
		setStartDateCodeId(s.getStartDateCodeId());
		setStrandSetId(s.getStrandSetId());
		setTerritoryId(s.getTerritoryId());
		setUpdateDate(s.getUpdateDate());
		setUpdateName(s.getUpdateName());
	}
	
}
