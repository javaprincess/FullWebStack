package com.fox.it.erm.copy.factory.products;

import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import com.fox.it.erm.copy.factory.EmptyCommentsProviderBase;

public class EmptyClearanceMemoProvider extends EmptyCommentsProviderBase  {

	public EmptyClearanceMemoProvider() {
	}
	
	public EmptyClearanceMemoProvider(EntityManager em) {
		super(em);
	}
	
	@Override
	public Map<Long, Boolean> getEmpty(List<Long> foxVersionIds,
			boolean isBusiness) {
		List<Long> ids = getFoxVersionIdsForCM(foxVersionIds);
		return toMap(foxVersionIds,ids);		
	}
	

}
