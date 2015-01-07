package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name="TRRTRY_GRP_TRRTRY")
public class TerritoryGroupTerritoryIds {
	@Id
	@SequenceGenerator(name = "TRRTRY_GRP_TRRTRY_SEQ", sequenceName = "TRRTRY_GRP_TRRTRY_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "TRRTRY_GRP_TRRTRY_SEQ")								
	@Column(name="TRRTRY_GRP_TRRTRY_ID")
	private Long id;
	
	@Column(name="TRRTRY_GRP_ID")
	private Long territoryGroupId;
	
	@Column(name="TRRTRY_ID")
	private Long territoryId;

	public TerritoryGroupTerritoryIds() {
		
	}
	
	
	public TerritoryGroupTerritoryIds(Long territoryGroupId, Long territoryId) {
		this.territoryGroupId = territoryGroupId;
		this.territoryId = territoryId;
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getTerritoryGroupId() {
		return territoryGroupId;
	}

	public void setTerritoryGroupId(Long territoryGroupId) {
		this.territoryGroupId = territoryGroupId;
	}

	public Long getTerritoryId() {
		return territoryId;
	}

	public void setTerritoryId(Long territoryId) {
		this.territoryId = territoryId;
	}
	
	
	
	
	
	
}
