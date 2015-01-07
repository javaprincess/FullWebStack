package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="REF_DATE_CD")
public class RefDate {

	@Id
	@Column(name="DT_CD_ID")
	private Long refDateId;
	
	@Column(name="DT_CD")
	private String dateCode;
	
	@Column(name="DT_CD_DESC")
	private String dateCodeDescription;
	
	@Column(name="DT_CD_ORDR")
	private Integer dateCodeOrder;

	public Long getRefDateId() {
		return refDateId;
	}

	public void setRefDateId(Long refDateId) {
		this.refDateId = refDateId;
	}

	public String getDateCode() {
		return dateCode;
	}

	public void setDateCode(String dateCode) {
		this.dateCode = dateCode;
	}

	public String getDateCodeDescription() {
		return dateCodeDescription;
	}

	public void setDateCodeDescription(String dateCodeDescription) {
		this.dateCodeDescription = dateCodeDescription;
	}

	public Integer getDateCodeOrder() {
		return dateCodeOrder;
	}

	public void setDateCodeOrder(Integer dateCodeOrder) {
		this.dateCodeOrder = dateCodeOrder;
	}
	
	
	
}
