package com.fox.it.erm.comments;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import javax.persistence.SequenceGenerator;
import javax.persistence.GeneratedValue;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fox.it.erm.ErmUpdatable;

@MappedSuperclass
public abstract class CommentBase implements ErmUpdatable{

	@Id
	@SequenceGenerator(name = "CMNT_SEQ", sequenceName = "CMNT_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "CMNT_SEQ")		
	@Column(name="CMNT_ID")
	private Long id;
	
	@Column(name="CMNT_SHRT_DESC")
	private String shortDescription;
	
	
	
	@Column(name="CMNT_TYP_ID")
	private Long commentTypeId;
	
	@Column(name="XTRCT_NO")
	private String extractNumber;
		
	@Column(name="CMNT_CNT")
	private Integer commentCount;
	
	@Column(name="PUB_IND")
	private Integer publicInd = 1;
	
	@Column(name="CMNT_STS_ID")
	private Integer commentStatus;
	
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
	
	@Column(name="LGL_IND")
	private Boolean legalInd;
	
	@Column(name="BSNS_IND")
	private Boolean businessInd;
	
	@Transient
	private Boolean legal;
	@Transient
	private Boolean business;
	@Transient
	private String iconType;
	
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getShortDescription() {
		return shortDescription;
	}
	public void setShortDescription(String shortDescription) {
		this.shortDescription = shortDescription;
	}
	public abstract String getLongDescription();
	
	public abstract void setLongDescription(String longDescription);
	
	public Integer getCommentCount() {
		return commentCount;
	}
	
	
	public Integer getPublicInd() {
		return publicInd;
	}
	public void setPublicInd(Integer publicInd) {
		this.publicInd = publicInd;
	}
	
	public Integer getCommentStatus() {
		return commentStatus;
	}
	public void setCommentStatus(Integer commentStatus) {
		this.commentStatus = commentStatus;
	}
	public String getExtractNumber() {
		return extractNumber;
	}
	public void setExtractNumber(String extractNumber) {
		this.extractNumber = extractNumber;
	}
	public void setCommentCount(Integer commentCount) {
		this.commentCount = commentCount;
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
	public Boolean getLegalInd() {
		return legalInd;
	}
	public void setLegalInd(Boolean legalInd) {
		this.legalInd = legalInd;
	}
	public Boolean getBusinessInd() {
		return businessInd;
	}
	public void setBusinessInd(Boolean businessInd) {
		this.businessInd = businessInd;
	}
	
	public boolean isBusiness() {
		return Boolean.TRUE.equals(getBusinessInd());
	}

	public boolean isLegal() {
		return Boolean.TRUE.equals(getLegalInd());
	}
	
	

	
	public Long getCommentTypeId() {
		return commentTypeId;
	}
	public void setCommentTypeId(Long commentTypeId) {
		this.commentTypeId = commentTypeId;
	}
	@JsonIgnore
	public boolean isNew() {
		return id==null;
	}
	@Override
	public String getIconType() {
		//NOT USER HERE
		return null;
	}
	
	
	public void copyBasicFrom(Comment comment) {
		setShortDescription(comment.getShortDescription());
		setCommentTypeId(comment.getCommentTypeId());
		setExtractNumber(comment.getExtractNumber());
		setPublicInd(comment.getPublicInd());
	}
	
	public void copyBasicFrom(CommentBase c) {
		setBusinessInd(c.getBusinessInd());
		setCommentCount(c.getCommentCount());
		setCommentStatus(c.getCommentStatus());
		setCommentTypeId(c.getCommentTypeId());
		setCreateDate(c.getCreateDate());
		setCreateName(c.getCreateName());
		setExtractNumber(c.getExtractNumber());
		setId(c.getId());
		setLegalInd(c.getLegalInd());
		setPublicInd(c.getPublicInd());
		setShortDescription(c.getShortDescription());
		setUpdateDate(c.getUpdateDate());
		setUpdateName(c.getUpdateName());
	}
	
	public void copyTextFrom(CommentBase c) {
		setLongDescription(c.getLongDescription());
	}
	
	public void copyFrom(CommentBase c, boolean copyLongDescription) {
		copyBasicFrom(c);
		if (copyLongDescription) {
			copyTextFrom(c);
		}
	}
	

}
