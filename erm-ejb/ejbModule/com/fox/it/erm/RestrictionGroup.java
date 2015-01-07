package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="REF_RSTRCN_TYP")
public class RestrictionGroup {

	@Id
	@Column(name="RSTRCN_TYP_ID")
	private Long restrictionTypeId;
	
	@Column(name="RSTRCN_TYP_CD")
	private String restrictionTypeCode;
	
	@Column(name="RSTRCN_TYP_DESC")
	private String restrictionTypeDescription;

	public Long getRestrictionTypeId() {
		return restrictionTypeId;
	}

	public void setRestrictionTypeId(Long restrictionTypeId) {
		this.restrictionTypeId = restrictionTypeId;
	}

	public String getRestrictionTypeCode() {
		return restrictionTypeCode;
	}

	public void setRestrictionTypeCode(String restrictionTypeCode) {
		this.restrictionTypeCode = restrictionTypeCode;
	}

	public String getRestrictionTypeDescription() {
		return restrictionTypeDescription;
	}

	public void setRestrictionTypeDescription(String restrictionTypeDescription) {
		this.restrictionTypeDescription = restrictionTypeDescription;
	}
	
	
}
