package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="REF_CNTRCT_PTY_TYP")
public class ErmContractualPartyType {
	
	@Id	
	@Column(name="CONT_PTY_TYP_ID")
	private Long contractualPartyTypeId;
	
	@Column(name="CONT_PTY_TYP_CD", length=15)
	private String contractualPartyTypeCode;
	
	@Column(name="CONT_PTY_TYP_DESC", length=200)
	private String contractualPartyTypeDesc;	
	
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

	public Long getContractualPartyTypeId() {
		return contractualPartyTypeId;
	}

	public void setContractualPartyTypeId(Long contractualPartyTypeId) {
		this.contractualPartyTypeId = contractualPartyTypeId;
	}

	public String getContractualPartyTypeCode() {
		return contractualPartyTypeCode;
	}

	public void setContractualPartyTypeCode(String contractualPartyTypeCode) {
		this.contractualPartyTypeCode = contractualPartyTypeCode;
	}

	public String getContractualPartyTypeDesc() {
		return contractualPartyTypeDesc;
	}

	public void setContractualPartyTypeDesc(String contractualPartyTypeDesc) {
		this.contractualPartyTypeDesc = contractualPartyTypeDesc;
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