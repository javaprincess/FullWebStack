package com.fox.it.erm.service;

public interface HierarchyProvider<H> {
	public Long getParentId(H hierarchy);
	public Long getChildId(H hierarchy);
}
