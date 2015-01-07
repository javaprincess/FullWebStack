package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.fox.it.erm.Territory;
import com.fox.it.erm.TerritoryHierarchy;
import com.fox.it.erm.service.TerritoryService;
import com.fox.it.erm.util.ErmNode;
import com.fox.it.erm.util.ErmNodeAlt;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;

@Stateless
public class TerritoryServiceBean extends MTLService<Territory,TerritoryHierarchy> implements TerritoryService {
	private static final Logger logger = Logger.getLogger(TerritoryServiceBean.class.getName());
	
	private static final String INACTIVE_TERRITORIES_BUSINESS_SQL =  "select distinct t.* from (select level lvl, a.* from (select * from trrtry_hier_rts) a connect by prior  chld_trrtry_id=prnt_trrtry_id start with prnt_trrtry_id=?), trrtry t " + 
	                												 "where chld_trrtry_id=trrtry_id and t.actv_flg='Y' " +
	                												 "and prnt_trrtry_id not in (select prnt_trrtry_id from trrtry_hier where actv_flg='Y') ";
	
	private static final String INACTIVE_TERRITORIES_LEGAL_SQL =  "select distinct t.* from (select level lvl, a.* from (select * from trrtry_hier_lrdb) a connect by prior  chld_trrtry_id=prnt_trrtry_id start with prnt_trrtry_id=?), trrtry t " +
	                											  "where chld_trrtry_id=trrtry_id and t.actv_flg='Y' " +
	                											  "and prnt_trrtry_id not in (select prnt_trrtry_id from trrtry_hier where actv_flg='Y')";


	
	@Inject 
	private EntityManager em;
	
	@Override
	protected EntityManager getEntityManager() {
		return em;
	}
	
	@Override
	public List<Territory> get() {
		return findAll();
	}

	@Override
	public List<Territory> findAll() {
		return MTLCriterias.getTerritorySearchCriteria(em).setActive().getResultList();
	}
	
	@Override
	public List<Territory> findAllIncludeInactive() {
		return MTLCriterias.getTerritorySearchCriteria(em).getResultList();		
	}
	
	private List<TerritoryHierarchy> findAllTerritoryHierarchy() {
		return MTLCriterias.getTerritoryHierarchySearchCriteria(em).setActive().getResultList();
	}
	
	/**
	 * Saves the territory
	 */
	@Override
	public Territory save(Territory territory) {
		if (territory.getId()==null) {
			em.persist(territory);
		} else {
			territory = em.merge(territory);
		}
		return territory;
	}

	
	/**
	 * Constructs the territory tree, fetches all the territories and the territory hierarchy in memory
	 * and then constructs the tree by looking for the root node and attaching its descendants
	 * @return
	 */
	private ErmNode<Territory> constructTree() {
		List<Territory> allTerritories = get();
		List<TerritoryHierarchy> hierarchy = findAllTerritoryHierarchy();
		TerritoryHierarchyBuilder hierarchyBuilder = new TerritoryHierarchyBuilder(allTerritories, hierarchy);
		ErmNode<Territory> root = hierarchyBuilder.get();
		return root;
	}
	
	
//	private List<ErmNodeAlt> constructTreeAlt() {
//		List<Territory> allTerritories = get();
//		List<TerritoryHierarchy> hierarchy = findAllTerritoryHierarchy();
//		return constructTreeAlt(allTerritories,hierarchy);
//	}
	
	/**
	 * 
	 * @param territoryId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private ErmNode<Territory> loadAllTerritories(Long territoryId){
		
		ErmNode<Territory> ermm = new ErmNode<Territory>();
		logger.log(Level.INFO,"ROOT TERRITORY ID : "+territoryId);
		String sqlString = " select t from Territory t where t.id = "+territoryId;
		Query query = em.createQuery(sqlString);
		List<Territory> territory = query.getResultList();
		
		if(territory == null || territory.isEmpty() || territory.get(0).getActiveFlag().equalsIgnoreCase("N")){
			return null;
		}
		ermm.setData(territory.get(0));
		
		String childrenTerritorySql = " select distinct t.childTerritoryId from TerritoryHierarchy t where t.parentTerritoryId = "+territoryId;
		query = em.createQuery(childrenTerritorySql);
		List<Long> list = query.getResultList();
		if(list != null && !list.isEmpty()){
			List<ErmNode<Territory>> territoryList = new ArrayList<ErmNode<Territory>>();
			for(Long l : list){
				try {
					ErmNode<Territory> nodeTerritory = loadAllTerritories(l);
					if(nodeTerritory != null){
						territoryList.add(nodeTerritory);
					}
				}
				catch(Exception ex){
					
				}
			}
			if(!territoryList.isEmpty()){
				ermm.setChildren(territoryList);
			}
		}
		
		return ermm;
	}
	
	
	
	/**
	 * This should not be used
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public ErmNode<Territory> loadTerritoryTreeOrig(){
		
		ErmNode<Territory> rootNode = null;
		String rootTerritorySql = " select distinct t.parentTerritoryId from TerritoryHierarchy t where t.parentTerritoryId not in (select distinct mm.childTerritoryId from TerritoryHierarchy mm)";
		Query query = em.createQuery(rootTerritorySql);
		List<Long> list = query.getResultList();
		if(list != null && !list.isEmpty()){
			Long rootTerritoryId = list.get(0);
			rootNode = loadAllTerritories(rootTerritoryId);
		}
		else {
			logger.log(Level.INFO,"UNABLE TO RETRIEVE ANY ROOT TERRITORY ID ");
		}
		return rootNode;
	}

	@Override
	public ErmNode<Territory> getTerritoryTree() {
		return constructTree();
	}

	@Override
	public ErmNode<Territory> loadTerritoryTree() {
		return constructTree();
	}
	
	@Override
	public List<ErmNodeAlt> getTerritoryTreeAlt() {
		return loadTerritoryTreeAlt();
	}
	
	@Override
	public List<ErmNodeAlt> loadTerritoryTreeAlt() {
		return constructTreeAlt();
	}

	@Override
	public Date getLastModifiedTimestamp() {
		return getLastModified("trrtry");
	}

	@Override
	public Date getHierarchyLastModifiedTimestamp() {
		return getLastModified("TRRTRY_HIER");
	}

	@Override
	public List<Territory> getElements() {
		return get();
	}

	@Override
	public List<TerritoryHierarchy> getHierarchy() {
		return findAllTerritoryHierarchy();
	}
	
	@Override
	public List<Long> getInactiveToActiveTerritoriesMapping(Long id,boolean isBusiness) {	
		String sql = INACTIVE_TERRITORIES_BUSINESS_SQL;
		if (!isBusiness) {
			sql = INACTIVE_TERRITORIES_LEGAL_SQL;
		}
		Query query = em.createNativeQuery(sql,Territory.class);
		query.setParameter(1, id);
		@SuppressWarnings("unchecked")
		List<Territory> territories = query.getResultList();
		List<Long> ids = IdsAccumulator.getIds(territories, new IdProvider<Territory>(){

			@Override
			public Long getId(Territory o) {
				return o.getId();
			}
			
		});
		return ids;
	}
	
	
	

}
