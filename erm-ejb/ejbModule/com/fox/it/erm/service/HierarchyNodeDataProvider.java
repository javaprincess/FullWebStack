package com.fox.it.erm.service;

public interface HierarchyNodeDataProvider<T> {

	public Long getId(T element);
	public String getText(T element);
}
