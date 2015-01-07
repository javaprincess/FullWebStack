package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.validation.constraints.NotNull;

import com.fox.it.erm.ErmProductVersionHeader;
import com.fox.it.erm.ProductVersionBase;
import com.fox.it.erm.RightsIndicator;

public class RightsIndicatorProcessor {
	private EntityManager em;
	
	
	@Inject
	public RightsIndicatorProcessor(EntityManager em) {
		this.em = em;
	}
	
	
	private List<Long> getFoxVersionsIdsForProductVersions(@NotNull List<? extends ProductVersionBase> productVersions) {
		List<Long> ids = new ArrayList<>(productVersions.size());
		for (ProductVersionBase productVersion: productVersions) { 
			if (productVersion!=null && productVersion.getFoxVersionId()!=null){
				ids.add(productVersion.getFoxVersionId());
			}
		}
		return ids;	
	}
	
	protected void setHasStrandsForProductVersions(List<? extends ProductVersionBase> productVersions,List<ErmProductVersionHeader> ermProductVersionHeaders) {
		if (productVersions==null||productVersions.size()==0) return;
		List<Long> ids = getFoxVersionsIdsForProductVersions(productVersions);
		Map<Long,String> hasStrandsMap = getHasRightStrands(ids,ermProductVersionHeaders);
		for (ProductVersionBase productVersion: productVersions) {
			String hasRightsIndicator = hasStrandsMap.get(productVersion.getFoxVersionId());
			productVersion.setRightsIndicator(hasRightsIndicator);								
		}
		
	}
	
	protected void setHasStrandsForProductVersions(List<? extends ProductVersionBase> productVersions) {
		if (productVersions==null||productVersions.size()==0) return;
		List<Long> ids = getFoxVersionsIdsForProductVersions(productVersions);
		Map<Long,String> hasStrandsMap = getHasRightStrands(ids);
		for (ProductVersionBase productVersion: productVersions) {
			if (productVersion!=null) {
				String hasRightsIndicator = hasStrandsMap.get(productVersion.getFoxVersionId());
				productVersion.setRightsIndicator(hasRightsIndicator);
			}
		}
	}
	
	
	
	public Map<Long,String> getHasRightStrands(List<Long> foxVersionIds,List<ErmProductVersionHeader> productVersionHeaders) {
		Map<Long,String> headerMap = new HashMap<>(foxVersionIds.size());
		for (ErmProductVersionHeader header: productVersionHeaders) {
			headerMap.put(header.getFoxVersionId(), header.getRightsIconType());
		}
		Map<Long,String> map = new HashMap<>(foxVersionIds.size());
		for (Long foxVersionId: foxVersionIds) {
			if (headerMap.containsKey(foxVersionId)) {
				map.put(foxVersionId, headerMap.get(foxVersionId));
			} else {
				map.put(foxVersionId, RightsIndicator.NoRights.getIndicator());
			}
		}
		
		return map;
		
	}
	
	/**
	 * Returns a map of product version ids and a string indicating rights icon type
	 * Possible values are:
	 * R : recorded
	 * I : inherited
	 * N : No rights
	 *  
	 * @return A map containing each id in provided in the foxVersionIds and a String indicating if the product version has rights associated.
	 */
	public Map<Long,String> getHasRightStrands(List<Long> foxVersionIds) {		
		List<ErmProductVersionHeader> productVersionHeaders = findProductVersionHeader(foxVersionIds);
		return getHasRightStrands(foxVersionIds, productVersionHeaders);
	}

	private List<ErmProductVersionHeader> findProductVersionHeader(List<Long> foxVersionIds) {
		ProductVersionFinder productVersionFinder = new ProductVersionFinder(em);
		return productVersionFinder.findProductVersionHeader(foxVersionIds);
	}
	
	
	

}
