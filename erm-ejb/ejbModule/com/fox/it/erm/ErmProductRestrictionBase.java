package com.fox.it.erm;

import java.io.Serializable;

import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

@SuppressWarnings("serial")
@MappedSuperclass
public abstract class ErmProductRestrictionBase extends ErmProductRestrictionBaseFields implements Serializable,ErmUpdatable{

	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="STRT_DT_CD_ID", nullable=true,insertable=false,updatable=false) RefDate startDateCode;
	
	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="END_DT_CD_ID", nullable=true,insertable=false,updatable=false)
	private RefDate endDateCode;
	
	


	public void setStartDateCodeId(RefDate startDateCode) {
		this.startDateCode = startDateCode;
	}

	public RefDate getEndDateCodeId() {
		return endDateCode;
	}

	public void setEndDateCodeId(RefDate endDateCode) {
		this.endDateCode = endDateCode;
	}
	
	public RefDate getStartDateCodeId() {
		return startDateCode;
	}
	
	
	public abstract Long  getRestrictionCdId();
	
	public abstract void setRestrictionCdId(Long id);

	public void copyFrom(ErmRightRestriction r) {
		super.copyFrom(r);
		setRestrictionCdId(r.getRestrictionCdId());
	}
	
	public void copyFrom(ErmProductRestrictionBase r) {
		super.copyFrom(r);
		setRestrictionCdId(r.getRestrictionCdId());			
//		setBusinessInd(r.getBusinessInd());
//		setCreateDate(r.getCreateDate());
//		setCreateName(r.getCreateName());
//		setEndDate(r.getEndDate());
//		setEndDateCdId(r.getEndDateCdId());
//		setEndDateExprInstncId(r.getEndDateExprInstncId());
//		setLegalInd(r.getLegalInd());
//		setRestrictionCdId(r.getRestrictionCdId());
//		setStartDate(r.getStartDate());
//		setStartDateCdId(r.getStartDateCdId());
//		setStartDateExprInstncId(r.getStartDateExprInstncId());
//		setUpdateDate(r.getUpdateDate());
//		setUpdateName(r.getUpdateName());
	}
	
	
	
}
