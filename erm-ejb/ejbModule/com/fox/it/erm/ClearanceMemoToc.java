package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

@Entity
@Table(name="CLRNC_MEMO_TOC")
public class ClearanceMemoToc {
	@Id
	@SequenceGenerator(name = "CLRNC_MEMO_TOC_SEQ", sequenceName = "CLRNC_MEMO_TOC_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "CLRNC_MEMO_TOC_SEQ")		
	@Column(name="CLRNC_MEMO_TOC_ID")
	private Long id;
	@Column(name="PRNT_CMNT_ID")
	private Long parentCommentId;
	@Column(name="CHLD_CMNT_ID")
	private Long childCommentId;
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="CRT_DT")
	private Date createDate;
	
	@Column(name="CRT_NM", length=50)
	private String createName;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="UPD_DT")
	private Date updateDate;
	
	@Column(name="UPD_NM")
	private String updateName;
	
	
	@Column(name="CHLD_SEQ")
	private Long childSequece;
	
	@Transient
	private boolean linked;
	
	@Column(name="IGNR_CMNT_SHRT_DESC_IND")	
	private Boolean ignoreTitle;
	
	@Transient
	private Boolean reviewedByBusiness;
	
	@Transient
	private Boolean reviewedByLegal;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getParentCommentId() {
		return parentCommentId;
	}
	public void setParentCommentId(Long parentCommentId) {
		this.parentCommentId = parentCommentId;
	}
	public Long getChildCommentId() {
		return childCommentId;
	}
	public void setChildCommentId(Long childCommentId) {
		this.childCommentId = childCommentId;
	}
	public Long getChildSequece() {
		return childSequece;
	}
	public void setChildSequece(Long childSequece) {
		this.childSequece = childSequece;
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
	public boolean isLinked() {
		return linked;
	}
	public void setLinked(boolean linked) {
		this.linked = linked;
	}	
	public boolean isIgnoreTitle() {
		return ignoreTitle == null || ignoreTitle.booleanValue() == false ? false : true;
	}
	public void setIgnoreTitle(Boolean ignoreTitle) {
		this.ignoreTitle = ignoreTitle;
	}
	public Boolean getReviewedByBusiness() {
		return reviewedByBusiness;
	}
	public void setReviewedByBusiness(Boolean reviewedByBusiness) {
		this.reviewedByBusiness = reviewedByBusiness;
	}
	public Boolean getReviewedByLegal() {
		return reviewedByLegal;
	}
	public void setReviewedByLegal(Boolean reviewedByLegal) {
		this.reviewedByLegal = reviewedByLegal;
	}

}
