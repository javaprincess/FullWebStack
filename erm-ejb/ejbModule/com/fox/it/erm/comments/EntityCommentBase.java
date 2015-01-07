package com.fox.it.erm.comments;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.SequenceGenerator;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;


@MappedSuperclass
public class EntityCommentBase {

	@Id
	@SequenceGenerator(name = "ENTTY_CMNT_SEQ", sequenceName = "ENTTY_CMNT_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ENTTY_CMNT_SEQ")			
	@Column(name="ENTTY_CMNT_ID")
	private Long id;
	
	@Column(name="ENTTY_TYP_ID")
	private Long entityTypeId;
	
	@Column(name="ENTTY_KEY")
	private Long entityId;

	@Column(name="ENTTY_CMNT_TYP_ID")
	private Long entityCommentTypeId;
	
	@Column(name="CMNT_SEQ")
	private Long commentSequence;
	
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
	
	@Column(name="CMNT_ID")
	private Long commentId;
	
	
	
	public EntityCommentBase() {
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getEntityTypeId() {
		return entityTypeId;
	}

	public void setEntityTypeId(Long entityTypeId) {
		this.entityTypeId = entityTypeId;
	}

	public Long getEntityId() {
		return entityId;
	}

	public void setEntityId(Long entityId) {
		this.entityId = entityId;
	}


	
	public Long getEntityCommentTypeId() {
		return entityCommentTypeId;
	}

	public void setEntityCommentTypeId(Long entityCommentTypeId) {
		this.entityCommentTypeId = entityCommentTypeId;
	}

	public Long getCommentSequence() {
		return commentSequence;
	}

	public void setCommentSequence(Long commentSequence) {
		this.commentSequence = commentSequence;
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
	
	
	public Long getCommentId() {
		return commentId;
	}

	public void setCommentId(Long commentId) {
		this.commentId = commentId;
	}
	

}
