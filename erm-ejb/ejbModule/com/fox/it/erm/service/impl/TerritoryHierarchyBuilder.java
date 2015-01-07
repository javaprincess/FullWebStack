package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fox.it.erm.Territory;
import com.fox.it.erm.TerritoryHierarchy;
import com.fox.it.erm.util.ErmNode;
import com.fox.it.erm.util.ErmNodeAlt;

public class TerritoryHierarchyBuilder {
	private final List<Territory> territories;
	private final List<TerritoryHierarchy> territoryHierarchy;
	private final Map<Long,Territory> territoryMap;
	private final Map<Long,ErmNode<Territory>> territoryNodeMap;
	private final Map<Long,ErmNodeAlt> territoryNodeMapAlt;
	
	
	public TerritoryHierarchyBuilder(List<Territory> territories,List<TerritoryHierarchy> hierarchy) {
		this.territories = territories;
		this.territoryHierarchy = hierarchy;
		this.territoryMap = toMap(this.territories);
		this.territoryNodeMap = new HashMap<>(territories.size());
		this.territoryNodeMapAlt = new HashMap<>(territories.size());
	}
	
	
	private Map<Long,Territory> toMap(List<Territory> territories) {
		Map<Long,Territory> map = new HashMap<>();
		for (Territory territory:territories) {
			map.put(territory.getId(), territory);
		}
		return map;
	}
	
	private ErmNode<Territory> getNode(Long id) {
		ErmNode<Territory> node = null;
		if (territoryNodeMap.containsKey(id)) {
			node = territoryNodeMap.get(id);
		} else {
			node = new ErmNode<Territory>();
			node.setData(getTerritory(id));
			territoryNodeMap.put(id, node);
		}
		return node;
	}

	private ErmNodeAlt getNodeAlt(Long id) {
		ErmNodeAlt node = null;
		if (territoryNodeMapAlt.containsKey(id)) {
			node = territoryNodeMapAlt.get(id);
		} else {
			node = new ErmNodeAlt();
			Territory territory = getTerritory(id);
			if (territory!=null) {
				node.setExpanded(true);
				node.setText(getText(territory));
				node.setId(getId(territory));
				territoryNodeMapAlt.put(id, node);
			}	
		}
		return node;
	}
	
	private String getText(Territory t) {
		return t.getName();
	}
	
	private Long getId(Territory t) {
		return t.getId();
	}
	
	
	
	private Territory getTerritory(Long id) {
		return territoryMap.get(id);
	}

	private void buildAlt() {
		for (TerritoryHierarchy th:territoryHierarchy) {
			Long parentId = th.getParentTerritoryId();
			Long childId = th.getChildTerritoryId();
			ErmNodeAlt parentNode = getNodeAlt(parentId);
			ErmNodeAlt childNode = getNodeAlt(childId);
			if (parentNode!=null&&childNode!=null) {
				parentNode.add(childNode);
				childNode.setParent(parentNode);
			}
		}
	}
	
	
	private void build() {
		for (TerritoryHierarchy th:territoryHierarchy) {
			Long parentId = th.getParentTerritoryId();
			Long childId = th.getChildTerritoryId();
			ErmNode<Territory> parentNode = getNode(parentId);
			ErmNode<Territory> childNode = getNode(childId);
			parentNode.getChildren().add(childNode);
			childNode.setParent(parentNode);
		}
	}
	
	public ErmNode<Territory> get() {
		build();
		//now iterate through the nodes and find the root node that is active
		for(ErmNode<Territory> node: territoryNodeMap.values()) {
			if (node.isRoot()&&node.getData().isActive()) {
				return node;
			}
		}
		return null;
	}
	
	public List<ErmNodeAlt> getAlt() {
		buildAlt();
		List<ErmNodeAlt> root= new ArrayList<>();
		//now iterate through the nodes and find the root node that is active
		for(ErmNodeAlt node: territoryNodeMapAlt.values()) {
			if (node.isRoot()) {
				root.add(node);
			}
		}
		return root;
		
	}

}
