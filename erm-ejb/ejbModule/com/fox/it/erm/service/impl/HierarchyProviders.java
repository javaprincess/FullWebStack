package com.fox.it.erm.service.impl;

import com.fox.it.erm.Hierarchy;
import com.fox.it.erm.service.HierarchyProvider;

public class HierarchyProviders {
	public static class GenericHierarchyProvider implements HierarchyProvider<Hierarchy> {

		@Override
		public Long getParentId(Hierarchy hierarchy) {
			return hierarchy.getParentId();
		}

		@Override
		public Long getChildId(Hierarchy hierarchy) {
			return hierarchy.getChildId();
		}
		
	}
	
	public static final GenericHierarchyProvider getGenericHierarchyProvider() {
		return new GenericHierarchyProvider();
	}

}
