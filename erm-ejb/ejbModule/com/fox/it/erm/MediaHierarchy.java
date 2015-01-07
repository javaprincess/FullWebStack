package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="MEDIA_HIER")
public class MediaHierarchy implements Hierarchy{

	@Id
	@Column(name="MEDIA_HIER_ID")
	private Long mediaHierarchyId;
	
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
	
	@Column(name="PRNT_MEDIA_ID")
	private Long parentMediaId;
	
	@Column(name="CHLD_MEDIA_ID")
	private Long childMediaId;
	
	@Column(name="CONF_BY_LGL_IND")
	private Boolean configureByLegalIndicator;
	
	@Column(name="MEDIA_SEQ")
	private Long mediaSequence;
	
	@Column(name="ACTV_FLG")
	private String activeFlag;

	public Long getMediaHierarchyId() {
		return mediaHierarchyId;
	}

	public void setMediaHierarchyId(Long mediaHierarchyId) {
		this.mediaHierarchyId = mediaHierarchyId;
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

	public Long getParentMediaId() {
		return parentMediaId;
	}

	public void setParentMediaId(Long parentMediaId) {
		this.parentMediaId = parentMediaId;
	}

	public Long getChildMediaId() {
		return childMediaId;
	}

	public void setChildMediaId(Long childMediaId) {
		this.childMediaId = childMediaId;
	}

	public Boolean getConfigureByLegalIndicator() {
		return configureByLegalIndicator;
	}

	public void setConfigureByLegalIndicator(Boolean configureByLegalIndicator) {
		this.configureByLegalIndicator = configureByLegalIndicator;
	}

	public Long getMediaSequence() {
		return mediaSequence;
	}

	public void setMediaSequence(Long mediaSequence) {
		this.mediaSequence = mediaSequence;
	}

	public String getActiveFlag() {
		return activeFlag;
	}

	public void setActiveFlag(String activeFlag) {
		this.activeFlag = activeFlag;
	}

	@Override
	public Long getParentId() {
		return getParentMediaId();
	}

	@Override
	public Long getChildId() {
		return getChildMediaId();
	}

	
}
