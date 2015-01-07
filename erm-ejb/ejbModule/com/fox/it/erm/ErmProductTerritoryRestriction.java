package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@SuppressWarnings("serial")
@Entity
@Table(name="PROD_TRRTRY_RSTRCN")
public class ErmProductTerritoryRestriction extends ErmProductFoxVersionBase{

	@Id
	@Column(name="PROD_TRRTRY_RSTRCN_ID")
	private Long productTerritoryRestrictionId;
	
	@Column(name="TRRTRY_ID")
	private Long territoryId;
	
	@Column(name="RSTRCN_CD_ID")
	private Long restrictionCdId;
	
	public Long getProductTerritoryRestrictionId() {
		return productTerritoryRestrictionId;
	}

	public void setProductTerritoryRestrictionId(Long productTerritoryRestrictionId) {
		this.productTerritoryRestrictionId = productTerritoryRestrictionId;
	}

	public Long getTerritoryId() {
		return territoryId;
	}

	public void setTerritoryId(Long territoryId) {
		this.territoryId = territoryId;
	}

	public Long getRestrictionCdId() {
		return restrictionCdId;
	}

	public void setRestrictionCdId(Long restrictionCdId) {
		this.restrictionCdId = restrictionCdId;
	}
	
	public boolean isNew() {
		return productTerritoryRestrictionId==null;
	}

	
	
}
