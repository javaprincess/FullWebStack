package com.fox.it.erm.copy.factory.products;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import com.fox.it.erm.copy.factory.EmptyProductProviderBase;


public class EmptyInfoCodesProvider extends EmptyProductProviderBase {//implements EmptyProductProvider {

	private static final String sqlBase = "Select fox_version_id from prod_rstrcn where fox_version_id in ";

	
	public EmptyInfoCodesProvider() {
	}
	
	@Inject
	public EmptyInfoCodesProvider(EntityManager em) {
		super(em);
	}
	
	@Override
	public Map<Long, Boolean> getEmpty(List<Long> foxVersionIds,boolean isBusiness){
		List<Long> ids = getFoxVersionIds(foxVersionIds, isBusiness,sqlBase);
		return toMap(foxVersionIds,ids);
	}



}
