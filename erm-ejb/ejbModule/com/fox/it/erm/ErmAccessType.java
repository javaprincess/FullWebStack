package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="REF_ACCESS_TYP")
public class ErmAccessType {
	
	@Id	
	@Column(name="ACCESS_TYP_ID")
	private Long accessTypeId;
	
	@Column(name="ACCESS_TYP_CD", length=15)
	private String accessTypeCode;
	
	@Column(name="ACCESS_TYP_DESC", length=200)
	private String accessTypeDesc;	
	
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

	public Long getAccessTypeId() {
		return accessTypeId;
	}

	public void setAccessTypeId(Long accessTypeId) {
		this.accessTypeId = accessTypeId;
	}

	public String getAccessTypeCode() {
		return accessTypeCode;
	}

	public void setAccessTypeCode(String accessTypeCode) {
		this.accessTypeCode = accessTypeCode;
	}

	public String getAccessTypeDesc() {
		return accessTypeDesc;
	}

	public void setAccessTypeDesc(String accessTypeDesc) {
		this.accessTypeDesc = accessTypeDesc;
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