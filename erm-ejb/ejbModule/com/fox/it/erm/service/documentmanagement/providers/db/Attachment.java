package com.fox.it.erm.service.documentmanagement.providers.db;

import java.sql.Blob;
import java.util.Date;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;


@Entity
@Table(name="DOCUMENT")
public class Attachment {
	
		@Id
		@SequenceGenerator(name = "DOCUMENT_SEQ", sequenceName = "DOCUMENT_SEQ",allocationSize=1)
		@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "DOCUMENT_SEQ")		
		@Column(name="DOC_ID")
		private Long id;
		
		@Basic(fetch=FetchType.LAZY)
		@Lob
		@Column(name="DOC_CONTENT")
		private Blob content;
		
		
		@Column(name="LGL_IND")
		private int legalIndicator;
		
		@Column(name="BSNS_IND")
		private int businessIndicator;
		
		@Column(name="PUB_IND")
		private int publicIndicator;
			
		@Column(name="CNTNT_LEN")
		private Long contentLength;
		
		@Column(name="CNTNT_TYP_ID")
		private Integer contentTypeId;
		
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
		
		@Column(name="DOC_NM")
		private String fileName;

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public Blob getContent() {
			return content;
		}

		public void setContent(Blob content) {
			this.content = content;
		}

		public int getLegalIndicator() {
			return legalIndicator;
		}

		public void setLegalIndicator(int legalIndicator) {
			this.legalIndicator = legalIndicator;
		}

		public int getBusinessIndicator() {
			return businessIndicator;
		}

		public void setBusinessIndicator(int businessIndicator) {
			this.businessIndicator = businessIndicator;
		}

		public int getPublicIndicator() {
			return publicIndicator;
		}

		public void setPublicIndicator(int publicIndicator) {
			this.publicIndicator = publicIndicator;
		}

		public Long getContentLength() {
			return contentLength;
		}

		public void setContentLength(Long contentLength) {
			this.contentLength = contentLength;
		}

		public Integer getContentTypeId() {
			return contentTypeId;
		}

		public void setContentTypeId(Integer contentTypeId) {
			this.contentTypeId = contentTypeId;
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

		public String getFileName() {
			return fileName;
		}

		public void setFileName(String fileName) {
			this.fileName = fileName;
		}
		
		
}
