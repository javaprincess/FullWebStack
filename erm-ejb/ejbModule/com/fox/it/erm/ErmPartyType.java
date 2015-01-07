package com.fox.it.erm;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
@Entity
@Table(name="EDM_REF_PARTY_TYPE_VW")
public class ErmPartyType {
	
	@Id
	@Column(name="PTY_TYP_CD", length=15)
	private String partyTypeCode;
	
	@Column(name="PTY_TYP_DESC", length=200)
	private String partyTypeDesc;	

	public String getPartyTypeCode() {
		return partyTypeCode;
	}

	public void setPartyTypeCode(String partyTypeCode) {
		this.partyTypeCode = partyTypeCode;
	}

	public String getPartyTypeDesc() {
		return partyTypeDesc;
	}

	public void setPartyTypeDesc(String partyTypeDesc) {
		this.partyTypeDesc = partyTypeDesc;
	}
	
}