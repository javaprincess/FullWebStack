package com.fox.it.erm.service;

import java.util.Date;
import java.util.List;

import javax.ejb.Local;

import com.fox.it.erm.Territory;
import com.fox.it.erm.util.ErmNode;
import com.fox.it.erm.util.ErmNodeAlt;

@Local
public interface TerritoryService {
	List<Territory> get();
	List<Territory> findAll();
	
	List<Territory> findAllIncludeInactive();
	
	Territory save(Territory territory);
	
	ErmNode<Territory> loadTerritoryTree();
	
	ErmNode<Territory> getTerritoryTree();
	
	List<ErmNodeAlt> getTree();
	
	List<ErmNodeAlt> getTerritoryTreeAlt();
	
	List<ErmNodeAlt> loadTerritoryTreeAlt();
	
	List<Long> getInactiveToActiveTerritoriesMapping(Long id,boolean isBusiness);
	
	Date getLastChangeInTreeTimestamp();
	
}
