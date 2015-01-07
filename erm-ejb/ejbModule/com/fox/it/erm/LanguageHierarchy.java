package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="LNGG_HIER")
public class LanguageHierarchy implements Hierarchy{

	@Id
	@Column(name="LNGG_HIER_ID")
	private Long languageHierarchyId;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="CRT_DT")
	private Date createDate;
	
	@Column(name="CRT_NM")
	private String createName;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="UPD_DT")
	private Date updateDate;
	
	@Column(name="UPD_NM")
	private String updateName;
	
	@Column(name="PRNT_LNGG_ID")
	private Long parentLanguageId;
	
	@Column(name="CHLD_LNGG_ID")
	private Long childLanguageId;
	
	@Column(name="CONF_BY_LGL_IND")
	private boolean confirmedByLegalIndicator;
	
	@Column(name="LNGG_SEQ")
	private Long languageSequence;
	
	@Column(name="ACTV_FLG")
	private String activeFlag;

	public Long getLanguageHierarchyId() {
		return languageHierarchyId;
	}

	public void setLanguageHierarchyId(Long languageHierarchyId) {
		this.languageHierarchyId = languageHierarchyId;
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

	public Long getParentLanguageId() {
		return parentLanguageId;
	}

	public void setParentLanguageId(Long parentLanguageId) {
		this.parentLanguageId = parentLanguageId;
	}

	public Long getChildLanguageId() {
		return childLanguageId;
	}

	public void setChildLanguageId(Long childLanguageId) {
		this.childLanguageId = childLanguageId;
	}

	public boolean isConfirmedByLegalIndicator() {
		return confirmedByLegalIndicator;
	}

	public void setConfirmedByLegalIndicator(boolean confirmedByLegalIndicator) {
		this.confirmedByLegalIndicator = confirmedByLegalIndicator;
	}

	public Long getLanguageSequence() {
		return languageSequence;
	}

	public void setLanguageSequence(Long languageSequence) {
		this.languageSequence = languageSequence;
	}

	public String getActiveFlag() {
		return activeFlag;
	}

	public void setActiveFlag(String activeFlag) {
		this.activeFlag = activeFlag;
	}

	@Override
	public Long getParentId() {
		return getParentLanguageId();
	}

	@Override
	public Long getChildId() {
		return getChildLanguageId();
	}
	
	
	
}
