package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.ErmProductVersionHeader;
import com.fox.it.erm.service.impl.ProductSearchCriterias.ErmProductVersionHeaderSearchCriteria;
import com.google.common.collect.Lists;

public class ProductVersionFinder {
	private static final Logger logger = Logger.getLogger(ProductVersionFinder.class.getName());
	private static final int IN_LIMIT = 1000;
	
	private final EntityManager em;
	
	@Inject
	public ProductVersionFinder(EntityManager em) {
		this.em =em;
	}
	
	
	private Logger getLogger() {
		return logger;
	}
	
	private List<ErmProductVersionHeader> findProductVersionHeaderInBatch(List<Long> foxVersionIds) {
		ErmProductVersionHeaderSearchCriteria searchCriteria = ProductSearchCriterias.getErmProductVersionSearchCriteria(em);
		searchCriteria.setIds(foxVersionIds);
		List<ErmProductVersionHeader> productVersionHeaders = searchCriteria.getResultList();
		getLogger().info("Found " + productVersionHeaders.size() + " product version headers");
		return productVersionHeaders;		
	}			
	
	
	public List<ErmProductVersionHeader> findProductVersionHeader(List<Long> foxVersionIds) {
		getLogger().info("Finding erm product version headers for " + foxVersionIds.size() + " products");
		List<ErmProductVersionHeader> productVersionHeaders = new ArrayList<>(foxVersionIds==null?0:foxVersionIds.size());		
		if (foxVersionIds==null||foxVersionIds.size()==0) return productVersionHeaders;
		if (foxVersionIds.size()<=IN_LIMIT) {
			productVersionHeaders=findProductVersionHeaderInBatch(foxVersionIds);
		} else {
			List<List<Long>> splittedIds = Lists.partition(foxVersionIds, IN_LIMIT);
			for (List<Long> batchIds: splittedIds) {
				productVersionHeaders.addAll(findProductVersionHeaderInBatch(batchIds));
			}
		}						
		getLogger().info("Found " + productVersionHeaders.size() + " product versions");		
		return productVersionHeaders;		
	}
	

}
