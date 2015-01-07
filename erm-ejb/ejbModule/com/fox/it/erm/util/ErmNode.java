package com.fox.it.erm.util;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class ErmNode<T> {

	private T data;
	private List<ErmNode<T>> children;
	private ErmNode<T> parent;
	
	
	public T getData() {
		return data;
	}
	public void setData(T data) {
		this.data = data;
	}
	
	public void setParent(ErmNode<T> parent) {
		this.parent = parent;
	}
	
	
	public List<ErmNode<T>> getChildren() {
		if (children==null) {
			children = new ArrayList<>();
		}
		return children;
	}
	
	
	public void setChildren(List<ErmNode<T>> children) {
		this.children = children;
	}
	
	public ErmNode<T> findDescendant(T element) {
		if (data.equals(element)) {
			return this;
		}
		if (children==null||children.size()==0) return null;		
		for (ErmNode<T> child:children) {
			ErmNode<T> node = child.findDescendant(element);
			if (node!=null) {
				return node;
			}
		}		
		return null;		
		
	}
	
	/**
	 * Determines if the element is a descendant of this node, or is this node <br>
	 * Traverses the children and its descendant and checks if the element is contained in any of the nodes
	 * 
	 * @param node
	 * @return
	 */
	@JsonIgnore
	public boolean isDescendant(T element) {
		ErmNode<T> descendant = findDescendant(element);
		return descendant!=null;
	}
	
	/**
	 * Returns true if it doesn't have a parent
	 * @return
	 */
	@JsonIgnore
	public boolean isRoot() {
		return this.parent==null;
	}
	
}
