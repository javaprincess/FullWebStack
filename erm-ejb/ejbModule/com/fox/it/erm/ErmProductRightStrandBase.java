package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.annotation.JsonIgnore;

@SuppressWarnings("serial")
@MappedSuperclass
public abstract class ErmProductRightStrandBase extends ErmProductRestrictionBase {


	@JsonIgnore
	@ManyToOne(fetch=FetchType.EAGER, optional=false)
	@JoinColumn(name="RGHT_STRND_ID", nullable=false)
	private ErmProductRightStrand ermProductRightStrand;

	@Column(name="RGHT_STRND_ID",updatable=false,insertable=false)
	private Long rightStrandId;
	
	public ErmProductRightStrand getErmProductRightStrand() {
		return ermProductRightStrand;
	}

	public void setErmProductRightStrand(ErmProductRightStrand ermProductRightStrand) {
		this.ermProductRightStrand = ermProductRightStrand;
	}

	public Long getRightStrandId() {
		return rightStrandId;
	}

	public void setRightStrandId(Long rightStrandId) {
		this.rightStrandId = rightStrandId;
	}
	
	
	public boolean isShared() {
		return isBusiness() && isLegal();
	}

	
	
	
}
