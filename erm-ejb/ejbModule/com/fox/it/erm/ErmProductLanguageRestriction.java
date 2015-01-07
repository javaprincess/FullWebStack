package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@SuppressWarnings("serial")
@Entity
@Table(name="PROD_LNGG_RSTRCN")
public class ErmProductLanguageRestriction extends ErmProductFoxVersionBase {

	@Id
	@Column(name="PROD_LNGG_RSTRCN_ID")
	private Long productLanguageRestrictionId;
	
	@Column(name="LNGG_ID")
	private Long languageId;
	
	@Column(name="RSTRCN_CD_ID")
	protected Long restrictionCdId;

	
	public Long getProductLanguageRestrictionId() {
		return productLanguageRestrictionId;
	}

	public void setProductLanguageRestrictionId(Long productLanguageRestrictionId) {
		this.productLanguageRestrictionId = productLanguageRestrictionId;
	}

	public Long getLanguageId() {
		return languageId;
	}

	public void setLanguageId(Long languageId) {
		this.languageId = languageId;
	}

	public Long getRestrictionCdId() {
		return restrictionCdId;
	}

	public void setRestrictionCdId(Long restrictionCdId) {
		this.restrictionCdId = restrictionCdId;
	}
	
	@Override
	public boolean isNew() {
		return productLanguageRestrictionId==null;
	}
	
	
	
}
