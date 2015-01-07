package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@MappedSuperclass
public abstract class ErmProductRestrictionBaseFields implements ErmUpdatable{

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "CRT_DT")
	protected Date createDate;
	@Column(name = "CRT_NM", length = 50)
	protected String createName;
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "UPD_DT")
	protected Date updateDate;
	@Column(name = "UPD_NM", length = 50)
	protected String updateName;
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "STRT_DT")
	protected Date startDate;
	@Column(name = "STRT_DT_CD_ID")
	protected Long startDateCdId;
	@Column(name = "STRT_DT_EXPR_INSTNC_ID")
	protected Long startDateExprInstncId;
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "END_DT")
	protected Date endDate;
	@Column(name = "END_DT_CD_ID")
	protected Long endDateCdId;
	@Column(name = "END_DT_EXPR_INSTNC_ID")
	protected Long endDateExprInstncId;
	@Column(name = "LGL_IND")
	protected Boolean legalInd;
	@Column(name = "BSNS_IND")
	protected Boolean businessInd;

	public ErmProductRestrictionBaseFields() {

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

	public boolean isLegal() {
		return Boolean.TRUE.equals(getLegalInd());
	}

	public boolean isBusiness() {
		return Boolean.TRUE.equals(getBusinessInd());
	}

	public String getIconType() {
		return IconTypeProcessor.getIconType(this);
	}

	
	public boolean isSameType(boolean isBusiness) {
		if (isBusiness && isBusiness()) return true;
		if (!isBusiness && isLegal()) return true;
		return false;
	}
	
	public void copyFrom(ErmProductRestrictionBaseFields r) {
		setBusinessInd(r.getBusinessInd());
		setCreateDate(r.getCreateDate());
		setCreateName(r.getCreateName());
		setEndDate(r.getEndDate());
		setEndDateCdId(r.getEndDateCdId());
		setEndDateExprInstncId(r.getEndDateExprInstncId());
		setLegalInd(r.getLegalInd());
		setStartDate(r.getStartDate());
		setStartDateCdId(r.getStartDateCdId());
		setStartDateExprInstncId(r.getStartDateExprInstncId());
		setUpdateDate(r.getUpdateDate());
		setUpdateName(r.getUpdateName());
		
	}

}
