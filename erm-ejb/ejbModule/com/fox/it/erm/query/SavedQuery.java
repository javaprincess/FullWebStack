package com.fox.it.erm.query;



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
@Table(name="SVD_QRY")
public class SavedQuery implements ERMQuery {
	
		//COLUMNS -- BEGIN
		@Id
		@Column(name="QRY_ID")
		@SequenceGenerator(name = "SVD_QRY_SEQ", sequenceName = "SVD_QRY_SEQ",allocationSize=1)
		@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SVD_QRY_SEQ")
		private Long id;
		
		@Column(name="QRY_NM")
		private String name;
		
		@Column(name="PRSNL_TAG")
		private String prsnlTag;
		
		@Column(name="SRC_RPT_ID")		
		private Long sourceReportId;
		
		@Column(name="PBLC_FLG") //nullable == true
		private char publicFlag;
		
		@Column(name="MTD_FLG")
		private char monthToDateFlag;
		
		@Column(name="CRT_NM") //nullable == true
		private String createName;
		
		@Column(name="UPD_NM") //nullable == true
		private String updateName;

		@Column(name="CRT_DT")
		@Temporal(value=TemporalType.TIMESTAMP)
		private Date createDate;
		
		@Column(name="UPD_DT") //nullable == true
		@Temporal(value=TemporalType.TIMESTAMP)
		private Date updateDate;
		
		@Column(name="CMNTS")
		private String queryComment;
		
		//COLUMNS -- END
		
		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getPrsnlTag() {
			return prsnlTag;
		}

		public void setPrsnlTag(String prsnlTag) {
			this.prsnlTag = prsnlTag;
		}

		public Long getSourceReportId() {
			return sourceReportId;
		}

		public void setSourceReportId(Long sourceReportId) {
			this.sourceReportId = sourceReportId;
		}

		public char getPublicFlag() {
			return publicFlag;
		}

		public void setPublicFlag(char publicFlag) {
			this.publicFlag = publicFlag;
		}

		public char getMonthToDateFlag() {
			return monthToDateFlag;
		}

		public void setMonthToDateFlag(char monthToDateFlag) {
			this.monthToDateFlag = monthToDateFlag;
		}

		public String getCreateName() {
			return createName;
		}

		public void setCreateName(String createName) {
			this.createName = createName;
		}

		public String getUpdateName() {
			return updateName;
		}

		public void setUpdateName(String updateName) {
			this.updateName = updateName;
		}

		public Date getCreateDate() {
			return createDate;
		}

		public void setCreateDate(Date createDate) {
			this.createDate = createDate;
		}

		public Date getUpdateDate() {
			return updateDate;
		}

		public void setUpdateDate(Date updateDate) {
			this.updateDate = updateDate;
		}

		public String getQueryComment() {
			return queryComment;
		}

		public void setQueryComment(String queryComment) {
			this.queryComment = queryComment;
		}

		
		

}
