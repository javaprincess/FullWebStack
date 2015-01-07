package com.fox.it.erm;

import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.GeneratedValue;
import javax.persistence.Table;
import javax.persistence.Transient;


@SuppressWarnings("serial")
@Entity
@Table(name="PROD_RSTRCN")
public class ErmProductRestriction extends ErmProductFoxVersionBase{

	@Id
	@SequenceGenerator(name = "PROD_RSTRCN_SEQ", sequenceName = "PROD_RSTRCN_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PROD_RSTRCN_SEQ")								
	@Column(name="PROD_RSTRCN_ID")
	private Long productRestrictionId;
	
	@ManyToOne
	@JoinColumn(name="RSTRCN_CD_ID", nullable=false,insertable=false,updatable=false)
	private Restriction restriction;
	
	@Column(name="RSTRCN_CD_ID")
	private Long restrictionCdId;
	
	@Transient
	private boolean hasComments;
	
	@Transient
	private boolean isMappedToClearanceMemo;
	
	
	public Long getProductRestrictionId() {
		return productRestrictionId;
	}

	public void setProductRestrictionId(Long productRestrictionId) {
		this.productRestrictionId = productRestrictionId;
	}

	public Long getRestrictionCdId() {
		return restrictionCdId;
	}

	public void setRestrictionCdId(Long restrictionCdId) {
		this.restrictionCdId = restrictionCdId;
	}
	
	public boolean isNew() {
		return productRestrictionId==null;
	}

	public Restriction getRestriction() {
		return restriction;
	}

	public void setRestriction(Restriction restriction) {
		this.restriction = restriction;
	}
	
	public String getEndDateCode() {
		if (getEndDateCodeId()==null) return null;
		return getEndDateCodeId().getDateCode();
	}
	
	public String getStartDateCode() {
		if (getStartDateCodeId()==null) return null;
		return getStartDateCodeId().getDateCode();
	}
	
	public boolean isHasComments() {
		return hasComments;
	}

	public void setHasComments(boolean hasComments) {
		this.hasComments = hasComments;
	}

	public boolean isMappedToClearanceMemo() {
		return isMappedToClearanceMemo;
	}

	public void setMappedToClearanceMemo(boolean isMappedToClearanceMemo) {
		this.isMappedToClearanceMemo = isMappedToClearanceMemo;
	}

	/**
	 * 
	 * @param restriction
	 */
	public void copyForUpdate(ErmProductRestriction restriction){
		this.setEndDate(restriction.getEndDate());
		this.setEndDateCdId(restriction.getRestrictionCdId());
		this.setEndDateExprInstncId(restriction.getEndDateExprInstncId());
		this.setRestrictionCdId(restriction.getRestrictionCdId());
		this.setStartDate(restriction.getStartDate());
		this.setStartDateCdId(restriction.getStartDateCdId());
		this.setStartDateExprInstncId(restriction.getStartDateExprInstncId());
		this.setUpdateDate(Calendar.getInstance().getTime());
	}
	
}
