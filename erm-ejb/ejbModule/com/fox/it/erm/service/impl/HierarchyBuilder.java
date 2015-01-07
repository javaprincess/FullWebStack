package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fox.it.erm.service.HierarchyNodeDataProvider;
import com.fox.it.erm.service.HierarchyProvider;
import com.fox.it.erm.util.ErmNodeAlt;

public class HierarchyBuilder<T,H>{
	private final List<? extends T> elements;
	private final List<? extends H> hierarchy;
	private final HierarchyNodeDataProvider<T> dataProvider;
	private final HierarchyProvider<H> hierarchyProvider;
	
	
	private final Map<Long,? extends T> elementMap;
	private final Map<Long,ErmNodeAlt> elementNodeMapAlt;
	
	
	public HierarchyBuilder(List<? extends T> elements,List<? extends H> hierarchy,HierarchyNodeDataProvider<T> dataProvider,HierarchyProvider<H> hierarchyProvider) {
		this.elements=elements;
		this.hierarchy=hierarchy;
		this.dataProvider=dataProvider;
		this.hierarchyProvider=hierarchyProvider;
		
		this.elementMap = toMap(elements);
		this.elementNodeMapAlt = new HashMap<>(elements.size());
	
	}
	
	private Map<Long,? extends T> toMap(List<? extends T> territories) {
		Map<Long,T> map = new HashMap<>();
		for (T element:elements) {
			map.put(dataProvider.getId(element), element);
		}
		return map;
	}
	
	private T getElement(Long id) {
		return elementMap.get(id);
	}
	
	
	private ErmNodeAlt getNodeAlt(Long id) {
		ErmNodeAlt node = null;
		if (elementNodeMapAlt.containsKey(id)) {
			node = elementNodeMapAlt.get(id);
		} else {
			node = new ErmNodeAlt();
			T element = getElement(id);
			if (element!=null) {
				node.setExpanded(true);
				node.setText(dataProvider.getText(element));
				node.setId(dataProvider.getId(element));
				elementNodeMapAlt.put(id, node);
			}	
		}
		return node;
	}

	
	private void build() {
			for (H h:hierarchy) {
				Long parentId = hierarchyProvider.getParentId(h);
				Long childId = hierarchyProvider.getChildId(h);
				ErmNodeAlt parentNode = getNodeAlt(parentId);
				ErmNodeAlt childNode = getNodeAlt(childId);
				if (parentNode!=null&&childNode!=null) {
					parentNode.add(childNode);
					childNode.setParent(parentNode);
				}
			}

	}
	
	public List<ErmNodeAlt> getAlt() {
		build();
		List<ErmNodeAlt> root= new ArrayList<>();
		//now iterate through the nodes and find the root node that is active
		for(ErmNodeAlt node: elementNodeMapAlt.values()) {
			if (node.isRoot()) {
				root.add(node);
			}
		}
		return root;
		
	}
	
}
