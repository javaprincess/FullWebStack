package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@SuppressWarnings("serial")
@Entity
@Table(name="RGHT_GRNT")
public class ErmProductRightGrant extends ErmProductRightStrandBase {

	@Id
	@Column(name="RGHT_GRNT_ID")
	private Long rightGrantId;
	
	@Column(name="GRNT_CD_ID")
	private Long grantCdId;
	


	public Long getRightGrantId() {
		return rightGrantId;
	}

	public void setRightGrantId(Long rightGrantId) {
		this.rightGrantId = rightGrantId;
	}

	public Long getGrantCdId() {
		return grantCdId;
	}

	public void setGrantCdId(Long grantCdId) {
		this.grantCdId = grantCdId;
	}
	


	@Override
	public boolean isNew() {
		return rightGrantId==null;
	}

	/**
	 * Method required because Grant inherits from restriction. 
	 * Always return null 
	 */	
	@Override
	public Long getRestrictionCdId() {
		return null;
	}

	
	@Override
	public void setRestrictionCdId(Long id) {
		throw new UnsupportedOperationException("Restriction code is not supported for grants");
	}
	
	
	
	
}
