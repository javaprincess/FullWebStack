package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * Class used to hold results from right restriction SQL query
 * @author AndreasM
 *
 */
@Entity
public class RightRestrictionForQuery {
	@Id
	@Column(name="RGHT_RSTRCN_ID")
	private Long rightRestrictionId;
	
	@Column(name="RGHT_STRND_ID")
	private Long rightStrandId;
	
	
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
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="STRT_DT")
	private Date startDate;
	
	@Column(name="STRT_DT_CD_ID")
	private Long startDateCdId;
	
	@Column(name="STRT_DT_EXPR_INSTNC_ID")
	private Long startDateExprInstncId;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="END_DT")
	private Date endDate;
	
	@Column(name="END_DT_CD_ID")
	private Long endDateCdId;
		
	
	@Column(name="END_DT_EXPR_INSTNC_ID")
	private Long endDateExprInstncId;
	
	@Column(name="LGL_IND")
	private Boolean legalInd;
	
	@Column(name="BSNS_IND")
	private Boolean businessInd;
	
	@Column(name="RSTRCN_CD_ID")
	private Long restrictionId;
	
	@Column(name="RSTRCN_CD")
	private String restrictionCode;
	
	@Column(name="RSTRCN_DESC")
	private String restrictionName;
	
	@Column(name="RSTRCN_TYP_ID")
	private Long restrictionTypeId;
	
	@Column(name="RSTRCN_TYP_CD")
	private String restrictionTypeCode;
	
	@Column(name="RSTRCN_TYP_DESC")
	private String restrictionTypeName;
	
	@Column(name="START_DT_CD")
	private String startDateCode;
	
	@Column(name="START_DT_DESC")
	private String startDateName;
	
	@Column(name="END_DT_CD")
	private String endDateCode;
	
	@Column(name="END_DT_DESC")
	private String endDateName;
	


	public Long getRightRestrictionId() {
		return rightRestrictionId;
	}


	public void setRightRestrictionId(Long rightRestrictionId) {
		this.rightRestrictionId = rightRestrictionId;
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


	public Date getStartDate() {
		return startDate;
	}


	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}


	public Long getStartDateCdId() {
		return startDateCdId;
	}


	public void setStartDateCdId(Long startDateCdId) {
		this.startDateCdId = startDateCdId;
	}


	public Long getStartDateExprInstncId() {
		return startDateExprInstncId;
	}


	public void setStartDateExprInstncId(Long startDateExprInstncId) {
		this.startDateExprInstncId = startDateExprInstncId;
	}


	public Date getEndDate() {
		return endDate;
	}


	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}


	public Long getEndDateCdId() {
		return endDateCdId;
	}


	public void setEndDateCdId(Long endDateCdId) {
		this.endDateCdId = endDateCdId;
	}


	public Long getEndDateExprInstncId() {
		return endDateExprInstncId;
	}


	public void setEndDateExprInstncId(Long endDateExprInstncId) {
		this.endDateExprInstncId = endDateExprInstncId;
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


	public String getRestrictionCode() {
		return restrictionCode;
	}


	public void setRestrictionCode(String restrictionCode) {
		this.restrictionCode = restrictionCode;
	}


	public String getRestrictionName() {
		return restrictionName;
	}


	public void setRestrictionName(String restrictionName) {
		this.restrictionName = restrictionName;
	}


	public String getRestrictionTypeCode() {
		return restrictionTypeCode;
	}


	public void setRestrictionTypeCode(String restrictionTypeCode) {
		this.restrictionTypeCode = restrictionTypeCode;
	}


	public String getRestrictionTypeName() {
		return restrictionTypeName;
	}


	public void setRestrictionTypeName(String restrictionTypeName) {
		this.restrictionTypeName = restrictionTypeName;
	}


	public String getStartDateCode() {
		return startDateCode;
	}


	public void setStartDateCode(String startDateCode) {
		this.startDateCode = startDateCode;
	}


	public String getStartDateName() {
		return startDateName;
	}


	public void setStartDateName(String startDateName) {
		this.startDateName = startDateName;
	}


	public String getEndDateCode() {
		return endDateCode;
	}


	public void setEndDateCode(String endDateCode) {
		this.endDateCode = endDateCode;
	}


	public String getEndDateName() {
		return endDateName;
	}


	public void setEndDateName(String endDateName) {
		this.endDateName = endDateName;
	}


	public Long getRestrictionId() {
		return restrictionId;
	}


	public void setRestrictionId(Long restrictionId) {
		this.restrictionId = restrictionId;
	}


	public Long getRestrictionTypeId() {
		return restrictionTypeId;
	}


	public void setRestrictionTypeId(Long restrictionTypeId) {
		this.restrictionTypeId = restrictionTypeId;
	}


	public Long getRightStrandId() {
		return rightStrandId;
	}


	public void setRightStrandId(Long rightStrandId) {
		this.rightStrandId = rightStrandId;
	}
	
	
	
	
	
	
	

}
