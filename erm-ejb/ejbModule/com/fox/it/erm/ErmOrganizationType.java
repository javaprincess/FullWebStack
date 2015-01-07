package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="EDM_REF_ORG_TYPE_VW")
public class ErmOrganizationType {
	
	@Id
	@Column(name="ORG_TYP_CD", length=15)
	private String organizationTypeCode;
	
	@Column(name="ORG_TYP_DESC", length=200)
	private String organizationTypeDesc;	
	
	
	public String getOrganizationTypeCode() {
		return organizationTypeCode;
	}

	public void setOrganizationTypeCode(String organizationTypeCode) {
		this.organizationTypeCode = organizationTypeCode;
	}

	public String getOrganizationTypeDesc() {
		return organizationTypeDesc;
	}

	public void setOrganizationTypeDesc(String organizationTypeDesc) {
		this.organizationTypeDesc = organizationTypeDesc;
	}	

}