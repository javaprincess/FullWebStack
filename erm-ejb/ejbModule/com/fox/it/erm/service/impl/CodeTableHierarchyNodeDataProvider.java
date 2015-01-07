package com.fox.it.erm.service.impl;

import com.fox.it.erm.CodeTableValue;
import com.fox.it.erm.service.HierarchyNodeDataProvider;

public class CodeTableHierarchyNodeDataProvider implements
		HierarchyNodeDataProvider<CodeTableValue> {

	@Override
	public Long getId(CodeTableValue element) {
		return element.getId();
	}

	@Override
	public String getText(CodeTableValue element) {
		return element.getName();
	}

}
