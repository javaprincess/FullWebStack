package com.fox.it.erm.util;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Collections;

public class ErmNodeAlt implements Comparable<ErmNodeAlt>{

	private Long id;
	private String text;
	private Boolean expanded;
	private List<ErmNodeAlt> items;
	private ErmNodeAlt parent;
	private boolean isSorted=false;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	
	public void setParent(ErmNodeAlt parent) {
		this.parent = parent;
	}

	public void add(ErmNodeAlt element) {
		if (items==null) {
			items= new ArrayList<>();
		}
		items.add(element);
		isSorted=false;
	}
	
	public List<ErmNodeAlt> getItems() {
		if (items==null) {
			items= new ArrayList<>();
		}
		if (!isSorted) {
			isSorted=true;
			Collections.sort(items);
		}
		return items;
	}
	
	public void setItems(List<ErmNodeAlt> items) {
		this.items = items;
	}
	
	
	public Boolean getExpanded() {
		return expanded;
	}
	public void setExpanded(Boolean expanded) {
		this.expanded = expanded;
	}
	@Override
	public int compareTo(ErmNodeAlt o) {
		Long id = getId();
		if (this==o) return 0;
		if (o==null) return -1;
		if(o != null && o.getText() != null && this.text != null){
			int textCompare = this.text.compareTo(o.getText());
			if (textCompare==0) {
				int idCompare = id.compareTo(o.getId()); 
				return 	idCompare;		
			}
			return textCompare;
		}
		if (id==null) return -1;
		if (o.getId()==null) return 1;
		return id.compareTo(o.getId());
	}
	
	/**
	 * Returns true if it doesn't have a parent
	 * @return
	 */
	@JsonIgnore
	public boolean isRoot() {
		return this.parent==null;
	}
	
	public String toString() {
		return "id: " + id + " text: " + text;
	}
	
	public void walk(Visitor<ErmNodeAlt> visitor) {
		visitor.visit(this);
		for (ErmNodeAlt node: getItems()) {
			node.walk(visitor);
		}
	}
	
	
	
	
}
