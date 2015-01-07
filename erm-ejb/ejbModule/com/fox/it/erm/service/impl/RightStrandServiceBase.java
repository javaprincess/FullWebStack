package com.fox.it.erm.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmProductRightStrand;

public class RightStrandServiceBase extends ServiceBase {

	private static final Logger logger = Logger.getLogger(RightStrandServiceBase.class.getName());
	
	public RightStrandServiceBase() {

	}


	private Logger getLogger() {
		return logger;
	}
	
	public List<ErmProductRightStrand> findByIds(List<Long> ids) {
		//TODO this if the ids are larger than 1000 this will fail. Fix this
		RightStrandSQLFinder rightStrandFinder = new RightStrandSQLFinder(getEntityManager());
		List<ErmProductRightStrand> strands = rightStrandFinder.findByIds(ids);
		return strands;
	}
	
	protected RightStrandSQLFinder getFinder() {
		return new RightStrandSQLFinder(getEntityManager());
	}
	



	public List<ErmProductRightRestriction> findRestrictionsByIds(List<Long> ids) {	
		RightStrandSQLFinder rightStrandFinder = getFinder();
		return rightStrandFinder.findRestrictionsByIds(ids);
	}


	public List<ErmProductRightStrand> loadRightStrands(Long foxVersionId) {
		long t0 = System.currentTimeMillis();
		getLogger().info("Getting right strands for " + foxVersionId);
		RightStrandSQLFinder rightStrandFinder = getFinder();
		List<ErmProductRightStrand> rightList = rightStrandFinder.findByProductVersionId(foxVersionId);
		long t1 = System.currentTimeMillis();
		getLogger().info("Done getting " + rightList.size() + " right strands for " + foxVersionId  + " in " + (t1 - t0));		
		if(rightList != null && !rightList.isEmpty()){
			Collections.sort(rightList);
		}
		return rightList;				
	}
	
	

}
