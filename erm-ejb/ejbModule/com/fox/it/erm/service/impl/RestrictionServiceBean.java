package com.fox.it.erm.service.impl;

import java.util.Date;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.Restriction;
import com.fox.it.erm.RestrictionSearchCriteria;
import com.fox.it.erm.service.RestrictionService;

@Stateless
public class RestrictionServiceBean extends ServiceBase implements RestrictionService {
	private static final String RESTRICTION_TABLE_NAME="RSTRCN_CODE";
	private List<Restriction> sortedByCode;
	private Date cacheTimestamp;	
	
	@Inject
	private EntityManager em;
	
	private RestrictionSearchCriteria getCriteria(){
		return new RestrictionSearchCriteria(em);
	}
	
	@Override
	public List<Restriction> findAll() {
		RestrictionSearchCriteria criteria=getCriteria();
		return criteria.getResultList();
	}

	@Override
	public List<Restriction> findByTypeId(Integer typeId) {
		RestrictionSearchCriteria criteria=getCriteria();
		criteria.setTypeId(typeId);
		return criteria.getResultList();
	}

	@Override
	public Restriction findById(Integer id) {
		return em.find(Restriction.class, id);
	}
	
	private boolean shouldReload() {
		if (sortedByCode==null||sortedByCode.isEmpty()||cacheTimestamp==null) return true;
		Date lastChangeTimestamp = getLastModified(RESTRICTION_TABLE_NAME);
		if (cacheTimestamp.compareTo(lastChangeTimestamp)<=0) {
			return true;
		}
		return false;		
	}
	
	
	private List<Restriction> loadAllSortedByCode() {
		if (shouldReload()) {
			RestrictionSearchCriteria criteria=getCriteria();
			criteria.addSort("code");
			cacheTimestamp = new Date();
			sortedByCode =  criteria.getResultList();		
		}
		return sortedByCode;
			
	}
	
	@Override
	public List<Restriction> findAllSortedByCode(){
		return loadAllSortedByCode();
	}
	
	@Override
	public Date getLastModifiedTimestamp() {
		return getLastModified("RSTRCN_CODE");
	}


}
