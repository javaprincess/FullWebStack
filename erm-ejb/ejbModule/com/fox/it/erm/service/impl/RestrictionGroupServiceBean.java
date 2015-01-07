package com.fox.it.erm.service.impl;

import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.RestrictionGroup;
import com.fox.it.erm.RestrictionGroupSearchCriteria;
import com.fox.it.erm.service.RestrictionGroupService;

@Stateless
public class RestrictionGroupServiceBean implements RestrictionGroupService {

	@Inject
	private EntityManager entityManager;
	
	/* (non-Javadoc)
	 * @see com.fox.it.erm.service.RestrictionGroupService#findAllRestrictionGroups()
	 */
	@Override
	public Object findAllRestrictionGroups(){
		
		RestrictionGroupSearchCriteria r = new RestrictionGroupSearchCriteria(entityManager);
		r.addSort("restrictionTypeCode");
		List<RestrictionGroup> list = r.getResultList();
		if(list != null && !list.isEmpty()){
			return list.toArray();
		}
		return new RestrictionGroup[0];
	}
}
