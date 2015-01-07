package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@SuppressWarnings("serial")
@Entity
@Table(name="PROD_GRNT")
public class ErmProductGrant extends ErmProductFoxVersionBase {

	@Id
	@Column(name="PROD_GRNT_ID")
	private Long productGrantId;
	
	public Long getProductGrantId() {
		return productGrantId;
	}

	public void setProductGrantId(Long productGrantId) {
		this.productGrantId = productGrantId;
	}

	@Override
	public boolean isNew() {
		return productGrantId==null;
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
