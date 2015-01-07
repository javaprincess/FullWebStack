package com.fox.it.erm.service.impl;

import java.util.Date;
import java.util.List;

import com.fox.it.erm.CodeTableValue;
import com.fox.it.erm.Hierarchy;
import com.fox.it.erm.util.ErmNodeAlt;

public abstract class MTLService<T extends CodeTableValue,H extends Hierarchy> extends ServiceBase {

	private List<ErmNodeAlt> tree;
	private Date cacheTimestamp;
	
	protected List<ErmNodeAlt> constructTreeAlt(List<T> elements,List<H> hierarchy) {
		HierarchyBuilder<CodeTableValue,Hierarchy> hierarchyBuilder = new HierarchyBuilder<CodeTableValue,Hierarchy>(elements, hierarchy,new CodeTableHierarchyNodeDataProvider(), HierarchyProviders.getGenericHierarchyProvider());
		List<ErmNodeAlt> root = hierarchyBuilder.getAlt();
		
		return root;		
	}
	
	protected List<ErmNodeAlt> constructTreeAlt() {
		List<T> elements = getElements();
		List<H> hierarchy = getHierarchy();
		return constructTreeAlt(elements, hierarchy);		
	}
	
	public List<ErmNodeAlt> getTree() {
		if (shouldReloadTree()) {
			Date date = new Date();
			tree = constructTreeAlt();
			cacheTimestamp = date;
		}
		return tree;
		
	}
	
	protected boolean shouldReloadTree() {
		if (tree==null||cacheTimestamp==null) return true;
		Date lastChangeTimestamp = getLastChangeInTreeTimestamp();
		if (cacheTimestamp.compareTo(lastChangeTimestamp)<=0) {
			return true;
		}
		return false;
	}
	
	public Date getLastChangeInTreeTimestamp() {
		Date elementsTimestamp = getLastModifiedTimestamp();
		Date hierarchyTimestamp = getHierarchyLastModifiedTimestamp();
		if (elementsTimestamp==null) return hierarchyTimestamp;
		return elementsTimestamp.compareTo(hierarchyTimestamp)<=0?hierarchyTimestamp:elementsTimestamp;
	}
	
	public abstract Date getLastModifiedTimestamp();
	
	public abstract Date getHierarchyLastModifiedTimestamp();
	
	
	public abstract List<T> getElements();
	
	public abstract List<H> getHierarchy();
}
