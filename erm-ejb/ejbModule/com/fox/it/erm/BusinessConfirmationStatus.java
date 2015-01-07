package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="REF_BSNS_CONF_STS")
public class BusinessConfirmationStatus {

	@Id
	@Column(name="BSNS_CONF_STS_ID")
	private Long confirmationStatusId;
	
	@Column(name="BSNS_CONF_STS_CD")
	private String confirmationStatusCode;
	
	@Column(name="BSNS_CONF_STS_DESC")
	private String confirmationStatusDescription;
	
	@Column(name="BSNS_RTS_IMPCT_IND")
	private Boolean legalStsImpactIndicator;

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
	
	
}
