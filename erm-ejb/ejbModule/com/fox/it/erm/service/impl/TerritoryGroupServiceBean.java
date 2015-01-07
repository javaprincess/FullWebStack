package com.fox.it.erm.service.impl;

import java.util.List;

import javax.ejb.Local;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.TerritoryGroup;
import com.fox.it.erm.service.TerritoryGroupService;

@Stateless
@Local({TerritoryGroupService.class})
public class TerritoryGroupServiceBean implements TerritoryGroupService {

	@Inject
	private EntityManager em;
	
	private JsonToTerritoryGroupConverter jsonToTerritoryGroupConverter = new JsonToTerritoryGroupConverter(new JacksonJsonService()); 
	
	
	
	
	@Override
	public List<TerritoryGroup> findByOwner(String userId) {
		TerritoryGroupSearchCriteria criteria = new TerritoryGroupSearchCriteria(em);
		criteria.setOwnerId(userId);
		return criteria.getResultList();
	}
	
	@Override
	public TerritoryGroup save(TerritoryGroup territoryGroup) {
		TerritoryGroup merged = em.merge(territoryGroup);
		return merged;
	}

	@Override
	public TerritoryGroup findById(Long id) {
		return em.find(TerritoryGroup.class, id);
	}

	@Override
	public TerritoryGroup save(String json) {
		TerritoryGroup territoryGroup = jsonToTerritoryGroupConverter.convert(json);
		territoryGroup = save(territoryGroup);
		return territoryGroup;
	}
	
	/**
	 * Load all the territory groups and return them as a array
	 */
	@Override
	public Object loadAllTerritoryGroups(){
		TerritoryGroupSearchCriteria criteria = new TerritoryGroupSearchCriteria(em);
		criteria.addSort("name");
		
		return criteria.getResultList().toArray();
	}
	
}
