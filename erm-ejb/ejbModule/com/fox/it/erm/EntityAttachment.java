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

/**
 * Grouping of attachments for an entity
 * @author JonathanP
 *
 */
@Entity
@Table(name="ENTTY_ATTCHMNT")
public class EntityAttachment {
	@Id
	@SequenceGenerator(name = "ENTTY_ATTCHMNT_SEQ", sequenceName = "ENTTY_ATTCHMNT_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ENTTY_ATTCHMNT_SEQ")			
	@Column(name="ENTTY_ATTCHMNT_ID")
	private Long id;
	
	@Column(name="ENTTY_TYP_ID")
	private Long entityTypeId;
	
	@Column(name="DOC_ID")
	private Long documentId;
	
	@Column(name="ENTTY_KEY")
	private Long entityId;

	@Column(name="ATTCHMNT_TYP_ID")
	private Long attachmentTypeId;
	
	@Column(name="ATTCHMNT_SEQ")
	private Long attachmentSequence;
	
	@Column(name="ATTCHMNT_NM", length=100)
	private String attachmentName;
	
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
	
	public Long getDocumentId() {
		return documentId;
	}

	public void setDocumentId(Long documentId) {
		this.documentId = documentId;
	}

	public String getAttachmentName() {
		return attachmentName;
	}

	public void setAttachmentName(String attachmentName) {
		this.attachmentName = attachmentName;
	}

	public Long getAttachmentTypeId() {
		return attachmentTypeId;
	}

	public void setAttachmentTypeId(Long attachmentTypeId) {
		this.attachmentTypeId = attachmentTypeId;
	}

	public Long getAttachmentSequence() {
		return attachmentSequence;
	}

	public void setAttachmentSequence(Long attachmentSequence) {
		this.attachmentSequence = attachmentSequence;
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
