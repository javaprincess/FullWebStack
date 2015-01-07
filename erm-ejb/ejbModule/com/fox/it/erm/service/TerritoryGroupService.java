package com.fox.it.erm.service;

import java.util.List;

import javax.ejb.Local;

import com.fox.it.erm.TerritoryGroup;

@Local
public interface TerritoryGroupService {
	
	public TerritoryGroup findById(Long id);
	public List<TerritoryGroup> findByOwner(String userId);
	public TerritoryGroup save(TerritoryGroup territoryGroup);
	public TerritoryGroup save(String json);	
	public Object loadAllTerritoryGroups();

}
