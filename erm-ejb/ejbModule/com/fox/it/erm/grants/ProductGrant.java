package com.fox.it.erm.grants;

/**
 * @author Tracy Michelle
 * 
 **/
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fox.it.erm.ErmUpdatable;
import com.fox.it.erm.comments.EntityComment;

@NamedQuery(name = ProductGrant.BULK_DELETE,
			query = "DELETE FROM ProductGrant p where p.foxVersionId in :foxVersionIds")
@Entity
@Table(name="PROD_GRNT")
public class ProductGrant implements ErmUpdatable {
		//needs to be visible for the NamedQuery
		public static final String BULK_DELETE = "ProductGrant.bulkDelete";
		
		//COLUMNS -- BEGIN
		@Id
		@SequenceGenerator(name = "PROD_GRNT_SEQ", sequenceName = "PROD_GRNT_SEQ",allocationSize=1)
		@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PROD_GRNT_SEQ")	
		@Column(name="PROD_GRNT_ID")
		private Long id;
				
		@Column(name="FOX_VERSION_ID")
		private Long foxVersionId;
				
		@Column(name="GRNT_CD_ID")
		private Long grantCodeId;
				
		@Column(name="GRNT_STS_ID")
		private Long grantStatusId;
				
		@Column(name="BSNS_IND")
		private Boolean businessInd;

		@Column(name="LGL_IND")
		private Boolean legalInd;
				
		@Column(name="STRT_DT_CD_ID")
		private Long startDateCodeId;
				
		@Column(name="STRT_DT_EXPR_INSTNC_ID")
		private Long startDateExprInstcId;
				
		@Column(name="END_DT_CD_ID")
		private Long endDateCodeId;
				
		@Column(name="END_DT_EXPR_INSTNC_ID")
		private Long endDateExprInstcId;
					
		@Column(name="CRT_DT")
		@Temporal(value=TemporalType.TIMESTAMP)		
		private Date createDate;
				
		@Column(name="END_DT")
		@Temporal(value=TemporalType.TIMESTAMP)		
		private Date endDate;
	
		@Column(name="UPD_DT") //nullable == true
		@Temporal(value=TemporalType.TIMESTAMP)		
		private Date updateDate;
				
		@Column(name="STRT_DT")
		@Temporal(value=TemporalType.TIMESTAMP)		
		private Date startDate;
					
		@Column(name="CRT_NM") //nullable == true
		private String createName;
					
		@Column(name="UPD_NM") //nullable == true
		private String updateName;

		//COLUMNS -- END
		
		//each product grant can have 0 or more comments
		//this is a aggregation relationship
		@Transient
		private List<EntityComment> entityComments = new ArrayList<EntityComment>();
				
		public Long getId() {
			return this.id;
		}

		public Long getFoxVersionId() {
			return this.foxVersionId;
		}
				
		public Long getGrantCodeId() {
			return this.grantCodeId;
		}

		public Long getGrantStatusId() {
			return grantStatusId;
		}

		public void setGrantStatusId(Long grantStatusId) {
			this.grantStatusId = grantStatusId;
		}

		public Boolean getBusinessInd() {
			return businessInd;
		}

		public void setBusinessInd(Boolean businessIndicator) {
			this.businessInd = businessIndicator;
		}

		public Boolean getLegalInd() {
			return legalInd;
		}

		public void setLegalInd(Boolean legalIndicator) {
			this.legalInd = legalIndicator;
		}

		public Long getStartDateCodeId() {
			return startDateCodeId;
		}

		public void setStartDateCodeId(Long startDateCodeId) {
			this.startDateCodeId = startDateCodeId;
		}

		public Long getStartDateExprInstcId() {
			return startDateExprInstcId;
		}

		public void setStartDateExprInstcId(Long startDateExprInstcId) {
			this.startDateExprInstcId = startDateExprInstcId;
		}

		public Long getEndDateCodeId() {
			return endDateCodeId;
		}

		public void setEndDateCodeId(Long endDateCodeId) {
			this.endDateCodeId = endDateCodeId;
		}

		public Long getEndDateExprInstcId() {
			return endDateExprInstcId;
		}

		public void setEndDateExprInstcId(Long endDateExprInstcId) {
			this.endDateExprInstcId = endDateExprInstcId;
		}

		public Date getEndDate() {
			return endDate;
		}

		public void setEndDate(Date endDate) {
			this.endDate = endDate;
		}

		public Date getStartDate() {
			return startDate;
		}

		public void setStartDate(Date startDate) {
			this.startDate = startDate;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public void setFoxVersionId(Long foxVersionId) {
			this.foxVersionId = foxVersionId;
		}

		public void setGrantCodeId(Long grantCodeId) {
			this.grantCodeId = grantCodeId;
		}

		public void setCreateDate(Date createDate) {
			this.createDate = createDate;
		}

		public void setUpdateDate(Date updateDate) {
			this.updateDate = updateDate;
		}

		public void setCreateName(String createName) {
			this.createName = createName;
		}

		public void setUpdateName(String updateName) {
			this.updateName = updateName;
		}


		public String getCreateName() {
			return this.createName;
		}
				
		public String getUpdateName() {
			return this.updateName;
		}
				
		public Date getCreateDate() {
			return this.createDate;
		}
				
		public Date getUpdateDate() {
			return this.updateDate;
		}

		@Override
		public boolean isNew() {
			return getId()==null;
		}
				
		@Override
		public boolean isLegal() {
			return Boolean.TRUE.equals(getLegalInd());
		}

		@Override
		public boolean isBusiness() {
			return Boolean.TRUE.equals(getBusinessInd());
		}		

		@Override
		public String getIconType() {
			// not implmented
			return null;
		}

		@JsonProperty("comments")
		public List<EntityComment> getEntityComments() {
			return entityComments;
		}

		public void setEntityComments(List<EntityComment> entityComment) {
			this.entityComments = entityComment;
		}
		
		

		

		
		

}
