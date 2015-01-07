package com.fox.it.erm;

import java.util.List;

import java.util.ArrayList;


import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.eclipse.persistence.annotations.BatchFetch;
import org.eclipse.persistence.annotations.BatchFetchType;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="TRRTRY_GRP")
public class TerritoryGroup {
	@Id
	@SequenceGenerator(name = "TRRTRY_GRP_SEQ", sequenceName = "TRRTRY_GRP_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "TRRTRY_GRP_SEQ")							
	@Column(name="TRRTRY_GRP_ID")
	private Long id;
	@Column(name="TRRTRY_GRP_NM")
	private String name;
	@Column(name="OWNER_ID")
	private String ownerId;

	@OneToMany(cascade={CascadeType.ALL})
	@JoinColumn(name="TRRTRY_GRP_ID")
	@BatchFetch(value=BatchFetchType.JOIN)
	private List<TerritoryGroupTerritoryIds> territoryIds;
	
	@Transient
	private List<Long> terrIds;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getOwnerId() {
		return ownerId;
	}
	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}
	@JsonIgnore
	public List<TerritoryGroupTerritoryIds> getTerritoryGroupTerritories() {
		if (territoryIds==null) {
			territoryIds = new ArrayList<>();
		}
		return territoryIds;
	}
	
	
	public List<Long> getTerritoryIds() {
		List<TerritoryGroupTerritoryIds> territoryGroupTerritories = getTerritoryGroupTerritories();
		List<Long> ids = new ArrayList<Long>();
		for (TerritoryGroupTerritoryIds territoryGroupTerritory: territoryGroupTerritories) {
			ids.add(territoryGroupTerritory.getTerritoryId());
		}
		return ids;
	}
	
	public void setTerritoryIds(List<TerritoryGroupTerritoryIds> territoryIds) {
		this.territoryIds = territoryIds;
	}
	
	public void setTerritoryIdsFromIdsList(List<Long> territoryIds) {
		if (territoryIds==null) return;
		List<TerritoryGroupTerritoryIds> groupMemebership = new ArrayList<>();
		for (Long territoryId: territoryIds) {
			TerritoryGroupTerritoryIds tg = new TerritoryGroupTerritoryIds(getId(), territoryId);
			groupMemebership.add(tg);
		}
		setTerritoryIds(groupMemebership);
	}
	public List<Long> getTerrIds() {
		return terrIds;
	}
	public void setTerrIds(List<Long> terrIds) {
		this.terrIds = terrIds;
	}
	
	
}
