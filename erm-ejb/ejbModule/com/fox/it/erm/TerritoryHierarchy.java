package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="TRRTRY_HIER")
public class TerritoryHierarchy implements Hierarchy {

	@Id
	@Column(name="TRRTRY_HIER_ID")
	private Long territoryHierarchyId;
	
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
	
	@Column(name="PRNT_TRRTRY_ID")
	private Long parentTerritoryId;
	
	@Column(name="CHLD_TRRTRY_ID")
	private Long childTerritoryId;
	
	@Column(name="CONF_BY_LGL_IND")
	private Boolean confirmationByLegalIndicator;
	
	@Column(name="TRRTRY_SEQ")
	private Long territorySequence;
	
	@Column(name="ACTV_FLG")
	private String activeFlag;

	public Long getTerritoryHierarchyId() {
		return territoryHierarchyId;
	}

	public void setTerritoryHierarchyId(Long territoryHierarchyId) {
		this.territoryHierarchyId = territoryHierarchyId;
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

	public Long getParentTerritoryId() {
		return parentTerritoryId;
	}

	public void setParentTerritoryId(Long parentTerritoryId) {
		this.parentTerritoryId = parentTerritoryId;
	}

	public Long getChildTerritoryId() {
		return childTerritoryId;
	}

	public void setChildTerritoryId(Long childTerritoryId) {
		this.childTerritoryId = childTerritoryId;
	}

	public Boolean getConfirmationByLegalIndicator() {
		return confirmationByLegalIndicator;
	}

	public void setConfirmationByLegalIndicator(Boolean confirmationByLegalIndicator) {
		this.confirmationByLegalIndicator = confirmationByLegalIndicator;
	}

	public Long getTerritorySequence() {
		return territorySequence;
	}

	public void setTerritorySequence(Long territorySequence) {
		this.territorySequence = territorySequence;
	}

	public String getActiveFlag() {
		return activeFlag;
	}

	public void setActiveFlag(String activeFlag) {
		this.activeFlag = activeFlag;
	}

	@Override
	public Long getParentId() {
		return getParentTerritoryId();
	}

	@Override
	public Long getChildId() {
		return getChildTerritoryId();
	}
	
}
