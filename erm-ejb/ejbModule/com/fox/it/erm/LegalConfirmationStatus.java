package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="REF_LGL_CONF_STS")
public class LegalConfirmationStatus {

	@Id
	@Column(name="LGL_CONF_STS_ID")
	private Long confirmationStatusId;
	
	@Column(name="LGL_CONF_STS_CD")
	private String confirmationStatusCode;
	
	@Column(name="LGL_CONF_STS_DESC")
	private String confirmationStatusDescription;
	
	@Column(name="LGL_CLRNC_MEMO_STS_TXT")
	private String confirmationClearanceMemoStatusText;
	
	@Column(name="LGL_RTS_IMPCT_IND")
	private Boolean legalStsImpactIndicator;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="CRT_DT")
	private Date createDate;
	
	@Column(name="CRT_NM", length=50)
	private String createName;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="UPD_DT")
	private Date updateDate;
	
	@Column(name="UPD_NM", length=50)
	private String updateName;

	public Long getConfirmationStatusId() {
		return confirmationStatusId;
	}

	public void setConfirmationStatusId(Long confirmationStatusId) {
		this.confirmationStatusId = confirmationStatusId;
	}

	public String getConfirmationStatusCode() {
		return confirmationStatusCode;
	}

	public void setConfirmationStatusCode(String confirmationStatusCode) {
		this.confirmationStatusCode = confirmationStatusCode;
	}

	public String getConfirmationStatusDescription() {
		return confirmationStatusDescription;
	}

	public void setConfirmationStatusDescription(
			String confirmationStatusDescription) {
		this.confirmationStatusDescription = confirmationStatusDescription;
	}

	
	public Boolean getLegalStsImpactIndicator() {
		return legalStsImpactIndicator;
	}

	public void setLegalStsImpactIndicator(Boolean legalStsImpactIndicator) {
		this.legalStsImpactIndicator = legalStsImpactIndicator;
	}

	public String getConfirmationClearanceMemoStatusText() {
		return confirmationClearanceMemoStatusText;
	}

	public void setConfirmationClearanceMemoStatusText(
			String confirmationClearanceMemoStatusText) {
		this.confirmationClearanceMemoStatusText = confirmationClearanceMemoStatusText;
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

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public String getUpdateName() {
		return updateName;
	}

	public void setUpdateName(String updateName) {
		this.updateName = updateName;
	}	
}
