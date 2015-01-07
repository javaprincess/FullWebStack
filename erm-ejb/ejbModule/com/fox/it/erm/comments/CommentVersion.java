package com.fox.it.erm.comments;

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

@Entity
@Table(name="CMNT_VER")
public class CommentVersion {
	
	@Id
	@SequenceGenerator(name = "CMNT_VER_SEQ", sequenceName = "CMNT_VER_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "CMNT_VER_SEQ")	
	@Column(name="CMNT_VER_ID")
	private Long id;
	
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
	
	@Column(name="CURR_CMNT_ID")
	private Long currentCommentId;
	
	@Column(name="PRIOR_CMNT_ID")
	private Long previousCommentId;
	
	@Column(name="BSNS_REVIEW_IND")
	private Boolean reviewedByBusiness;
	
	@Column(name="LGL_REVIEW_IND")
	private Boolean reviewedByLegal;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Long getCurrentCommentId() {
		return currentCommentId;
	}

	public void setCurrentCommentId(Long currentCommentId) {
		this.currentCommentId = currentCommentId;
	}

	public Long getPreviousCommentId() {
		return previousCommentId;
	}

	public void setPreviousCommentId(Long previousCommentId) {
		this.previousCommentId = previousCommentId;
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
	
	public boolean isReviewedByLegal() {
		return Boolean.TRUE.equals(getReviewedByLegal());
	}

	public boolean isReviewedByBusiness() {
		return Boolean.TRUE.equals(getReviewedByBusiness());
	}
	
}
