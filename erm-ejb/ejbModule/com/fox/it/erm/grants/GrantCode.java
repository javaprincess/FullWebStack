package com.fox.it.erm.grants;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import java.sql.Date;

import org.eclipse.persistence.annotations.BatchFetch;
import org.eclipse.persistence.annotations.BatchFetchType;

import com.fox.it.erm.grants.GrantType;

@Entity
@Table(name="GRNT_CODE")
public class GrantCode {
	
	//COLUMNS -- BEGIN
	@Id
	@Column(name="GRNT_CD_ID")
	@SequenceGenerator(name = "GRNT_CODE_SEQ", sequenceName = "GRNT_CODE_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "GRNT_CODE_SEQ")
	private Long id;

	@Column(name="GRNT_CD")
	private String code;
	
	@Column(name="GRNT_DESC")
	private String description;
	
	@ManyToOne
	@JoinColumn(name="GRNT_TYP_ID", nullable=false,insertable=false,updatable=false)		
	@BatchFetch(BatchFetchType.JOIN)
	private GrantType grantType;
	
	@Column(name="GRNT_TYP_ID")
	private Long grantTypeId;
	
	@Column(name="GRNT_CLRNC_MEMO_TMPLT") //nullable == true
	private String clearanceMemoTemplate;
	
	@Column(name="ACTV_FLG")
	private String activeFlag;
	
	@Column(name="CRT_DT")
	private Date createDate;
	
	@Column(name="UPD_DT") //nullable == true
	private Date updateDate;
	
	@Column(name="CRT_NM") //nullable == true
	private String createName;
	
	@Column(name="UPD_NM") //nullable == true
	private String updateName;

	//COLUMNS -- END
	
	//READ ONLY OBJECT
	public Long getId() {
		return this.id;
	}

	public String getCode() {
		return this.code;
	}

	public String getDescription() {
		return this.description;
	}

	public GrantType getGrantType() {
		return this.grantType;
	}

	public String getActiveFlag() {
		return this.activeFlag;
	}
	
	public String getCreateName() {
		return this.createName;
	}
	
	public void setCreateName(String createName)
	{
		this.createName = createName;
	}
	
	public String getUpdateName() {
		return this.updateName;
	}
	
	public String getClearanceMemoTemplate() {
		return this.clearanceMemoTemplate;
	}
	
	public Date getCreateDate() {
		return this.createDate;
	}
	
	public Date getUpdateDate() {
		return this.updateDate;
	}

	public Long getGrantTypeId() {
		return grantTypeId;
	}

	public void setGrantTypeId(Long grantTypeId) {
		this.grantTypeId = grantTypeId;
	}
	
	
	
	/*
	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public void setClearanceMemoTemplate(String clearanceMemoTemplate) {
		this.clearanceMemoTemplate = clearanceMemoTemplate;
	}
	public void setUpdateName(String updateName) {
		this.updateName = updateName;
	}
	public void setActiveFlag(String activeFlag) {
		this.activeFlag = activeFlag;
	}
	public void setGrantTypeId(Long grantTypeId) {
		this.grantTypeId = grantTypeId;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public void setId(Long id) {
		this.id = id;
	}
	*/
}
