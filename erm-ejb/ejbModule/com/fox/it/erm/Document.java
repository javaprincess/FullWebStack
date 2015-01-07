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

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Grouping of attachments for an entity
 * @author JonathanP
 *
 */
@Entity
@Table(name="DOCUMENT")
public class Document implements ErmUpdatable {
	@Id
	@SequenceGenerator(name = "DOCUMENT_SEQ", sequenceName = "DOCUMENT_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "DOCUMENT_SEQ")			
	@Column(name="DOC_ID")
	private Long id;
	
	@Column(name="CNTNT_TYP_ID")
	private Long documentTypeId;	
	
	@Column(name="CNTNT_LEN")
	private Long contentLength;
	
	@Column(name="DOC_NM", length=200)
	private String documentName;
	
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

	public Long getDocumentTypeId() {
		return documentTypeId;
	}

	public void setDocumentTypeId(Long documentTypeId) {
		this.documentTypeId = documentTypeId;
	}

	public Long getContentLength() {
		return contentLength;
	}

	public void setContentLength(Long contentLength) {
		this.contentLength = contentLength;
	}

	public String getDocumentName() {
		return documentName;
	}

	public void setDocumentName(String documentName) {
		this.documentName = documentName;
	}

	@JsonIgnore
	public boolean isNew() {
		return id==null;
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
	@Override
	public String getIconType() {
	  //NOT USED HERE
	  return null;
	}
	public void copyBasicFrom(Document document) {
		setDocumentName(document.getDocumentName());
		setContentLength(document.getContentLength());
		setDocumentTypeId(document.getDocumentTypeId());		
	}
	
}
